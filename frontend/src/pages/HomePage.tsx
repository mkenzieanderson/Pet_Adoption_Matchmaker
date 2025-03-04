import Header from "../components/Header/Header";
import HomePagePetCard from "../components/HomePagePetCard/HomePagePetCard";
import EmptyCard from "../components/EmptyCard/EmptyCard";
import LoadingState from "../components/LoadingState/LoadingState";
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
    const addFavoritePet = useUserStore((state) => state.addFavoritePet);
    const pets = usePetStore((state) => state.pets);
    const fetchPets = usePetStore((state) => state.fetchPets);
    const [currentPetIndex, setCurrentPetIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const startTime = Date.now();
            await fetchPets();
            const endTime = Date.now();
            const elapsedTime = endTime - startTime;
            const minimumLoadingTime = 500; // Minimum loading time 
            if (elapsedTime < minimumLoadingTime) {
                setTimeout(() => setLoading(false), minimumLoadingTime - elapsedTime);
            } else {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleNextPet = () => {
        setCurrentPetIndex((prevIndex) => (prevIndex + 1) % pets.length);
    };

    const handlePreviousPet = () => {
        setCurrentPetIndex((prevIndex) => (prevIndex - 1 + pets.length) % pets.length);
    };

    const addFavorite = async (pet: Pet) => {
        if (user?.favoritePets?.find((favorite) => favorite.pet_id === pet.pet_id)) {
            alert(`${pet.name} is already in your favorites!`);
            return;
        } else {
            await addFavoritePet(pet.pet_id, user!.user_id, auth.token);
            alert(`${pet.name} has been added to your favorites!`);
        }
    };

    // For debugging purposes
    useEffect(() => {
        if (user?.favoritePets) {
            console.log("User favorites", user.favoritePets);
        }
    }, [user?.favoritePets]);

    const filterPets = async (filterCriteria: FilterCriteria) => {
        setLoading(true);
        const startTime = Date.now();
        await fetchPets(filterCriteria);
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const minimumLoadingTime = 500;
        if (elapsedTime < minimumLoadingTime) {
            setTimeout(() => setLoading(false), minimumLoadingTime - elapsedTime);
        } else {
            setLoading(false);
        }
        setCurrentPetIndex(0);
    };

    return (
        <>
            <Header user={user} path={location.pathname} loginStatus={auth.status} />
            <div className="flex flex-row h-screen">
                <FilterSidebar filterPets={filterPets} />
                <div className="flex flex-col items-center w-screen mt-14">
                    {loading ? (
                        <LoadingState />
                    ) : pets.length > 0 ? (
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
                            )}

                            <HomePagePetCard pet={pets[currentPetIndex]} />

                            {auth.status && user?.role === 'user' ? (
                                <button
                                    onClick={() => {
                                        addFavorite(pets[currentPetIndex]);
                                        handleNextPet();
                                    }}
                                    className="bg-white border-solid border-2 rounded-xl border-[#A4B7A7] hover:border-[#7ce28d] p-3 mx-2 text-7xl text-red-400 hover:text-red-600">
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
                    ) : (
                        <EmptyCard title="No pets found" message="Try adjusting your filters or check back later" />
                    )}
                </div>
            </div>
        </>
    );
}


const App: React.FC = () => <HomePage />

export default App;