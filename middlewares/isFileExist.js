import HttpError from "../helpers/HttpError.js";

const isFileExist = (req, res, next) => {
  if (!req.file) {
    return next(HttpError(400, "No file provided"));
  }
  next();
};

export default isFileExist;
