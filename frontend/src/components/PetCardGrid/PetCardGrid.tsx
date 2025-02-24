import PetProfileCard from "../PetProfileCard/PetProfileCard";
import Button from "../Buttons/Button";
import { pets } from "./TempData";
import { Pet } from "../../state/Pets/Pet.types";
import { User } from "../../state/User/User.store";
import { useNavigate } from "react-router-dom";

interface PetCardGridProps {
    pet?: Pet;
    user: User | null;
}

const PetCardGrid = ({user}: PetCardGridProps) => {
    const navigate = useNavigate();
    const title = user?.role === 'user' ? 'My Saved Pets' : 'My Shelter';

    return (
        <>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full px-4">
                    <h1 className="text-3xl font-semibold text-espresso my-6 mx-auto">{title}</h1>
                    {user?.role === 'admin' ? (
                        <div className="my-auto mb-6">
                            <Button text="ADD PET" onClick={() => navigate("/add-pet-page")} />
                        </div>
                    ) : null}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-40 gap-y-6">
                    {pets.map((pet, index) => (
                        <PetProfileCard key={index} pet={pet} user={user} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default PetCardGrid;