import { useNavigate } from "react-router-dom";

export const AddPetPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="bg-red-400 rounded-lg p-4">
                <h1>Add Pets Page</h1>
                <button onClick={() => navigate('/')} className="m-4">
                    HomePage
                </button>
                <button onClick={() => navigate('/my-account-page')} className="m-4">
                    My Account Page
                </button>
                <button onClick={() => navigate('/shelter-page')} className="m-4">
                    Shelter Page
                </button>
                <button onClick={() => navigate('/pets-page')} className="m-4">
                    Pets Page
                </button>
                <button onClick={() => navigate('/edit-pet-page')} className="m-4">
                    Edit Pet Page
                </button>
            </div>
        </>
    )
}

const App: React.FC = () => <AddPetPage />

export default App;