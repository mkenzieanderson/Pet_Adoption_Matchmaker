import { useNavigate } from "react-router-dom";
import PetProfileCard from "../components/PetProfileCard";
import pitbull from "../assets/pitbull.png"

export const PetsPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className=" rounded-lg p-4">
                <h1>Pets Page</h1>
                <button onClick={() => navigate('/')} className="m-4">
                    HomePage
                </button>
                <button onClick={() => navigate('/my-account-page')} className="m-4">
                    My Account Page
                </button>
                <button onClick={() => navigate('/my-account-page')} className="m-4">
                    Shelter Page
                </button>
                <button onClick={() => navigate('/add-pet-page')} className="m-4">
                    Add Pet Page
                </button>
                <button onClick={() => navigate('/edit-pet-page')} className="m-4">
                    Edit Pet Page
                </button>
                <PetProfileCard pet={{ name: 'Buddy', breed: 'Pitbull', image: pitbull, age: 4 }} userType="admin" />
            </div>
        </>
    )
}

const App: React.FC = () => <PetsPage />

export default App;