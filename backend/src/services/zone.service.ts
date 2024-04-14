import { Zone } from "../entities/zone";
import { ZoneInput } from "../types/createZoneInput";

export const createZone = async (
  zoneData: ZoneInput
): Promise<String | undefined> => {
  try {
    const newZone = new Zone();
    newZone.moduleType = zoneData.moduleType;
    newZone.content = zoneData.content;
    if (zoneData.size) {
      newZone.size = zoneData.size;
    }
    newZone.templateId = zoneData.templateId;
    await newZone.save();
    console.log(newZone);
    return "zone succesfully created";
  } catch (error: any) {
    throw new Error(`error while creating zone ${error.message}`);
  }
};
