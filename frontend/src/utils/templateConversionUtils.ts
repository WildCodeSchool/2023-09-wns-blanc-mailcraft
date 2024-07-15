import axios from "axios";

export const templateToHtml = async (templateZones) => {
  console.log(templateZones);

  try {
    const response = await axios.post(
      "http://localhost:5050/convertTemplateToHtmlInline",
      { templateZones },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    return data.html;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    console.error("Error config:", error.config);
    throw error;
  }
};

export const downloadHtmlTemplate = async (
  templateTitle: string,
  templateZones
) => {
  try {
    const htmlData = await templateToHtml(templateZones);
    const sanitizedTitle = templateTitle.replace(/\s+/g, "");
    const fileName = `${sanitizedTitle}.html`;

    const response = await axios.post(
      "http://localhost:5050/downloadHtmlTemplate",
      { templateTitle, htmlTemplate: htmlData },
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error during template download:", error);
  }
};
