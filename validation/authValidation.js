import vine from "@vinejs/vine";

import { CustomErrorReporter } from "./customErrorReporter.js";

vine.errorReporter = () => new CustomErrorReporter();

export const registerSchema = vine.object({
  name: vine.string().minLength(2).maxLength(190),
  email: vine.string().email().minLength(8).maxLength(190),
  password: vine.string().minLength(5).maxLength(190).confirmed(),
});
