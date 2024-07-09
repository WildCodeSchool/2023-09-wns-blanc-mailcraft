import { useTemplate } from "@/contexts/TemplateContext";

export const zoneHasNoValue = (zone) => {
  return zone.subZones.length === 0;
};

export const closeModal = () => {
  const { setIsModalOpen } = useTemplate();
  setIsModalOpen(false);
};
