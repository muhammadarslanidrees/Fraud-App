import jwt from "jsonwebtoken";

export const JwtMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization || "";

  // return Unauthorized if the Authorization header is missing
  if (authorizationHeader === null || authorizationHeader === undefined) {
    res.status(401).json({ status: 401, message: "User is Unauthorized" });
  }

  // retrieve the token from the auth header
  const token = authorizationHeader.split(" ")[1];

  //   verify the token and return the error if the token is not the correct
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ status: 401, message: "User is Unauthorized" });
    }

    // save the user to the request object and pass the flow to the route controller
    req.user = payload;
    next();
  });
};
