import React from "react";
import Header from "../components/Header/Header";
import { PetFormPage } from "../components/PetForm/PetForm";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";
import usePetStore from "../state/Pets/Pet.store";
import useShelterStore from "../state/Shelter/Shelter.store";
import { PetData } from "../components/PetForm/PetForm";

export const AddPetPage = () => {
    const user = useUserStore((state) => state.user);
    const auth = useAuthStore((state) => state);
    const { shelter }  = useShelterStore();
    const { addPet, addDisposition, uploadAvatar } = usePetStore();

    // Mackenzie: I'll change this later so that it has better error handling if unable
    // to grab the shelter data from global state
    if (!shelter) {
        return <div>Error: Failed to load shelter data</div>; 
    }

    async function submitHandler(_petId: number, petData: Omit<PetData, 'pet_id'>) {
        try {
            if (!auth.token) {
                console.error("No authorization token available");
                return;
            }
            const petID = await addPet(auth.token, {
                name: petData.name,
                type: petData.type,
                breed: petData.breed,
                age: petData.age,
                gender: petData.gender,
                availability: petData.availability,
                shelter_id: String(shelter?.shelter_id),
                description: "",
            });

            if (petData.disposition && petData.disposition.length > 0 && petID) {
                const filteredDispositions = petData.disposition.filter((disposition): disposition is string => disposition !== undefined);
                await addDisposition(auth.token, petID, filteredDispositions);
            }

            if (petData.imageFile && petID) {
                await uploadAvatar(petID, petData.imageFile);
            }

        } catch (error) {
            console.error('Error adding pet:', error);
        }
    }

    return (
        <>
            <Header user={user} path={location.pathname} loginStatus={auth.status} />
            <div className="mb-16">
                <PetFormPage mode="add" submitHandler={submitHandler}/>
            </div>
        </>
    )
}

const App: React.FC = () => <AddPetPage />

export default App;