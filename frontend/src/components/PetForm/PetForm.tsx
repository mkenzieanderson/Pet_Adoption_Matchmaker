import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Buttons/Button";
import TextInput from "../TextInput/TextInput";
import Form from "../Form/Form";
import Dropdown from "../Dropdown/Dropdown";
import ImgUpload from "../ImgUpload/ImgUpload";
import Checklist from "../Checklist/Checklist";

import { 
    TypeOptions, 
    DogBreedOptions, 
    CatBreedOptions,
    AgeOptions,
    GenderOptions,
    DispositionOptions,
    AvailabilityOptions
 } from "../Dropdown/PetOptions";

type PetData = {
    name: string;
    type: string;
    breed: string;
    age: number | null;
    gender: string;
    availability: string;
    disposition: (string | number)[];
    imageURL: string | null;
};

type PetFormProps = {
    mode: "add" | "edit",
    initialData?: PetData;
    submitHandler: (data: PetData) => void;
}

export const PetFormPage: React.FC<PetFormProps> = ({ mode, initialData, submitHandler }) => {
    const navigate = useNavigate();
    const errorMsg = "One or more fields are missing. Please fill in all fields before submitting.";

    const [name, setName] = useState(initialData?.name || "");
    const [type, setType] = useState(initialData?.type || "");
    const [breed, setBreed] = useState(initialData?.breed || "");
    const [age, setAge] = useState<number | null>(initialData?.age || null);
    const [gender, setGender] = useState(initialData?.gender || "");
    const [availability, setAvailability] = useState(initialData?.availability || "");
    const [selectedOptions, setSelectedOptions] = useState<(string | number)[]>(initialData?.disposition || []);
    const [imageURL, setImageURL] = useState<string | null>(initialData?.imageURL || null);
    const [showError, setShowError] = useState(false);

    function getAllFormData() {
        const petData: PetData = {
            name,
            type,
            breed,
            age,
            gender,
            availability,
            disposition: selectedOptions,
            imageURL
        };
        return petData
    }
    
    function handleSubmit() {
        if (!name || (!type || (type !== "other" && !breed)) || !age || !gender || !availability || !imageURL) {
            setShowError(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        setShowError(false);
        const petData = getAllFormData();
        submitHandler(petData);
        navigate('/pets-page');
    }

    return (
        <>
            <div className="place-items-center">
                <div className="w-3/5 mt-10 mb-16">
                    <Form
                        title={mode === "add" ? "Add New Pet" : "Edit Pet"}
                        error_msg={showError ? errorMsg : ""} 
                    >
                        <div className="place-items-center mt-8">
                            <ImgUpload
                                imageURL={imageURL}
                                setImageURL={setImageURL}
                            />
                        </div>

                        <div className="flex space-x-24 mt-3">
                            <TextInput
                                type="text"
                                title="Name"
                                width="w-full"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Dropdown
                                title="Type"
                                width="min-w-[150px]"
                                options={TypeOptions}
                                onChange={(option) => setType(option.value.toString())}
                                value={type}
                            />
                            { (type === "cat" || type === "dog") && <Dropdown
                                title="Breed"
                                width="min-w-[250px]"
                                options={type === "cat" ? CatBreedOptions : DogBreedOptions}
                                onChange={(option) => setBreed(option.value.toString())}
                                value={breed}
                            />}
                        </div>

                        <div className="flex space-x-20">
                            <Dropdown
                                title="Age"
                                width="min-w-[150px]"
                                options={AgeOptions}
                                onChange={(option) => setAge(Number(option.value))}
                                value={age ? age.toString() : ""}
                            />
                            <Dropdown
                                title="Gender"
                                width="min-w-[175px]"
                                options={GenderOptions}
                                onChange={(option) => setGender(option.value.toString())}
                                value={gender}
                            />
                            <Dropdown
                                title="Availability"
                                width="min-w-[225px]"
                                options={AvailabilityOptions}
                                onChange={(option) => setAvailability(option.value.toString())}
                                value={availability}
                            />
                        </div>
                        <div>
                            <Checklist
                                title="Disposition"
                                options={DispositionOptions}
                                selectedOptions={selectedOptions}
                                setSelectedOptions={setSelectedOptions}
                            />
                        </div>
                        <div className="text-center mt-4">
                            <Button 
                                text={mode === "add" ? "ADD PET" : "SAVE PET"}
                                onClick={handleSubmit}
                            />
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};