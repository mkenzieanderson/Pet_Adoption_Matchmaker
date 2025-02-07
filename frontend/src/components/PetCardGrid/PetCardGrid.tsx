import PetProfileCard from "../PetProfileCard/PetProfileCard";
import { pets } from "./TempData";
import { dummyUser } from "../../state/User.types";
import { Pet } from "../../state/Pet.types";
import { User } from "../../state/User.types";

interface PetCardGridProps {
    pet?: Pet;
    user: User;
}

const PetCardGrid = ({user}: PetCardGridProps) => {
    const title = user.type === 'user' ? 'Saved Pets' : 'My Shelter';

    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-semibold text-espresso mx-auto mt-4">{title}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-32 gap-y-6">
                    {pets.map((pet, index) => (
                        <PetProfileCard key={index} pet={pet} user={dummyUser} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default PetCardGrid;