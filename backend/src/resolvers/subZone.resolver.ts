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

  // @Mutation(() => String)
  // async updateZoneSubZones(
  //   @Arg("zoneId") zoneId: number,
  //   @Arg("newSubZonesData", () => [SubZoneInput])
  //   newSubZonesData: SubZoneInput[]
  // ): Promise<string> {
  //   try {
  //     const result = await subZoneService.updateZoneSubZones(
  //       zoneId,
  //       newSubZonesData
  //     );
  //     return result;
  //   } catch (error) {
  //     console.error("Failed to update subzones for zone:", error);
  //     throw new Error("Failed to update subzones for zone");
  //   }
  // }

  @Mutation(() => String)
  async deleteOldSubZones(
    @Arg("oldSubZonesId", () => [Number]) oldSubZonesId: number[]
  ): Promise<String> {
    try {
      return await subZoneService.deleteOldSubZones(oldSubZonesId);
    } catch (error) {
      console.error(`Error while deleting oldSubZones`);
      throw new Error("Failed to delete old sub zones");
    }
  }

  @Mutation(() => String)
  async modifySubZone(
    @Arg("subZoneId") subZoneId: number,
    @Arg("subZoneData") subZoneData: SubZoneInput
  ): Promise<string> {
    try {
      return await subZoneService.modifySubZone(subZoneId, subZoneData);
    } catch (error: any) {
      console.log(`Error updating subZone ${subZoneId}: ${error.message}`);
      throw new Error("Not updated");
    }
  }
}
