import vine, { errors } from "@vinejs/vine";

import { newsSchema } from "../validation/news.validation.js";
import { generateRandomName, imageValidator } from "../utils/helper.js";
import prisma from "../DB/db.config.js";

export class NewsController {
  static async getNews(req, res) {
    try {
      const user = req.user;
      const news = await prisma.news.findMany({});
      res.status(200).json({ status: 200, data: news });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Something went wrong." });
    }
  }

  static async create(req, res) {
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

      // generate the random filename and attach it with file extension
      const imageExtension = image.name.split(".")[1];
      const imageName = generateRandomName() + "." + imageExtension;

      // construct the local file path to save the file locally
      const filePath = process.cwd() + "/public/images/" + imageName;
      image.mv(filePath, (error) => {
        if (error) throw error;
      });

      //   add the image and user_id to the payload object
      payload.image = imageName;
      payload.user_id = user.id;

      // save the new news object in the stored News table
      const news = await prisma.news.create({
        data: payload,
      });

      res.status(201).json({
        status: 201,
        message: "News entry created successfully.",
        news,
      });
    } catch (error) {
      console.log({ error });
      if (error instanceof errors.E_VALIDATION_ERROR) {
        res.status(400).json({ errors: error.messages });
      } else {
        res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again.",
        });
      }
    }
    const user = req.user;
  }
}
