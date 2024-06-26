import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findUser } from "../services/usersServices.js";

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Authorization header not found"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Bearer not found"));
  }

  try {
    const { id } = verifyToken(token);
    const user = await findUser({ _id: id });

    if (user.token === null || user.token !== token) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    return next(HttpError(401, "Not authorized"));
  }
};

export default authenticate;
