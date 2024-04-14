//resolver

import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Template } from "../entities/template";
import { TemplateInput } from "../types/createTemplateInput";
import * as templateService from "../services/template.service";

@Resolver(Template)
export class TemplateResolver {
  @Mutation(() => Template)
  async createTemplate(
    @Arg("templateData") templateData: TemplateInput
  ): Promise<Template> {
    try {
      return await templateService.createTemplate(templateData);
    } catch (e) {
      throw new Error("error while creating template" + e); // à typer
    }
  }

  @Mutation(() => String)
  async deleteTemplate(@Arg("templateId") templateId: number): Promise<String> {
    try {
      return await templateService.deleteTemplate(templateId);
    } catch (e) {
      throw new Error(`error while deleting template` + e);
    }
  }
}
