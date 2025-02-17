import { Pet } from "../../state/Pets/Pet.types";

interface InfoCardProps {
    pet: Pet;
}

const InfoCard = ({ pet }: InfoCardProps) => {
    return (
        <>
            <div className="absolute bottom-0 left-0 bg-beige bg-opacity-95 text-espresso font-body p-2 w-full h-1/4 rounded-sm">
                <h2 className="flex justify-center text-4xl font-semibold">{pet.name}</h2>
                <div className="flex justify-center text-xl mt-4">
                    <span className={"mx-3"}>{pet.breed}</span>
                    <span>|</span>
                    <span className={"mx-3"}>{pet.age} y.o.</span>
                    <span className="mr-3">|</span>
                    <span>{pet.availability}</span>
                </div>
            </div>
        </>
    )
}

export default InfoCard;