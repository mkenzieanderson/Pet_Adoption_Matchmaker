import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import { dummyUser } from "../state/User/User.types";
import Button from "../components/Buttons/Button";
import TextInput from "../components/TextInput/TextInput";
import Form from "../components/Form/Form";
import Dropdown from "../components/Dropdown/Dropdown";
import { TypeOptions } from "../components/Dropdown/PetOptions";

export const AddPetPage = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [breed, setBreed] = useState("");

    return (
        <>
            <Header user={dummyUser} path={location.pathname} loginStatus={true} />
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
                                width="w-full"
                                options={TypeOptions}
                            >
                            </Dropdown>
                            <TextInput
                                type="text"
                                title="Breed"
                                width="w-full"
                                value={breed}
                                onChange={(e) => setBreed(e.target.value)}
                            >
                            </TextInput>
                        </div>

                    </Form>
                </div>
            </div>
        </>
    )
}

const App: React.FC = () => <AddPetPage />

export default App;