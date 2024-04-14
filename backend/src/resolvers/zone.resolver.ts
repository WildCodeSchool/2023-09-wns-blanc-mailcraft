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
}
