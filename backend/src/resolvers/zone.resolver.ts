import { Zone } from "../entities/zone";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import * as zoneService from "../services/zone.service";
import { ZoneInput } from "../types/createZoneInput";

@Resolver(Zone)
export class ZoneResolver {
  @Mutation(() => Zone)
  async createZone(
    @Arg("templateId") templateId: number,
    @Arg("zoneOrder") zoneOrder: number
  ) {
    try {
      return await zoneService.createZone(templateId, zoneOrder);
    } catch (e) {
      throw new Error("Error creating zone" + e); // à typer et renvoyer error
    }
  }
  @Mutation(() => String)
  async deleteTemplateZones(
    @Arg("templateId") templateId: number,
    @Arg("zonesId", () => [Number]) zonesId: number[]
  ): Promise<string> {
    try {
      return await zoneService.deleteTemplateZones(templateId, zonesId);
    } catch (error) {
      console.error(
        `Error while deleting zones for template ${templateId}: ${error}`
      );
      throw new Error("Failed to delete zones");
    }
  }

  @Mutation(() => String)
  async updateZone(
    @Arg("zoneId") zoneId: number,
    @Arg("zoneOrder") zoneOrder: number
  ): Promise<string> {
    try {
      return await zoneService.modifyZone(zoneId, zoneOrder);
    } catch (error) {
      console.error("Error updating zone:", error);
      return `No update for zone : ${zoneId}`;
    }
  }
}
