import { SubZone } from "../entities/subZone";
import { SubZoneInput } from "../types/createSubZoneInput";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import * as subZoneService from "../services/subZone.service";

@Resolver(SubZone)
export class SubZoneResolver {
  @Mutation(() => String)
  async createSubZone(@Arg("subZoneData") subZoneData: SubZoneInput) {
    try {
      return await subZoneService.createSubZone(subZoneData);
    } catch (e) {
      throw new Error("Error creating subzone" + e); // à typer et renvoyer error
    }
  }

  @Mutation(() => String)
  async updateZoneSubZones(
    @Arg("zoneId") zoneId: number,
    @Arg("newSubZonesData", () => [SubZoneInput])
    newSubZonesData: SubZoneInput[],
    @Arg("oldSubZonesId", () => [Number]) oldSubZonesId: number[]
  ): Promise<string> {
    try {
      const result = await subZoneService.updateZoneSubZones(
        zoneId,
        newSubZonesData,
        oldSubZonesId
      );
      return result;
    } catch (error) {
      console.error("Failed to update subzones for zone:", error);
      throw new Error("Failed to update subzones for zone");
    }
  }
}
