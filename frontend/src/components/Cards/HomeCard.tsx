import { StaticImageData } from "next/image";
import Image from "next/image";
type HomeCardProps = {
  title: string;
  picture: any;
  description: string;
};

export default function HomeCard({
  title,
  picture,
  description,
}: HomeCardProps) {
  return (
    <div className="flex flex-col p-4 bg-[#fff] w-[90dvw]  my-8 md:w-[18dvw] rounded-xl xl:shadow-lg">
      <h1 className="font-bold text-lg text-center mt-7">{title}</h1>

      <Image
        className="mt-9 mb-14 w-4/6 h-4/6 object-cover m-auto rounded-full shadow-lg"
        src={picture}
        alt="Illustration feature"
        width={400}
        height={300}
      />

      <div className="text-base text-center  mb-10">
        <p>{description}</p>
      </div>
    </div>
  );
}
