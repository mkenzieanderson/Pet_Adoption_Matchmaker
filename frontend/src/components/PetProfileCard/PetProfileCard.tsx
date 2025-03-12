import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Edit from "../../assets/edit.svg";
import Delete from "../../assets/delete.svg";
import { Pet } from "../../state/Pets/Pet.store";
import { User} from "../../state/User/User.store";
import { useFetchAvatar } from "../../apis/PetApis/useFetchAvatar";
import { useDeleteFavoritePet } from "../../apis/UserApis/useDeleteFavoritePet";
import useAuthStore from "../../state/Auth/Auth.store";


interface PetProfileCardProps {
    pet: Pet;
    user: User | null;
}

    const PetProfileCard = ({ pet, user }: PetProfileCardProps) => {
        const navigate = useNavigate();
        const { data: avatarData, error } = useFetchAvatar([pet]);
        const auth = useAuthStore((state) => state);
        const deleteFavoritePet = useDeleteFavoritePet();

        useEffect(() => {
            if (error) {
                console.error("Error fetching pet avatar:", error);
            }
        }, [error]);

        const handleDelete = () => {
            if (!user) return;
            const petID = pet.pet_id
            const userID = user.user_id
            const token = auth.token
            deleteFavoritePet.mutate({ userID, petID, token });
        };

        const handleEdit = () => {
            if (!user) return;
            navigate('/edit-pet-page', { state: { pet } });
        };

        return (
            <>
                <div className="bg-mustard w-full h-auto p-4 rounded-lg shadow-md cursor-pointer relative" >
                    <img 
                        src={avatarData?.[pet.pet_id] || pet.image} 
                        alt={pet.name} 
                        className="w-full h-[150px] sm:h-[200px] object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-1">
                    {user?.role === 'user' ? (
                        <button className="w-6 h-6 mx-4 my-4" onClick={handleDelete}>
                            <Delete />
                        </button>
                    ) : (
                        <button className="w-6 h-6 mx-4 my-4" onClick={handleEdit}>
                            <Edit />
                        </button>
                    )}
                </div>
                    <div className="mt-2 text-espresso font-body">
                        <h2 className="flex justify-center text-lg font-semibold">{pet.name}</h2>
                        <div className="flex justify-center text-sm">
                            <span className="mr-4">{pet.breed}</span>
                            <span>|</span>
                            <span className="ml-4">{pet.age} years old</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    
    export default PetProfileCard;