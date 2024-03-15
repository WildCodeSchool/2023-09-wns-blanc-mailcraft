import boldIcon from "@/assets/design/boldIcon.png";
import italicIcon from "@/assets/design/italicIcon.png";
import underlineIcon from "@/assets/design/underlineIcon.png";
import alignLeft from "@/assets/design/alignLeft.png";
import alignCenter from "@/assets/design/alignCenter.png";
import alignRight from "@/assets/design/alignRight.png";
import { useState } from "react";

interface StyleIconProps {
  src: string;
  alt: string;
}

interface JustificationIconProps {
  src: string;
  alt: string;
}

export default function DesignCard() {
  const [selectedStyleIconIndex, setSelectedStyleIconIndex] = useState<number | null>(null);
  const [selectedJustificationIconIndex, setSelectedJustificationIconIndex] = useState<number | null>(null);

  const handleStyleIconClick = (index: number) => {
    setSelectedStyleIconIndex(index === selectedStyleIconIndex ? null : index);
  };

  const handleJustificationIconClick = (index: number) => {
    setSelectedJustificationIconIndex(index === selectedJustificationIconIndex ? null : index);
  };

  const styleIcons: StyleIconProps[] = [
    { src: boldIcon.src, alt: "Bold Icon" },
    { src: italicIcon.src, alt: "Italic Icon" },
    { src: underlineIcon.src, alt: "Underline Icon" }
  ];

  const justificationIcons: JustificationIconProps[] = [
    { src: alignLeft.src, alt: "Align left Icon" },
    { src: alignCenter.src, alt: "Align center Icon" },
    { src: alignRight.src, alt: "Align right Icon" }
  ];

  return (
    <div className="w-72 max-w-sm p-4 bg-red-400 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
      <form className="space-y-4" action="#">
        <h5 className="text-xl font-medium text-gray-900 text-center">Design</h5>
        <div>
          <label htmlFor="police" className="block mb-2 text-sm font-medium text-gray-900">Police</label>
          <input type="text" name="police" id="police" placeholder="Arial" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5" required />
        </div>
        <div>
          <label htmlFor="size" className="block mb-2 text-sm font-medium text-gray-900">Taille</label>
          <input type="text" name="size" id="size" placeholder="12" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5" required />
        </div>
        <div>
          <label htmlFor="color" className="block mb-2 text-sm font-medium text-gray-900">Couleur</label>
          <input type="text" name="color" id="color" placeholder="Black" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5" required />
        </div>
        <div>
          <label htmlFor="style" className="block mb-2 text-sm font-medium text-gray-900">Style</label>
          <div className="flex bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-sm">
            {styleIcons.map((icon, index) => (
              <div
                key={index}
                className={`styleIcon flex-1 ${index === styleIcons.length - 1 ? '' : 'border-r'} border-gray-300 flex justify-center items-center cursor-pointer ${selectedStyleIconIndex === index ? 'bg-gray-300' : ''}`}
                onClick={() => handleStyleIconClick(index)}
              >
                <img src={icon.src} className="h-6" alt={icon.alt} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="justification" className="block mb-2 text-sm font-medium text-gray-900">Justification</label>
          <div className="flex bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-sm">
            {justificationIcons.map((icon, index) => (
              <div
                key={index}
                className={`justificationIcon ${index === justificationIcons.length - 1 ? '' : 'border-r'} flex-1 border-gray-300 flex justify-center items-center cursor-pointer ${selectedJustificationIconIndex === index ? 'bg-gray-300' : ''}`}
                onClick={() => handleJustificationIconClick(index)}
              >
                <img src={icon.src} className="h-6" alt={icon.alt} />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}