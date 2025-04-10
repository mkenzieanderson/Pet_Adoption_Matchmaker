import PetProfileCard from "../PetProfileCard/PetProfileCard";
import Button from "../Buttons/Button";
import { Pet } from "../../state/Pets/Pet.store";
import { User } from "../../state/User/User.store";
import { useNavigate } from "react-router-dom";
import useShelterStore from "../../state/Shelter/Shelter.store";
import { useFetchShelterPets } from "../../apis/ShelterApis/useFetchShelterPets";
import { useFetchAllDispositions } from "../../apis/PetApis/useFetchDisposition";
import LoadingState from "../LoadingState/LoadingState";

interface PetCardGridProps {
    pet?: Pet;
    user: User | null;
}

const PetCardGrid = ({ user }: PetCardGridProps) => {
    const navigate = useNavigate();
    const title = user?.role === 'user' ? 'My Saved Pets' : 'My Shelter';
    const { shelter } = useShelterStore();

    let shelterPets: Pet[] = [];
    if (shelter) {
        const { data } = useFetchShelterPets(shelter.shelter_id);
        shelterPets = data || [];
    }

    const petsToDisplay = user?.role === 'user'
        ? user.favoritePets ?? []
        : shelterPets ?? [];

    const { data: dispositionsData, isLoading, isError } = useFetchAllDispositions(petsToDisplay || []);
    const petsWithDispositions = petsToDisplay.map((pet) => ({
        ...pet,
        disposition: dispositionsData?.[pet.pet_id] || [],
    }));

    const isPageLocked = isLoading;

    return (
        <>
            <div className="flex flex-col items-center w-full mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full px-4">
                    <h1 className="text-3xl font-header font-semibold text-espresso my-6 mx-auto">{title}</h1>
                    {user?.role === 'admin' ? (
                        <div className="my-auto mb-6">
                            <Button text="ADD PET" disabled={isPageLocked} onClick={() => navigate("/add-pet-page")} />
                        </div>
                    ) : null}
                </div>
                {isLoading ? (
                    <LoadingState />
                ) : isError ? (
                    <p className="text-red-500">Failed to fetch dispositions</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-40 gap-y-6">
                        {petsWithDispositions.length > 0 ? (
                            petsWithDispositions.map((pet, index) => (
                                <PetProfileCard key={index} pet={pet} user={user} />
                            ))
                        ) : (
                            <p className="text-gray-500">No pets found.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default PetCardGrid;