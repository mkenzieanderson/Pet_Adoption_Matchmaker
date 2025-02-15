import PetProfileCard from "../PetProfileCard/PetProfileCard";
import Button from "../Buttons/Button";
import { pets } from "./TempData";
import { dummyUser } from "../../state/User/User.types";
import { Pet } from "../../state/Pets/Pet.types";
import { User } from "../../state/User/User.types";

interface PetCardGridProps {
    pet?: Pet;
    user: User;
}

const PetCardGrid = ({user}: PetCardGridProps) => {
    const title = user.type === 'user' ? 'My Saved Pets' : 'My Shelter';

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="flex flex-row">
                    <h1 className="text-3xl font-semibold text-espresso mx-auto my-6">{title}</h1>
                    {user.type === 'admin' ? (
                         <div className="absolute right-[230px]">
                         <Button text="ADD PET" onClick={() => console.log('Add Pet')} />
                     </div>
                    ) : (
                        null
                    )
                }
                </div>
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