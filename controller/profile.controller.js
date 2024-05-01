import prisma from "../DB/db.config.js";
import { generateRandomName, imageValidator } from "../utils/helper.js";

export class ProfileController {
  static getUser(req, res) {
    try {
      const user = req.user;
      res.status(200).json({ status: 200, user });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Something went wrong." });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;

      // check whether we have the profile object in req.files
      if (!req.files || Object.keys(req.files).length === 0) {
        return res
          .status(400)
          .json({ status: 400, message: "Profile image is required." });
      }

      // get the profile object from req.files
      const profile = req.files.profile;

      // check the image size and mimetype
      const imageValidationError = imageValidator(
        profile?.size,
        profile.mimetype
      );

      if (imageValidationError !== null) {
        return res
          .status(400)
          .json({ status: 400, errors: { profile: imageValidationError } });
      }

      // generate the random filename and attach it with file extension
      const imageExtension = profile.name.split(".")[1];
      const imageName = generateRandomName() + "." + imageExtension;

      // construct the local file path to save the file locally
      const filePath = process.cwd() + "/public/images/" + imageName;
      profile.mv(filePath, (error) => {
        if (error) throw error;
      });

      // save the new changes in the stored user object
      await prisma.users.update({
        data: {
          profile: imageName,
        },
        where: {
          id: Number(id),
        },
      });

      res.status(200).json({
        status: 200,
        message: "User profile updated successfully.",
        data: {
          name: profile.name,
          mime: profile.mimetype,
          size: profile?.size,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Something went wrong." });
    }
  }
}
