import { Template } from "../entities/template";
import { Zone } from "../entities/zone";

export const createZone = async (
  templateId: number,
  zoneOrder: number
): Promise<Zone> => {
  try {
    const newZone = new Zone();
    newZone.order = zoneOrder;
    newZone.templateId = templateId;
    await newZone.save();
    console.log(`zone ${newZone.id} succesfully created`);
    return newZone;
  } catch (error: any) {
    throw new Error(`error while creating zone ${error.message}`);
  }
};

export const modifyZone = async (
  zoneId: number,
  zoneOrder: number
): Promise<string> => {
  try {
    const zoneToModify = await Zone.findOneByOrFail({
      id: zoneId,
    });
    if (!zoneToModify) {
      throw new Error("SubZone not found");
    }
    if (zoneOrder !== zoneToModify.order) {
      zoneToModify.order = zoneOrder;
      await zoneToModify.save();
      return `zone ${zoneId} succesfully modified`;
    }
    return ` No modifications were needed for zone: ${zoneId}`;
  } catch (error: any) {
    throw new Error(`error while updating zone ${error.message}`);
  }
};

export const deleteTemplateZones = async (
  templateId: number,
  zonesId: number[]
): Promise<string> => {
  try {
    const template = await Template.findOneOrFail({
      where: { id: templateId },
      relations: ["zones"],
    });

    const deletions = template.zones
      .filter((zone: Zone) => zonesId.includes(zone.id))
      .map((zone: Zone) => zone.remove());

    await Promise.all(deletions);

    return `Zones for template ${templateId} have been successfully deleted`;
  } catch (error) {
    console.error(
      `Error while deleting zones for template: ${templateId}, : ${error}`
    );
    return `No zones have been deleted for template ${templateId}`;
  }
};
