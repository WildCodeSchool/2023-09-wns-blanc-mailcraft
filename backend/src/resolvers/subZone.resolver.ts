import { SubZone } from "../entities/subZone";
import { SubZoneInput } from "../types/createSubZoneInput";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import * as subZoneService from "../services/subZone.service";

@Resolver(SubZone)
export class SubZoneResolver {
  @Authorized()
  @Mutation(() => String)
  async createSubZone(@Arg("subZoneData") subZoneData: SubZoneInput) {
    try {
      return await subZoneService.createSubZone(subZoneData);
    } catch (e) {
      throw new Error("Error creating subzone" + e);
    }
  }

  @Authorized()
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

  @Authorized()
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
