const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helper/wrapper");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pesanfilm/imageMovie",
  },
});
const maxSize = 1048576;
const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    if (
      !(
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      )
    ) {
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }

    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 1048576) {
      return cb(new Error("file must be under 1 MB"));
    }
    cb(null, true);
  },
}).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      return helperWrapper.response(response, 401, error.message, null);
    }
    if (error) {
      return helperWrapper.response(response, 401, error.message, null);
    }

    next();
  });
};

module.exports = handlingUpload;
