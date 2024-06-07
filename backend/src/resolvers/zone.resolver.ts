import { Zone } from "../entities/zone";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import * as zoneService from "../services/zone.service";
import { ZoneInput } from "../types/createZoneInput";

@Resolver(Zone)
export class ZoneResolver {
  @Mutation(() => String)
  async createZone(@Arg("zoneData") zoneData: ZoneInput) {
    try {
      return await zoneService.createZone(zoneData);
    } catch (e) {
      throw new Error("Error creating zone" + e); // à typer et renvoyer error
    }
  }

  @Mutation(() => String)
  async updateZonesForTemplate(
    @Arg("templateId") templateId: number,
    @Arg("newZonesData", () => [ZoneInput]) newZonesData: ZoneInput[],
    @Arg("oldZonesId", () => [Number]) oldZonesId: number[]
  ): Promise<string> {
    try {
      const result = await zoneService.updateTemplateZones(
        templateId,
        newZonesData,
        oldZonesId
      );
      return result;
    } catch (error) {
      console.error("Failed to update zones for template:", error);
      throw new Error("Failed to update zones for the template");
    }
  }
}
