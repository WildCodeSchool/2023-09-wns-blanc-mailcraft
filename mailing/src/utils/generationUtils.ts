import fs from "fs";
import path from "path";
import sanitizeHtml from "sanitize-html";

interface SubZone {
  id?: number;
  dndId?: string;
  order: number;
  moduleType: string;
  content: string;
  width?: string;
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

// const validateURL = (url: string): boolean => {
//   const urlPattern = /^(https:\/\/)[\w.-]+\.[a-zA-Z]{2,}$/;
//   console.log(urlPattern);
//   return urlPattern.test(url);
// };

const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// const isValidUrl = (content: string[]): boolean => {
//   return content.every((url) => validateURL(url));
// };

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// NOUVELLE VERSION AVEC LE TEXTE CUSTOMIZE
const createTextElement = (content: string): string => {
  return `<div style="margin: 0; word-wrap: break-word; max-width: 100%;">${content}</div>`;
};

const createImageElement = (src: string): string => {
  const sanitizedSrc = escapeHtml(src);
  return `<img src="${sanitizedSrc}" alt="Image" style="max-width: 100%; height: auto; display: block;" />`;
};

// const createLinkElement = (content: string, links: string[]): string => {
//   const userSocialMedias = content.split(",").map((item) => item.trim());
//   return userSocialMedias
//     .map((socialMedia, index) => {
//       // ajouter lien user ici pour créer une icone et un lien
//       let iconSrc = "";
//       switch (socialMedia.toLowerCase()) {
//         case "facebook":
//           iconSrc =
//             "https://res.cloudinary.com/dyhn66mah/image/upload/v1720706135/Mailcraft/hdhhisfe0vwc8qg5rcb4.png";
//           break;
//         case "twitter":
//           iconSrc =
//             "https://res.cloudinary.com/dyhn66mah/image/upload/v1720706136/Mailcraft/i05pdxve7ld58salwefj.png";
//           break;
//         case "linkedin":
//           iconSrc =
//             "https://res.cloudinary.com/dyhn66mah/image/upload/v1720706137/Mailcraft/kppjcg5nrk2pwwpfktpe.png";
//           break;
//         default:
//           iconSrc = "";
//       }
//       const sanitizedLink = escapeHtml(links[index] || "");
//       return iconSrc
//         ? `<a href="${sanitizedLink}" target="_blank" rel="noopener noreferrer"><img src="${iconSrc}" alt="${socialMedia}" style="width: 24px; height: 24px; margin-right: 10px; display: inline-block;" /></a>`
//         : `<a href="${sanitizedLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block;">${sanitizedLink}</a>`;
//     })
//     .join(" ");
// };

const createLinkElement = (userLinks: any) => {
  let html = "";

  userLinks.forEach((linkObject: any) => {
    Object.entries(linkObject).forEach(([key, value]) => {
      if (typeof value !== "string" || !value || !validateURL(value)) return;
      let iconSrc = "";
      switch (key.toLowerCase()) {
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
          return;
      }

      if (iconSrc) {
        html += `<a href="${escapeHtml(
          value
        )}" target="_blank" rel="noopener noreferrer"><img src="${iconSrc}" alt="${key}" style="width: 24px; height: 24px; margin-right: 10px; display: inline-block;" /></a>`;
      }
    });
  });

  return html;
};

const updateHtmlFile = (newHtml: string, file: string): Promise<void> => {
  const filePath = path.resolve(__dirname, `../${file}`);
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

export const convertTemplateToHtmlInline = async (
  templateZones: TemplateZone[],
  userLinks: any[]
): Promise<string> => {
  let templateHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; background-color: #fff;">`;

  templateZones.forEach((zone) => {
    let subzoneCount = zone.subZones.length;
    let subzoneClass =
      subzoneCount === 2
        ? "width: 50%;"
        : subzoneCount === 3
        ? "width: 33.33%;"
        : "width: 100%;";

    let zoneHtml = `<div style="width: 100%; display: flex; flex-wrap: wrap; margin-bottom: 20px;">`;

    zone.subZones.forEach((subZone) => {
      let subZoneHtml = `<div style="display: inline-block; vertical-align: top; ${subzoneClass} box-sizing: border-box; padding: 10px; overflow-wrap: break-word; word-wrap: break-word; hyphens: auto;">`;

      if (subZone.moduleType === "texte" && isValidText(subZone.content)) {
        subZoneHtml += createTextElement(subZone.content);
      } else if (subZone.moduleType === "image") {
        subZoneHtml += createImageElement(subZone.content);
      } else if (subZone.moduleType === "social" && userLinks) {
        subZoneHtml += createLinkElement(userLinks);
      } else {
        subZoneHtml += `<p style="margin: 0;">Invalid content</p>`;
      }

      subZoneHtml += `</div>`;
      zoneHtml += subZoneHtml;
    });

    zoneHtml += `</div>`;
    templateHtml += zoneHtml;
  });

  templateHtml += `</div></body></html>`;

  const sanitizedHtml = sanitizeHtml(templateHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      "*": ["style"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "style"],
    },
  });

  await updateHtmlFile(sanitizedHtml, "templateInline.html");
  return sanitizedHtml;
};
