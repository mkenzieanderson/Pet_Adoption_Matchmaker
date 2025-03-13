import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Buttons/Button";
import TextInput from "../TextInput/TextInput";
import Form from "../Form/Form";
import Dropdown from "../Dropdown/Dropdown";
import ImgUpload from "../ImgUpload/ImgUpload";
import Checklist from "../Checklist/Checklist";
import { fetchAvatar } from "../../apis/PetApis/useFetchAvatar";
import { AgeOptions } from "../Dropdown/AgeOptions";
import { 
    TypeOptions, 
    DogBreedOptions, 
    CatBreedOptions,
    GenderOptions,
    DispositionOptions,
    AvailabilityOptions
 } from "../Dropdown/PetOptions";
 import useAuthStore from "../../state/Auth/Auth.store";

export type PetData = {
    pet_id: number;
    name: string;
    type: string;
    breed: string;
    age: number | undefined;
    gender: string;
    availability: string;
    disposition: (string | undefined)[];
    imageFile: File | undefined;
};

type PetFormPropsAdd = {
    mode: "add";
    initialData?: PetData;
    submitHandler: (identifier: string, data: Omit<PetData, 'pet_id'>) => void;
};

type PetFormPropsEdit = {
    mode: "edit";
    initialData: PetData;
    submitHandler: (identifier: number, data: Omit<PetData, 'pet_id'>) => void;
};

type PetFormProps = PetFormPropsAdd | PetFormPropsEdit;

export const PetFormPage: React.FC<PetFormProps> = ({ mode, initialData, submitHandler }) => {
    const navigate = useNavigate();
    const errorMsg = "One or more fields are missing. Please fill in all fields before submitting.";
    const auth = useAuthStore((state) => state);

    const [name, setName] = useState(initialData?.name || "");
    const [type, setType] = useState(initialData?.type || "");
    const [breed, setBreed] = useState(initialData?.breed || "");
    const [age, setAge] = useState<number | undefined>(initialData?.age || undefined);
    const [gender, setGender] = useState(initialData?.gender || "");
    const [availability, setAvailability] = useState(initialData?.availability || "");
    const [selectedOptions, setSelectedOptions] = useState<(string | undefined)[]>(initialData?.disposition || []);
    const [imageFile, setImageFile] = useState<File | undefined>(initialData?.imageFile || undefined);
    const [showError, setShowError] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loadingAvatar, setLoadingAvatar] = useState(true);
    const [_avatarError, setAvatarError] = useState(false);

    useEffect(() => {
        if (initialData?.pet_id) {
            const loadAvatar = async () => {
                try {
                    setLoadingAvatar(true);
                    const avatar = await fetchAvatar(initialData.pet_id);
                    setAvatarUrl(avatar);
                    setAvatarError(false);
                } catch (error) {
                    setAvatarError(true);
                    console.error("Error fetching avatar:", error);
                } finally {
                    setLoadingAvatar(false);
                }
            };
            loadAvatar();
        }
    }, [initialData]);
    
    function getAllFormData() {
        const petData: Omit<PetData, 'pet_id'> = {
            name,
            type,
            breed,
            age,
            gender,
            availability,
            disposition: selectedOptions,
            imageFile
        };
        return petData
    }
    
    function handleSubmit() {
        if (!name || (!type || (type !== "other" && !breed)) || !age || !gender || !availability || (!imageFile && !avatarUrl)) {
            setShowError(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        setShowError(false);
        const petData = getAllFormData();
        if (mode === "edit" && initialData?.pet_id) {
            submitHandler(initialData.pet_id, petData);
        } else if (mode === "add") {
            submitHandler(auth.token, petData);
        }
        navigate('/pets-page');
    }

    return (
        <>
            <div className="place-items-center">
                <div className="w-3/5 mt-10 mb-2">
                    <Form
                        title={mode === "add" ? "Add New Pet" : "Edit Pet"}
                        error_msg={showError ? errorMsg : ""} 
                    >
                        <div className="place-items-center mt-8">
                            <ImgUpload
                                imageFile={imageFile}
                                setImageFile={setImageFile}
                                avatarUrl={avatarUrl}
                                loadingAvatar={loadingAvatar}
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
                                value={age} 
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