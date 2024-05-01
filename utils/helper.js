import { v4 as uuid } from "uuid";

import { supportedMimeTypes } from "../config/filesystem.js";

export const imageValidator = (size, mimeType) => {
  // check the supported file types
  if (!supportedMimeTypes.includes(mimeType)) {
    return "Profile image must be of type jpg, jpeg, png, svg, gif, webp";
  }
  // Maximum file upload size is 2 MB
  else if (bytesToMB(size) > 2) {
    return "Profile image size should be less than 2 MB";
  } else return null;
};

export const bytesToMB = (sizeInBytes) => {
  return sizeInBytes / (1024 * 1024);
};

export const generateRandomName = () => {
  return uuid();
};
