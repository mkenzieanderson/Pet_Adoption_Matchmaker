import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Button from "../components/Buttons/Button";
import TextInput from "../components/TextInput/TextInput";
import Form from "../components/Form/Form";
import Dropdown from "../components/Dropdown/Dropdown";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";

import { 
    TypeOptions, 
    DogBreedOptions, 
    CatBreedOptions,
    AgeOptions,
    GenderOptions,
    DispositionOptions,
    AvailabilityOptions
 } from "../components/Dropdown/PetOptions";


export const AddPetPage = () => {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const auth = useAuthStore((state) => state);

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState<number | null>(null);
    const [gender, setGender] = useState("");
    const [availability, setAvailability] = useState("");

    function clearFields() {
        setName("");
        setType("");
        setBreed("");
        setAge(null);
        setGender("");
        setAvailability("");
    }
    
    function handleSubmit() {
        clearFields();
        navigate('/pets-page');
    }

    return (
        <>
            <Header user={user} path={location.pathname} loginStatus={auth.status} />
            <div className="place-items-center">
                <div className="w-3/5 mt-10 mb-2">
                    <Form
                        title="Add New Pet" 
                    >
                        <div className="flex space-x-24 mt-6">
                            <TextInput
                                type="text"
                                title="Name"
                                width="w-full"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            >
                            </TextInput>
                            <Dropdown
                                title="Type"
                                width="min-w-[150px]"
                                options={TypeOptions}
                                onChange={(option) => setType(option.value.toString())}
                            >
                            </Dropdown>
                            { (type === "cat" || type === "dog") && <Dropdown
                                title="Breed"
                                width="min-w-[250px]"
                                options={type === "cat" ? CatBreedOptions : DogBreedOptions}
                                onChange={(option) => setBreed(option.value.toString())}
                            >
                            </Dropdown>}
                        </div>

                        <div className="flex space-x-20">
                            <Dropdown
                                title="Age"
                                width="min-w-[150px]"
                                options={AgeOptions}
                                onChange={(option) => setAge(Number(option.value))}
                            >
                            </Dropdown>
                            <Dropdown
                                title="Gender"
                                width="min-w-[175px]"
                                options={GenderOptions}
                                onChange={(option) => setGender(option.value.toString())}
                            >
                            </Dropdown>
                            <Dropdown
                                title="Availability"
                                width="min-w-[225px]"
                                options={AvailabilityOptions}
                                onChange={(option) => setAvailability(option.value.toString())}
                            >
                            </Dropdown>
                        </div>
                        <div className="text-center mt-4">
                            <Button 
                                text="ADD PET"
                                onClick={() => navigate('/pets-page')}
                            >
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}

const App: React.FC = () => <AddPetPage />

export default App;