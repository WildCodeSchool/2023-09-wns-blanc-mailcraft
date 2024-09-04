import { TemplateKey, TemplateInput } from "../types/modifyTemplateInputs";
import { TemplateCreationInput } from "../types/createTemplateInput";
import { Template } from "../entities/template";

export const createTemplate = async (
  templateData: TemplateCreationInput
): Promise<Template> => {
  try {
    const newTemplate = new Template();
    newTemplate.title = templateData.title;
    newTemplate.description = templateData.description || "";
    newTemplate.templateNature = templateData.templateNature || "Autre";
    newTemplate.status = templateData.status;
    newTemplate.userId = templateData.userId;
    await newTemplate.save();
    return newTemplate;
  } catch (error: any) {
    throw new Error(`Error creating template ${error.message}`);
  }
};

export const modifyTemplate = async (
  templateId: number,
  templateData: TemplateInput
): Promise<Template> => {
  try {
    const templateToModify = await Template.findOneByOrFail({ id: templateId });
    if (!templateToModify) {
      throw new Error("Template not found");
    }
    Object.entries(templateData).forEach(([key, value]) => {
      if (key in templateToModify) {
        const templateKey = key as keyof typeof templateToModify;
        if (templateToModify[templateKey] !== value) {
          templateToModify[templateKey] = value;
        }
      } else {
        console.warn(`Key ${key} is not a valid property of Template`);
      }
    });

    await templateToModify.save();
    console.log(`Template ${templateId} successfully updated`);
    return templateToModify;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error("Error modifying the template: " + error.message);
    } else {
      console.error("An unknown error occurred.");
      throw new Error("An unknown error occurred while modifying the template");
    }
  }
};

export const deleteTemplate = async (templateId: number): Promise<string> => {
  try {
    const templateToDelete = await Template.findOneByOrFail({ id: templateId });
    await templateToDelete.remove();
    return "Template successfully deleted.";
  } catch (error) {
    console.error("Error deleting template:", error);
    throw new Error("Failed to delete template.");
  }
};

export const getAllUserCreatedTemplates = async (
  userId: number
): Promise<Template[]> => {
  return await Template.find({
    where: { userId, status: "created" },
    relations: ["zones", "zones.subZones"],
  });
};

export const getAllUserDraftTemplates = async (
  userId: number
): Promise<Template[]> => {
  return await Template.find({
    where: { userId, status: "draft" },
    relations: ["zones", "zones.subZones"],
  });
};

export const getAllTemplates = async (): Promise<Template[]> => {
  return await Template.find({ relations: ["zones", "zones.subZones"] });
};

export const getTemplateByItsId = async (
  templateId: number
): Promise<Template | string> => {
  try {
    const template = await Template.findOneOrFail({
      where: { id: templateId },
      relations: ["zones", "zones.subZones"],
    });
    return template;
  } catch (error) {
    console.error(error);
    return "no template found";
  }
};
