import Header from "../components/Header/Header";
import HomePagePetCard from "../components/HomePagePetCard/HomePagePetCard";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";
import FilterSidebar from "../components/FilterSidebar/FilterSidebar";
import usePetStore, { Pet, FilterCriteria } from "../state/Pets/Pet.store";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";


export const HomePage = () => {
    const auth = useAuthStore((state) => state);
    const user = useUserStore((state) => state.user);
    const pets = usePetStore((state) => state.pets);
    const fetchPets = usePetStore((state) => state.fetchPets);
    const [currentPetIndex, setCurrentPetIndex] = useState(0);

    useEffect(() => {
        fetchPets();
    }, []);

    const handleNextPet = () => {
        setCurrentPetIndex((prevIndex) => (prevIndex + 1) % pets.length);
    };

    const handlePreviousPet = () => {
        setCurrentPetIndex((prevIndex) => (prevIndex - 1 + pets.length) % pets.length);
    };

    const addFavorite = (pet: Pet) => {
        console.log("Adding favorite", pet);
    };

    const filterPets = (filterCriteria: FilterCriteria) => {
        fetchPets(filterCriteria);
        setCurrentPetIndex(0);
    }

    return (
        <>
            <Header user={user} path={location.pathname} loginStatus={auth.status} />
            <div className="flex flex-row h-screen">
                <FilterSidebar filterPets={filterPets} />
                <div className="flex flex-col items-center w-screen mt-14">
                    {pets.length > 0 && (
                        <div className="flex flex-row items-center justify-evenly w-full">
                            {auth.status && user?.role === 'user' ? (
                                <button
                                    onClick={handleNextPet}
                                    className="bg-red-200 border-solid border-2 border-red-400 hover:border-red-600 rounded-xl p-3 mx-2 text-7xl text-gray-600 hover:text-black">
                                    <IoMdClose />
                                </button>
                            ) : (
                                <button
                                    onClick={handlePreviousPet}
                                    className="bg-beige border-solid border-2 border-tawny-brown hover:border-espresso rounded-xl p-3 mx-2 text-tawny-brown hover:text-espresso text-7xl">
                                    <FaChevronLeft />
                                </button>
                            )
                            }

                            < HomePagePetCard pet={pets[currentPetIndex]} />

                            {auth.status && user?.role === 'user' ? (
                                <button
                                    onClick={() => {
                                        addFavorite(pets[currentPetIndex]);
                                        handleNextPet();
                                    }}
                                    className="bg-white border-solid border-2 rounded-xl border-[#A4B7A7] hover:border-[#7ce28d] px-3 mx-2 text-7xl text-red-400 hover:text-red-600">
                                    <FaHeart />
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextPet}
                                    className="bg-beige border-solid border-2 border-tawny-brown hover:border-espresso rounded-xl p-3 mx-2 text-tawny-brown hover:text-espresso text-7xl">
                                    <FaChevronRight />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const App: React.FC = () => <HomePage />

export default App;