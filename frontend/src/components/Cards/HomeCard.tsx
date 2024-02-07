type HomeCardProps = {
    title: string;
    picture: string;
    description: string;
}

export default function HomeCard({ title, picture, description }: HomeCardProps) {
    return (
        <div className="flex flex-col w-[90dvw] mx-auto my-8 md:w-[18dvw] rounded-xl shadow-lg flex flex-col">
            <h1 className="font-bold text-lg text-center mt-7 mx">{title}</h1>
            <img className="mt-9 mb-14 w-4/6 h-4/6 object-cover m-auto rounded-full shadow-lg" src={picture} alt="Illustration feature"/>
            <div className="text-base text-center mx-2.5 mb-20">
                <p>{description}</p>
            </div>
        </div>
    );
}