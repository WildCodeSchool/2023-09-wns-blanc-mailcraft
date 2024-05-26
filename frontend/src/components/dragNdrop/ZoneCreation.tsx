import { useTemplate } from "@/contexts/TemplateContext";
import { useEffect } from "react";
const ZoneCreation = () => {
  const { setZones, zones } = useTemplate();

  useEffect(() => {
    console.log("zones are", zones);
  }, [zones]);

  const createZones = (number: number) => {
    const newZones = Array.from({ length: number }).map((_, index) => ({
      id: `zone-${index}`,
      moduleType: "",
      size: "",
      content: "",
    }));

    setZones(newZones);
  };

  return (
    <section className="flex gap-2">
      {[1, 2, 3].map((number) => (
        <button
          key={number}
          className="border-2 border-gray-950 p-2"
          onClick={() => createZones(number)}
        >
          {number} ZONE{number > 1 ? "S" : ""}
        </button>
      ))}
    </section>
  );
};

export default ZoneCreation;
