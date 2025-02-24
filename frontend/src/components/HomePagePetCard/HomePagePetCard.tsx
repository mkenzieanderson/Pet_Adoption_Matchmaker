import { Pet } from "../../state/Pets/Pet.types.tsx";
import Button from "../Buttons/Button.tsx";
import { useState } from "react";
import { FaInfo, FaHeart, FaChevronDown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import InfoCard from "./InfoCard.tsx";
import ExpandedInfoCard from "./ExpandedInfoCard.tsx";

interface HomePagePetCardProps {
    pet: Pet;
    }

const HomePagePetCard = ({ pet }: HomePagePetCardProps) => {
    const [toggleMoreInfo, setToggleMoreInfo] = useState(false);
    const buttonStyles = "absolute z-40 rounded-3xl bg-white px-2 py-2 border-solid border-4 border-espresso text-espresso hover:bg-clay"

    return (
        <div className="bg-mustard w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-[780px] xl:h-[650px] p-4 rounded-lg shadow-md relative">
            <div className="relative w-full h-full">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover rounded-t-lg" />
                <Button 
                    svgIcon={ !toggleMoreInfo ? FaInfo: FaChevronDown } 
                    className={!toggleMoreInfo ? `${buttonStyles} right-4 bottom-[105px]` : `${buttonStyles} right-4 top-48`}
                    onClick={() => setToggleMoreInfo(!toggleMoreInfo)}
                    svgClassName="text-2xl"
                />
                   {!toggleMoreInfo ? ( <InfoCard pet={pet} /> ) : ( <ExpandedInfoCard pet={pet} /> )}
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