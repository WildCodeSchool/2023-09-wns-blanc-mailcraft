import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const port = 5000;
const app = express();

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => {
    return {
      folder: process.env.UPLOAD_FOLDER,
    };
  },
});

const parser = multer({ storage: storage });

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("server running");
});

app.post(
  "/template-images-upload",
  parser.single("file"),
  (req: MulterRequest, res: Response) => {
    if (req.file && req.file.path) {
      res.json({ url: req.file.path });
    } else {
      res.status(400).json({ message: "No file uploaded." });
    }
  }
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
