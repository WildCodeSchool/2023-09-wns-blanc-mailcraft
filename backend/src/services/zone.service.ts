import { Template } from "../entities/template";
import { Zone } from "../entities/zone";

export const createZone = async (templateId: number): Promise<Zone> => {
  try {
    const newZone = new Zone();
    newZone.templateId = templateId;
    await newZone.save();
    console.log(`zone ${newZone.id} succesfully created`);
    return newZone;
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
      .filter((zone: Zone) => zonesId.includes(zone.id))
      .map((zone: Zone) => zone.remove());

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
