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
import { useFetchPets } from "../apis/PetApis/useFetchPets";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchAllDispositions } from "../apis/PetApis/useFetchDisposition";
import { useFetchAvatar } from "../apis/PetApis/useFetchAvatar";
import { useFetchUserFavorites } from "../apis/UserApis/useFetchUserFavorites";
import { useAddFavoritePet } from "../apis/UserApis/useAddFavoritePet";
import { useFetchShelterPets } from "../apis/ShelterApis/useFetchShelterPets";
import useShelterStore from "../state/Shelter/Shelter.store";

export const HomePage = () => {
    const auth = useAuthStore((state) => state);
    const user = useUserStore((state) => state.user);
    const shelter = useShelterStore((state) => state.shelter);
    const pets = usePetStore((state) => state.pets);
    const deletionInProgress = useUserStore((state) => state.deletionInProgress);
    const [filters, setFilters] = useState<FilterCriteria | {}>({});
    const [currentPetIndex, setCurrentPetIndex] = useState(0);

    const { data: petsData, isLoading, error } = useFetchPets(filters);

    useEffect(() => {
        if (error) {
            console.error("Failed to fetch pets:", error);
        } else if (petsData && !isLoading) {
            usePetStore.getState().setPets(petsData);
        }
    }, [petsData, isLoading, error]);

    const filterPets = async (filterCriteria: FilterCriteria) => {
        setFilters(filterCriteria);
        setCurrentPetIndex(0);
    };

    const { data: dispositionsData, isLoading: dispositionsLoading, error: dispositionError } = useFetchAllDispositions(pets);
    const { data: avatarData, isLoading: avatarLoading, error: avatarError } = useFetchAvatar(pets);

    useEffect(() => {
        if (dispositionError) {
            console.error("Failed to fetch dispositions:", dispositionError);
        } else if (dispositionsData && !dispositionsLoading) {
            usePetStore.getState().setDispositions(dispositionsData);
        }
    }, [dispositionsData, dispositionsLoading, dispositionError]);

    useEffect(() => {
        if (avatarError) {
            console.error("Failed to fetch avatar:", avatarError);
        } else if (avatarData && !avatarLoading) {
            usePetStore.getState().setAvatars(avatarData);
        }
    }, [avatarData, avatarLoading, avatarError]);

    const { data: favoritesData, isLoading: favoritesIsLoading, isError: favoritesIsError } = user ? useFetchUserFavorites(user, useAuthStore.getState().token) : { data: null, isLoading: false, isError: false };

    useEffect(() => {
        if (favoritesIsError) {
            console.error("Failed to fetch favorite pets:", favoritesIsError);
        } else if (favoritesData && !favoritesIsLoading) {
            console.log("Favorites data: ", favoritesData);
            if (!deletionInProgress) {
                useUserStore.getState().setFavoritePets(favoritesData);
            }
            useUserStore.getState().setDeletionInProgress(false);
            // useUserStore.getState().setFavoritePets(favoritesData);
        }
    }, [favoritesData, favoritesIsLoading, favoritesIsError, user?.favoritePets]);

    const { data: shelterPetsData, isLoading: shelterPetsIsLoading, isError: shelterPetsIsError } = useFetchShelterPets(shelter?.shelter_id ?? 0);

    useEffect(() => {
        if (shelterPetsIsError) {
            console.error("Failed to fetch shelter pets:", shelterPetsIsError);
        } else if (shelterPetsData && !shelterPetsIsLoading) {
            console.log("Shelter pets data: ", shelterPetsData);
        }
    }, [shelterPetsData, shelterPetsIsLoading, shelterPetsIsError]);

    const handleNextPet = () => {
        setCurrentPetIndex((prevIndex) => (prevIndex + 1) % pets.length);
    };

    const handlePreviousPet = () => {
        setCurrentPetIndex((prevIndex) => (prevIndex - 1 + pets.length) % pets.length);
    };

    const queryClient = useQueryClient();

    const addFavoriteMutation = useAddFavoritePet();

    const addFavorite = async (pet: Pet) => {
        if (user?.favoritePets?.find((favorite) => favorite.pet_id === pet.pet_id)) {
            alert(`${pet.name} is already in your favorites!`);
            return;
        }
        if (pet && user) {
            console.log("Adding favorite pet: ", pet);
            addFavoriteMutation.mutate(
                { petID: pet.pet_id, userID: user.user_id, token: auth.token },
                {
                    onSuccess: async () => {
                        // Invalidate favorites query to trigger a refetch
                        queryClient.invalidateQueries({ queryKey: ['favorites', user?.user_id] });
                    }
                }
            );
            console.log("Updated favorites: ", user.favoritePets);
        }
    }

    return (
        <>
            <Header user={user} path={location.pathname} loginStatus={auth.status} />
            <div className="flex flex-row h-screen">
                <FilterSidebar filterPets={filterPets} />
                <div className="flex flex-col items-center w-screen mt-14">
                    {isLoading ? (
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