import vine, { errors } from "@vinejs/vine";

import { NewsApiTransform } from "../transform/NewsApiTransform.js";
import { newsSchema } from "../validation/news.validation.js";
import {
  generateRandomName,
  imageValidator,
  removeImage,
  uploadFileLocally,
} from "../utils/helper.js";
import prisma from "../DB/db.config.js";
import redisCache from "../DB/redis.config.js";
import logger from "../config/logger.js";

export class NewsController {
  static async getNews(req, res) {
    try {
      const user = req.user;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      // validate the correct page size and limit
      if (page <= 0) {
        page = 1;
      }

      if (limit <= 0 || limit > 100) {
        limit = 10;
      }

      // assign the skip value while fetching the news data
      const skip = (page - 1) * limit;

      // calculate the total_pages from the news_count and limit values
      const newsCount = await prisma.news.count();
      const totalPages = Math.ceil(newsCount / limit);

      const news = await prisma.news.findMany({
        take: limit,
        skip: skip,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
      const transformNews = news?.map((item) =>
        NewsApiTransform.transform(item)
      );

      // sending the metadata along with news payload
      res.status(200).json({
        status: 200,
        news: transformNews,
        metadata: {
          totalPages,
          current_page: page,
          page_limit: limit,
        },
      });
    } catch (error) {
      logger.error(error?.message)
      return res
        .status(500)
        .json({ status: 500, message: "Something went wrong." });
    }
  }

  static async createNews(req, res) {
    try {
      const user = req.user;
      const body = req.body;

      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      // check whether we have the image object in req.files
      if (!req.files || Object.keys(req.files).length === 0) {
        return res
          .status(400)
          .json({ status: 400, message: "Image field is required." });
      }

      // get the image object from req.files
      const image = req.files?.image;

      // check the image size and mimetype
      const imageValidationError = imageValidator(image?.size, image.mimetype);

      if (imageValidationError !== null) {
        return res
          .status(400)
          .json({ status: 400, errors: { image: imageValidationError } });
      }

      const imageName = uploadFileLocally(image)

      //   add the image and user_id to the payload object
      payload.image = imageName;
      payload.user_id = user.id;

      // save the new news object in the stored News table
      const news = await prisma.news.create({
        data: payload,
      });

      // delete the redis cache for the /api/news route
      redisCache.del("/api/news", (error) => {
        if (error) throw error;
      });

      logger.info("News has been created successfully.")
      res.status(201).json({
        status: 201,
        message: "News has been created successfully.",
        news,
      });
    } catch (error) {
      logger.error(error?.message)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        res.status(400).json({ errors: error.messages });
      } else {
        res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again.",
        });
      }
    }
  }

  static async getNewsById(req, res) {
    try {
      const user = req.user;
      const id = Number(req.params.id);

      const news = await prisma.news.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      const transformNews = news ? NewsApiTransform.transform(news) : null;
      res.status(200).json({ status: 200, news: transformNews });
    } catch (error) {
      logger.error(error?.message)
      return res
        .status(500)
        .json({ status: 500, message: "Something went wrong." });
    }
  }

  static async updateNews(req, res) {
    try {
      const user = req.user;
      const id = req.params.id;
      const body = req.body;

      // fetch the news using news_id
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      // check if the user is same as the one who post this news
      if (user.id !== news.user_id) {
        return res
          .status(401)
          .json({ status: 401, message: "User is unauthorized." });
      }

      // validate the request body
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      const image = req?.files?.image;

      if (image) {
        // check the image size and mimetype
        const imageValidationError = imageValidator(
          image?.size,
          image.mimetype
        );

        if (imageValidationError !== null) {
          return res
            .status(400)
            .json({ status: 400, errors: { image: imageValidationError } });
        }

        // create the local file path using image and saving the file locally
        const imageName = uploadFileLocally(image);

        payload.image = imageName;

        // remove the previously updloaded news image
        await removeImage(news.image);
      }

      await prisma.news.update({
        data: payload,
        where: {
          id: Number(id),
        },
      });

      // delete the redis cache for the /api/news route
      redisCache.del("/api/news", (error) => {
        if (error) throw error;
      });

      logger.info("News Updated Successfully.")
      res.status(200).json({
        status: 200,
        message: "News Updated Successfully",
        payload: payload,
      });
    } catch (error) {
      logger.error(error?.message)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        res.status(400).json({ errors: error.messages });
      } else {
        res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again.",
        });
      }
    }
  }

  static async deleteNews(req, res) {
    try {
      const user = req.user;
      const id = Number(req.params.id);

      // fetch the news using news_id params
      const news = await prisma.news.findUnique({
        where: {
          id,
        },
      });

      // check to see if the user is same as the one who created this news
      if (user.id !== news.user_id) {
        return res
          .status(401)
          .json({ status: 401, message: "User is unauthorized." });
      }

      // remove the news image from local filesystem
      await removeImage(news.image);

      // delete the news from the news database
      await prisma.news.delete({
        where: {
          id,
        },
      });

      // delete the redis cache for the /api/news route
      redisCache.del("/api/news", (error) => {
        if (error) throw error;
      });

      logger.info(`News with id ${id} has been deleted successfully.`)
      res.status(200).json({
        status: 200,
        message: `News with id ${id} has been deleted successfully.`,
      });
    } catch (error) {
      logger.error(error?.message)
      return res
        .status(500)
        .json({ status: 500, message: "Something went wrong." });
    }
  }
}
