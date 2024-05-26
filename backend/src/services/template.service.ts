import { TemplateInput } from "../types/createTemplateInput";
import { Zone } from "../entities/zone";
import { Template } from "../entities/template";

export const createTemplate = async (
  templateData: TemplateInput
): Promise<Template> => {
  try {
    const newTemplate = new Template();
    newTemplate.title = templateData.title || "Title Test";
    newTemplate.description = templateData.description || "Description test";
    newTemplate.templateNature =
      templateData.templateNature || "Nature du template inconnue";
    newTemplate.status = templateData.status;
    newTemplate.userId = 1;
    await newTemplate.save();
    return newTemplate;
  } catch (error: any) {
    throw new Error(`Error creating template ${error.message}`);
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
    relations: ["zones"],
  });
};

export const getAllUserDraftTemplates = async (
  userId: number
): Promise<Template[]> => {
  return await Template.find({
    where: { userId, status: "draft" },
    relations: ["zones"],
  });
};

export const getAllTemplates = async (): Promise<Template[]> => {
  return await Template.find({ relations: ["zones"] });
};
