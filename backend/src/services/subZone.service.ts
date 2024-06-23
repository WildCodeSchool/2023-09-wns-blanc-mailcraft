import { Template } from "../entities/template";
import { Zone } from "../entities/zone";
import { SubZone } from "../entities/subZone";
import { SubZoneInput } from "../types/createSubZoneInput";
import { dataSource } from "../config/db";

export const createSubZone = async (
  subZoneData: SubZoneInput
): Promise<String | undefined> => {
  try {
    const newSubZone = new SubZone();
    newSubZone.moduleType = subZoneData.moduleType;
    newSubZone.content = subZoneData.content;
    newSubZone.size = subZoneData.size;
    if (
      subZoneData.links &&
      Array.isArray(subZoneData.links) &&
      subZoneData.links.length > 0
    ) {
      newSubZone.links = subZoneData.links;
    }
    newSubZone.zoneId = subZoneData.zoneId;
    await newSubZone.save();
    console.log(newSubZone);
    return `subZone for zone ${subZoneData.zoneId} succesfully created`;
  } catch (error: any) {
    throw new Error(`error while creating subZone ${error.message}`);
  }
};

export const deleteZoneSubZones = async (
  zoneId: number,
  subZonesId: number[]
): Promise<string> => {
  try {
    const zone = await Zone.findOneOrFail({
      where: { id: zoneId },
      relations: ["subZones"],
    });

    // Filtrer et supprimer les subZones
    const deletions = zone.subZones
      .filter((subZone: SubZone) => subZonesId.includes(subZone.id))
      .map((subZone: SubZone) => subZone.remove());

    // Attendre que toutes les suppressions soient terminées
    await Promise.all(deletions);

    return `SubZones for zone ${zoneId} have been successfully deleted`;
  } catch (error) {
    console.error(`Error while deleting subZones for zone ${zoneId}: ${error}`);
    return `No subZones have been deleted for zone ${zoneId}`;
  }
};
export const updateZoneSubZones = async (
  zoneId: number,
  newSubZonesData: Array<any>,
  oldSubZonesId: Array<number>
): Promise<string> => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const subZoneData of newSubZonesData) {
      const newSubZone = queryRunner.manager.create(SubZone, {
        moduleType: subZoneData.moduleType,
        content: subZoneData.content,
        ...(subZoneData.size && { size: subZoneData.size }),
        zoneId: zoneId,
      });
      await queryRunner.manager.save(newSubZone);
    }

    await queryRunner.manager.delete(SubZone, oldSubZonesId);

    await queryRunner.commitTransaction();
    return "Template , zones and subZones successfully updated";
  } catch (error) {
    // Rollback toute la transaction en cas d'erreur pour assurer l'intégrité
    await queryRunner.rollbackTransaction();
    console.error("Transaction failed:", error);
    return "Failed to update template , zones and subZones";
  } finally {
    await queryRunner.release();
  }
};
