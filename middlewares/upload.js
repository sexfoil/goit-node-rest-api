import path from "path";
import multer from "multer";
import HttpError from "../helpers/HttpError.js";
import { AVATAR_FILE_EXTENSIONS, PATHS } from "../constants/constants.js";

const destination = path.resolve(PATHS.TEMP);

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const userPreffix = req.user.email;
    const id = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${userPreffix}_${id}_${file.originalname}`;

    cb(null, filename);
  },
});

const limits = { fileSize: 1024 * 1024 * 5 };

const fileFilter = (req, file, cb) => {
  const fileExtension = file.originalname.split(".").pop();
  if (!AVATAR_FILE_EXTENSIONS.includes(fileExtension)) {
    return cb(
      HttpError(
        400,
        `[${AVATAR_FILE_EXTENSIONS}] extensions are allowed for uploading files.`
      )
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
