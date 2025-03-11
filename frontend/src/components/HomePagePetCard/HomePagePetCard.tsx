import { Pet } from "../../state/Pets/Pet.store.tsx";
import Button from "../Buttons/Button.tsx";
import { useState } from "react";
import { FaInfo, FaChevronDown } from "react-icons/fa";
import InfoCard from "./InfoCard.tsx";
import ExpandedInfoCard from "./ExpandedInfoCard.tsx";

interface HomePagePetCardProps {
    pet: Pet;
}

const HomePagePetCard = ({ pet }: HomePagePetCardProps) => {
    const [toggleMoreInfo, setToggleMoreInfo] = useState(false);
    const buttonStyles = "absolute z-40 rounded-3xl bg-white px-2 py-2 border-solid border-4 border-espresso text-espresso hover:bg-clay"

    return (
        <div className="bg-mustard w-1/2 h-[650px] p-4 rounded-lg shadow-md relative">
            <div className="relative w-full h-full">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover rounded-t-lg" />
                <Button
                    svgIcon={!toggleMoreInfo ? FaInfo : FaChevronDown}
                    className={!toggleMoreInfo ? `${buttonStyles} right-4 bottom-24` : `${buttonStyles} right-4 top-72`}
                    onClick={() => setToggleMoreInfo(!toggleMoreInfo)}
                    svgClassName="text-2xl"
                />
                {!toggleMoreInfo ? (<InfoCard pet={pet} />) : (<ExpandedInfoCard pet={pet} />)}
                <div className="flex flex-row justify-center absolute bottom-[-60px] left-0 w-full ">
                </div>
            </div>
        </div>
    );
}

export default HomePagePetCard;