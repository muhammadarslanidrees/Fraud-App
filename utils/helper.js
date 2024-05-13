import { v4 as uuid } from "uuid";
import fs from "fs";

import { supportedMimeTypes } from "../config/filesystem.js";

export const imageValidator = (size, mimeType) => {
  // check the supported file types
  if (!supportedMimeTypes.includes(mimeType)) {
    return "User image must be of type jpg, jpeg, png, svg, gif, webp";
  }
  // Maximum file upload size is 2 MB
  else if (bytesToMB(size) > 2) {
    return "User image size should be less than 2 MB";
  } else return null;
};

export const bytesToMB = (sizeInBytes) => {
  return sizeInBytes / (1024 * 1024);
};

export const generateRandomName = () => {
  return uuid();
};

export const generateImageUrl = (imageUrl) => {
  return `${process.env.APP_BASEURL}/images/${imageUrl}`;
};

export const uploadFileLocally = (profile) => {
  // generate the random filename and attach it with file extension
  const imageExtension = profile.name.split(".")[1];
  const imageName = generateRandomName() + "." + imageExtension;

  // construct the local file path to save the file locally
  const filePath = process.cwd() + "/public/images/" + imageName;
  profile.mv(filePath, (error) => {
    if (error) throw error;
  });

  return imageName;
};

export const removeImage = async (imageName) => {
  // construct the local file path of the image that we need to delete
  const filePath = process.cwd() + "/public/images/" + imageName;

  // check if the file exists at the path
  if (fs.existsSync(filePath)) {
    // unlink or delete the file from that location
    fs.unlink(filePath, (error) => {
      if (error) throw error;
    });
  }
};
