import { rateLimit } from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 60, // How long to remember requests for, in milliseconds (15 minutes)
  limit: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  message: {
    status: 429,
    message:
      "You have reached your maximum limit. Please try again after 15 minutes",
  },
  statusCode: 429,
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

export default rateLimiter
