import Dropdown from '../Dropdown/Dropdown';
import Button from '../Buttons/Button';
import { useState } from 'react';
import { 
    TypeOptions, 
    DogBreedOptions, 
    CatBreedOptions, 
    AgeOptions, 
    GenderOptions,
    AvailabilityOptions, 
    DispositionOptions 
} from '../Dropdown/PetOptions';


const FilterSidebar = () => {
    const [type, setType] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState<number | null>(null);
    const [gender, setGender] = useState("");
    const [disposition, setDisposition] = useState("");
    const [availability, setAvailability] = useState("");

    const handleApply = () => {
        console.log("Applying filters");
    }

    return (
        <div className="bg-cream pt-4 w-1/6 border-r-2 border-tawny-brown h-full">
            <div className="flex flex-col items-center">
                <div className="border-b-2 border-dashed border-tawny-brown w-full py-2">
                    <h2
                        className="text-center font-header font-semibold text-espresso text-2xl pb-4">
                        Filters
                    </h2>
                </div>
                <div className="pb-4">
                    <div className="my-4">
                        <Dropdown 
                            title="Type" 
                            width="w-[210px]" 
                            options={TypeOptions}
                            onChange={(option) => setType(option.value.toString())}
                        />
                    </div>
                    <div className="my-4">
                        <Dropdown 
                            title="Breed" 
                            width="w-[210px]" 
                            options={type === "cat" ? CatBreedOptions : DogBreedOptions}
                            onChange={(option) => setBreed(option.value.toString())}
                        />
                    </div>
                    <div className="my-4">
                        <Dropdown 
                            title="Age" 
                            width="w-[210px]" 
                            options={AgeOptions}
                            onChange={(option) => setAge(Number(option.value))}
                        />
                    </div>
                    <div className="my-4">
                        <Dropdown 
                            title="Gender" 
                            width="w-[210px]"  
                            options={GenderOptions}
                            onChange={(option) => setGender(option.value.toString())}
                        />
                    </div>
                    <div className="my-4">
                        <Dropdown 
                            title="Disposition" 
                            width="w-[210px]"  
                            options={DispositionOptions}
                            onChange={(option) => setDisposition(option.value.toString())}
                        />
                    </div>
                    <div className="my-4">
                        <Dropdown 
                            title="Availability" 
                            width="w-[210px]"  
                            options={AvailabilityOptions}
                            onChange={(option) => setAvailability(option.value.toString())}
                    />
                    </div>
                    <div className="flex justify-center my-[22px]">
                        <Button
                            text="APPLY"
                            onClick={handleApply}
                            className="bg-mustard text-espresso font-header 
                                    font-semibold border-tawny-brown border-4
                                    rounded-lg px-6 py-2 mt-4 mb-2 w-3/4
                                    hover:border-espresso hover:bg-transparent-clay
                                    focus:border-espresso focus:bg-transparent-clay
                                    focus:outline-espresso"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;