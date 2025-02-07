import { Pet } from "../state/Pet.types";
import Button from "./Buttons/Button.tsx";
import { useState } from "react";
import { FaInfo, FaHeart, FaChevronDown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

interface HomePagePetCardProps {
    pet: Pet;
    }

const HomePagePetCard = ({ pet }: HomePagePetCardProps) => {
    const [toggleMoreInfo, setToggleMoreInfo] = useState(false);
    const buttonStyles = "absolute z-40 rounded-3xl bg-white px-2 py-2 border-solid border-4 border-espresso text-espresso hover:bg-clay"
    const titleStyles = "my-1 mx-4 text-xl font-bold"
    const contentStyles = "font-normal mx-4"

    return (
        <div className="bg-mustard w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-[684px] h-[560px] p-4 rounded-lg shadow-md relative">
            <div className="relative w-full h-full">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover rounded-t-lg" />
                <Button 
                    svgIcon={ toggleMoreInfo ? FaInfo: FaChevronDown } 
                    className={toggleMoreInfo ? `${buttonStyles} right-4 bottom-[105px]` : `${buttonStyles} right-4 top-48`}
                    onClick={() => setToggleMoreInfo(!toggleMoreInfo)}
                    svgClassName="text-2xl"
                />
                   {toggleMoreInfo ? (
                    <div className="absolute bottom-0 left-0 bg-beige bg-opacity-95 text-black p-2 w-full h-1/4 rounded-sm">
                        <h2 className="flex justify-center text-4xl font-semibold">{pet.name}</h2>
                        <div className="flex justify-center text-xl mt-4">
                            <span className={"mx-3"}>{pet.breed}</span>
                            <span>|</span>
                            <span className={"mx-3"}>{pet.age} y.o.</span>
                            <span className="mr-3">|</span>
                            <span>{pet.availability}</span>
                        </div>
                    </div>
                ) : (
                    <div className="absolute bottom-0 left-0 bg-beige bg-opacity-95 text-black p-2 w-full h-3/5 rounded-sm">
                        <h2 className="flex justify-center text-4xl font-semibold">{pet.name}</h2>
                            <div className="flex flex-col justify-start my-2 mx-6">
                                <span className={titleStyles}>
                                    Breed: 
                                    <span className={contentStyles}>{pet.breed}</span>
                                </span>
                                <span className={titleStyles}>
                                    Age: 
                                    <span className={contentStyles}>{pet.age} years old</span>
                                </span>
                                <span className={titleStyles}>
                                    Gender:
                                    <span className={contentStyles}>{pet.gender}</span> 
                                </span>
                                <span className={titleStyles}>
                                    Availability: 
                                    <span className={contentStyles}>{pet.availability}</span>
                                </span>
                                <span className={titleStyles}>
                                    Disposition: 
                                    <span className={contentStyles}>{pet.disposition}</span>
                                </span>
                                <span className={titleStyles}>
                                    Shelter:
                                    <span className={contentStyles}>{pet.shelter}</span>
                                </span>
                            </div>
                        </div>
                    )}
                     <div className="flex flex-row justify-center absolute bottom-[-60px] left-0 w-full ">
                        <button className="bg-red-200 border-solid border-2 border-red-400 hover:border-red-600 rounded-xl p-3 mx-2">
                            {<IoMdClose className="text-6xl text-gray-600 hover:text-black"/>}
                        </button>
                        <button className="bg-white border-solid border-2 rounded-xl border-[#A4B7A7] hover:border-[#7ce28d] px-3 mx-2">
                            {<FaHeart className="text-6xl text-red-400 hover:text-red-600"/>}
                        </button>
                    </div>
                </div>
            </div>
    );
}

export default HomePagePetCard;