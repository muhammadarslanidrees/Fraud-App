import vine, { errors } from "@vinejs/vine";

import { registerSchema } from "../validation/authValidation.js";
import prisma from "../DB/db.config.js";

export class authController {
  static async register(req, res) {
    try {
      const body = req.body;

      console.log("Body is : ", body);

      const validator = vine.compile(registerSchema);
      console.log("Validation Result is : ", validator);

      const payload = await validator.validate(body);

      console.log("\n Payload is : ", payload);

      res.json({ payload });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        res.status(400).json({ errors: error.messages });
      }
    }
  }

  static getHello(req, res) {
    res.json({ msg: "Hey. it is working!" });
  }
}
