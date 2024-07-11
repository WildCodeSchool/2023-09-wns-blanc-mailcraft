import fs from "fs";
import path from "path";
interface SubZone {
  id?: number;
  dndId?: string;
  order: number;
  moduleType: string;
  content: string;
  size?: string;
  links?: string[];
  zoneId?: number;
}

interface TemplateZone {
  id?: number;
  order: number;
  subZones: SubZone[];
  templateId?: number;
  dndId?: string;
}

const isValidText = (content: string): boolean => {
  return typeof content === "string" && content.trim() !== "";
};

const validateURL = (url: string): boolean => {
  const urlPattern = /^(https:\/\/)[\w.-]+\.[a-zA-Z]{2,}$/;
  return urlPattern.test(url);
};

const isValidUrl = (content: string[]): boolean => {
  return content.every((url) => validateURL(url));
};

const createTextElement = (content: string): string => {
  return `<p style="margin: 0; word-wrap: break-word; max-width: 100%;">${content}</p>`;
};

const createImageElement = (src: string): string => {
  return `<img src="${src}" alt="Image" style="max-width: 100%; height: auto; display: block;" />`;
};

const createLinkElement = (content: string, links: string[]): string => {
  const userSocialMedias = content.split(",").map((item) => item.trim());
  return userSocialMedias
    .map((socialMedia, index) => {
      let iconSrc = "";
      switch (socialMedia.toLowerCase()) {
        case "facebook":
          iconSrc =
            "https://res.cloudinary.com/dyhn66mah/image/upload/v1720706135/Mailcraft/hdhhisfe0vwc8qg5rcb4.png";
          break;
        case "twitter":
          iconSrc =
            "https://res.cloudinary.com/dyhn66mah/image/upload/v1720706136/Mailcraft/i05pdxve7ld58salwefj.png";
          break;
        case "linkedin":
          iconSrc =
            "https://res.cloudinary.com/dyhn66mah/image/upload/v1720706137/Mailcraft/kppjcg5nrk2pwwpfktpe.png";
          break;
        default:
          iconSrc = "";
      }
      return iconSrc
        ? `<a href="${links[index]}" target="_blank" rel="noopener noreferrer"><img src="${iconSrc}" alt="${socialMedia}" style="width: 24px; height: 24px; margin-right: 10px; display: inline-block;" /></a>`
        : `<a href="${links[index]}" target="_blank" rel="noopener noreferrer" style="display: inline-block;">${links[index]}</a>`;
    })
    .join(" ");
};

const updateHtmlFile = (newHtml: string): Promise<void> => {
  const filePath = path.resolve(__dirname, "../template.html");
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, newHtml, "utf-8", (err: any) => {
      if (err) {
        console.error("Error writing file:", err);
        reject(err);
      } else {
        console.log(`template.html preview on localhost:5050/preview`);
        resolve();
      }
    });
  });
};

export const convertTemplateToHtml = async (
  templateZones: TemplateZone[]
): Promise<string> => {
  let templateHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Template Email</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
        }
        .content {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          background-color: #fff;
        }
        .zone {
          margin-bottom: 20px;
        }
        .subzone {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          box-sizing: border-box;
          padding: 10px;
          overflow-wrap: break-word;
          word-wrap: break-word;
          hyphens: auto;
        }
        .subzone-2 {
          width: 50%;
        }
        .subzone-3 {
          width: 33.33%;
        }
        .social-icons img {
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
      </style>
    </head>
    <body>
      <div class="content">`;

  templateZones.forEach((zone) => {
    let subzoneCount = zone.subZones.length;
    let subzoneClass =
      subzoneCount === 2 ? "subzone-2" : subzoneCount === 3 ? "subzone-3" : "";

    let zoneHtml = `
      <div class="zone" style="width: 100%; display: flex; flex-wrap: wrap;">`;

    zone.subZones.forEach((subZone) => {
      let subZoneHtml = `
        <div class="subzone ${subzoneClass}">`;

      if (subZone.moduleType === "texte" && isValidText(subZone.content)) {
        subZoneHtml += createTextElement(subZone.content);
      } else if (subZone.moduleType === "image") {
        subZoneHtml += createImageElement(subZone.content);
      } else if (
        subZone.moduleType === "social" &&
        isValidUrl(subZone.links || [])
      ) {
        subZoneHtml += createLinkElement(subZone.content, subZone.links || []);
      } else {
        subZoneHtml += `<p style="margin: 0;">Invalid content</p>`;
      }

      subZoneHtml += `</div>`;
      zoneHtml += subZoneHtml;
    });

    zoneHtml += `</div>`;
    templateHtml += zoneHtml;
  });

  templateHtml += `
        </div>
    </body>
    </html>`;
  // on update "template.html" qui sert pour la preview avec le nouveau html
  await updateHtmlFile(templateHtml);
  return templateHtml;
};
