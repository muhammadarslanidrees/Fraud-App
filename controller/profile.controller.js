import { imageValidator, removeImage, uploadFileLocally } from "../utils/helper.js";
import prisma from "../DB/db.config.js";

export class ProfileController {
  static async getUser(req, res) {
    try {
      const user = req.user;
      // fetch the user from db
      const userData = await prisma.users.findUnique({
        where: {
          id: Number(user.id)
        }
      });

      // remove the password in the response 
      const { password, ...rest } = userData;
      res.status(200).json({ status: 200, user: rest });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Something went wrong." });
    }
  }

  static async updateUser(req, res) {
    try {
      const id = Number(req.params.id);
      console.log({ id });

      // getting the user using params id
      const user = await prisma.users.findUnique({
        where: {
          id: id,
        },
      });

      console.log({ user });

      // checking if the user is same as the one whose account we are updating
      if (user.id !== id) {
        console.log("Error inside the if block...");
        return res
          .status(400)
          .json({ status: 400, message: "User is unauthorized." });
      }
      
      // check whether we have the profile object in req.files
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          status: 400,
          errors: { message: "Profile image is required." },
        });
      }

      // get the profile object from req.files
      const image = req.files.image;

      // check the image size and mimetype
      const imageValidationError = imageValidator(image?.size, image.mimetype);

      if (imageValidationError !== null) {
        return res
          .status(400)
          .json({ status: 400, errors: { image: imageValidationError } });
      }

      // create the local file path using image and saving the file locally
      const imageName = uploadFileLocally(image);

      // remove the previously updloaded news image
      removeImage(user.image);

      // save the new changes in the stored user object
      await prisma.users.update({
        data: {
          image: imageName,
        },
        where: {
          id: Number(id),
        },
      });

      res.status(200).json({
        status: 200,
        message: "User image updated successfully.",
        data: {
          name: image.name,
          mime: image.mimetype,
          size: image?.size,
        },
      });
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ status: 500, message: "Something went wrong." });
    }
  }
}
