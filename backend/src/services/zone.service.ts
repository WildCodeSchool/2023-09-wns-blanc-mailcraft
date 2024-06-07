import { Template } from "../entities/template";
import { Zone } from "../entities/zone";
import { ZoneInput } from "../types/createZoneInput";
import { dataSource } from "../config/db";

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

export const deleteTemplateZones = async (
  templateId: number,
  zonesId: number[]
): Promise<string> => {
  try {
    const template = await Template.findOneByOrFail({
      id: templateId,
      relations: ["zones"],
    });

    // Filtrer et supprimer les zones
    const deletions = template.zones
      .filter((zone) => zonesId.includes(zone.id))
      .map((zone) => zone.remove());

    // Attendre que toutes les suppressions soient terminées
    await Promise.all(deletions);

    return `Zones for template ${templateId} have been successfully deleted`;
  } catch (error) {
    console.error(
      `Error while deleting zones for template: ${templateId}, : ${error}`
    );
    return `No zones have been deleted for template ${templateId}`;
  }
};

export const updateTemplateZones = async (
  templateId: number,
  newZonesData: Array<any>,
  oldZonesId: Array<number>
): Promise<string> => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const zoneData of newZonesData) {
      const newZone = queryRunner.manager.create(Zone, {
        moduleType: zoneData.moduleType,
        content: zoneData.content,
        ...(zoneData.size && { size: zoneData.size }),
        templateId: templateId,
      });
      await queryRunner.manager.save(newZone);
    }

    await queryRunner.manager.delete(Zone, oldZonesId);

    await queryRunner.commitTransaction();
    return "Template and zones successfully updated";
  } catch (error) {
    // Rollback toute la transaction en cas d'erreur pour assurer l'intégrité
    await queryRunner.rollbackTransaction();
    console.error("Transaction failed:", error);
    return "Failed to update template and zones";
  } finally {
    await queryRunner.release();
  }
};
