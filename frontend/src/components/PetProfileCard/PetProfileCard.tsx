import { useNavigate } from "react-router-dom";
import Edit from "../../assets/edit.svg";
import Delete from "../../assets/delete.svg";
import { Pet } from "../../state/Pets/Pet.types";
import { User} from "../../state/User/User.types";


interface PetProfileCardProps {
    pet: Pet;
    user: User;
    }

    const PetProfileCard = ({ pet, user }: PetProfileCardProps) => {
        const navigate = useNavigate();
    
        return (
            <>
                <div 
                    className="bg-mustard w-full sm:w-[264px] h-auto sm:h-[278px] p-4 rounded-lg shadow-md cursor-pointer relative" 
                >
                    <img 
                        src={pet.image} 
                        alt={pet.name} 
                        className="w-full h-[150px] sm:h-[200px] object-cover rounded-t-lg" 
                    />
                    <div className="absolute top-2 right-1">
                    {user.type === 'user' ? (
                        <button className="w-6 h-6 mx-4 my-4" onClick={() => navigate('/edit-pet-page')}>
                            <Delete />
                        </button>
                    ) : (
                        <button className="w-6 h-6 mx-4 my-4" onClick={() => navigate('/edit-pet-page')}>
                            <Edit />
                        </button>
                    )}
                </div>
                    <div className="mt-2 text-espresso font-body">
                        <h2 className="flex justify-center text-lg font-semibold">{pet.name}</h2>
                        <div className="flex justify-center text-sm">
                            <span className="mr-4">{pet.breed}</span>
                            <span>|</span>
                            <span className="ml-4">{pet.age}</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    
    export default PetProfileCard;