import { useNavigate } from "react-router-dom";
import Edit from "../assets/edit.svg";
import Delete from "../assets/delete.svg";

// Pet type and UserType are temporary. Will be replaced when global state/store is implemented.
type Pet = {
    name: string;
    breed: string;
    image: string;
    age: number;
}

type UserType = 'admin' | 'user';

interface PetProfileCardProps {
    pet: Pet;
    userType: UserType;
    }

    const PetProfileCard = ({ pet, userType }: PetProfileCardProps) => {
        const navigate = useNavigate();
    
        return (
            <div 
                className="bg-mustard w-full sm:w-[264px] h-auto sm:h-[278px] p-4 rounded-lg shadow-md cursor-pointer relative" 
            >
                <img 
                    src={pet.image} 
                    alt={pet.name} 
                    className="w-full h-[150px] sm:h-[200px] object-cover rounded-t-lg" 
                />
                  <div className="absolute top-2 right-1">
                {userType === 'user' ? (
                    <button className="w-6 h-6" onClick={() => navigate('/edit-pet-page')}>
                        <Delete />
                    </button>
                ) : (
                    <button className="w-6 h-6" onClick={() => navigate('/edit-pet-page')}>
                        <Edit />
                    </button>
                )}
            </div>
                <div className="mt-2 text-espresso">
                    <h2 className="text-lg font-semibold">{pet.name}</h2>
                    <div className="flex justify-center text-sm">
                        <span className="mr-4">{pet.breed}</span>
                        <span>|</span>
                        <span className="ml-4">{pet.age}</span>
                    </div>
                </div>
            </div>
        );
    }
    
    export default PetProfileCard;