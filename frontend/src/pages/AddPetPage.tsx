import React, { useEffect } from "react";
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
    const { shelters, fetchShelters }  = useShelterStore();
    const { addPet } = usePetStore();

    useEffect(() => {
        if (auth.token) {
            fetchShelters(auth.token);
        }
    }, [auth.token, fetchShelters]);

    const shelter = shelters.find((shelter) => shelter.user_id === user?.user_id);
    const shelterID = shelter ? shelter.shelter_id : null;

    async function submitHandler(petData: PetData) {
        try {
            if (!auth.token) {
                console.error("No authorization token available");
                return;
            }
            if (!shelterID) {
                console.error("No shelter found for the current user.");
                return;
            }
            await addPet(auth.token, {
                name: petData.name,
                type: petData.type,
                breed: petData.breed,
                age: petData.age,
                gender: petData.gender,
                availability: petData.availability,
                disposition: petData.disposition,
                image: petData.imageURL,
                shelter: String(shelterID),
            });
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