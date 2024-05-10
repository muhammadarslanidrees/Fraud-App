import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import prisma from "../DB/db.config.js";

export class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      // checking the unqiue email constraint
      const isUserExist = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (isUserExist)
        res.status(400).json({
          status: 400,
          errors: {
            email: "Email already taken. Please use a different email address.",
          },
        });

      // Hashing the password
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);

      // saving the user to prisma
      const user = await prisma.users.create({
        data: payload,
      });

      // returning response to the user
      res.status(201).json({
        status: 201,
        message: "User created successfully.",
        data: user,
      });
    } catch (error) {
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

  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);

      // checking the user existence in the user table
      const foundUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });
      // Returns the response if no user found with the provided email
      if (!foundUser)
        return res.status(404).json({
          status: 404,
          errors: { email: "No user found with the provided email address." },
        });

      // Matching the provided password with the stored hashed password
      if (!bcrypt.compareSync(payload.password, foundUser.password))
        return res.status(400).json({
          status: 400,
          errors: { password: "Email or password is invalid." },
        });

      // if everything is validated then generate the token using Payload and Secret
      const jwtPayload = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        image: foundUser.profile || "",
      };

      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });

      // return the response to user along with access_token
      res.status(200).json({
        status: 200,
        message: "User logged in successfully.",
        access_token: `Bearer ${token}`,
      });
    } catch (error) {
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
}
