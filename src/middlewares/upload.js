const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedImgTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    if (allowedImgTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

module.exports = { upload };
