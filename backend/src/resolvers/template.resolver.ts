import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Template } from "../entities/template";
import { TemplateCreationInput } from "../types/createTemplateInput";
import { TemplateInput } from "../types/modifyTemplateInputs";
import * as templateService from "../services/template.service";

@Resolver(Template)
export class TemplateResolver {
  @Authorized()
  @Mutation(() => Template)
  async createTemplate(
    @Arg("templateData") templateData: TemplateCreationInput
  ): Promise<Template> {
    try {
      return await templateService.createTemplate(templateData);
    } catch (e) {
      throw new Error("error while creating template" + e);
    }
  }

  @Authorized()
  @Mutation(() => Template)
  async modifyTemplate(
    @Arg("templateId") templateId: number,
    @Arg("templateData") templateData: TemplateInput
  ): Promise<Template> {
    try {
      return await templateService.modifyTemplate(templateId, templateData);
    } catch (e) {
      throw new Error("error while modifying template" + e);
    }
  }

  @Authorized()
  @Mutation(() => String)
  async deleteTemplate(@Arg("templateId") templateId: number): Promise<String> {
    try {
      return await templateService.deleteTemplate(templateId);
    } catch (e) {
      throw new Error(`error while deleting template` + e);
    }
  }

  @Authorized()
  @Query(() => [Template])
  async getAllUserCreatedTemplates(
    @Arg("userId") userId: number
  ): Promise<Template[] | string> {
    try {
      return await templateService.getAllUserCreatedTemplates(userId);
    } catch (error) {
      throw new Error(`error while fetching templates` + error);
    }
  }

  @Authorized()
  @Query(() => [Template])
  async getAllUserDraftTemplates(
    @Arg("userId") userId: number
  ): Promise<Template[] | string> {
    try {
      return await templateService.getAllUserDraftTemplates(userId);
    } catch (error) {
      throw new Error(`error while fetching templates` + error);
    }
  }

  @Authorized()
  @Query(() => [Template])
  async getAllTemplates(): Promise<Template[] | string> {
    try {
      return await templateService.getAllTemplates();
    } catch (error) {
      throw new Error(`error while fetching templates` + error);
    }
  }

  @Authorized()
  @Query(() => Template)
  async getTemplateByItsId(
    @Arg("templateId") templateId: number
  ): Promise<Template | string> {
    try {
      return await templateService.getTemplateByItsId(templateId);
    } catch (error) {
      console.error(error);
      return `problem while fetching template with id ${templateId}`;
    }
  }
}
