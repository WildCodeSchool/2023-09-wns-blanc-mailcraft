import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { convertTemplateToHtml } from "./utils/generationUtils";
import fs from "fs";
dotenv.config();

const port = 5050;
const app = express();

///////////////////////////////////////////////////////////////////////// Middleware
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/assets", express.static(path.join(__dirname, "assets")));
/////////////////////////////////////////////////////////////////////////

app.get("/", (req: Request, res: Response) => {
  res.send("server running");
});

app.post("/convertTemplateToHtml", async (req: Request, res: Response) => {
  const { templateZones } = req.body;
  console.log(JSON.stringify(templateZones, null, 2));
  try {
    const htmlTemplate = await convertTemplateToHtml(templateZones);
    res.status(200).json({ html: htmlTemplate });
  } catch (error: any) {
    console.error("Error during HTML conversion:", error);
    res
      .status(500)
      .json({ error: `Failed to convert template to HTML: ${error.message}` });
  }
});

app.get("/preview", (req, res) => {
  const filePath = path.join(__dirname, "template.html");

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Error accessing file:", err);
      return res.status(404).json({ error: "File not found" });
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to send file" });
        }
      }
    });
  });
});

app.post("/downloadHtmlTemplate", async (req: Request, res: Response) => {
  const { htmlTemplate, templateTitle } = req.body;

  if (!templateTitle) {
    return res.status(400).json({ error: "Template title is required" });
  }

  const sanitizedTitle = templateTitle.replace(/\s+/g, "");
  const fileName = `${sanitizedTitle}.html`;
  const filePath = path.join(__dirname, fileName);

  try {
    // Crée un fichier temporaire avec le html
    await fs.promises.writeFile(filePath, htmlTemplate);

    // On le télécharge pour le user
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ error: "Failed to send file" });
      } else {
        // On supprime ce fichier temporaire
        fs.promises.unlink(filePath).catch((error) => {
          console.error("Error deleting file:", error);
        });
      }
    });
  } catch (error: any) {
    console.error("Error during HTML conversion:", error);
    res
      .status(500)
      .json({ error: `Failed to convert template to HTML: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
