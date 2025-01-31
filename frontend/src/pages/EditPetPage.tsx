import { useNavigate } from "react-router-dom";

export const EditPetPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className=" rounded-lg p-4">
                <h1>Edit Pets Page</h1>
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
                <button onClick={() => navigate('/add-pet-page')} className="m-4">
                    Add Pet Page
                </button>
            </div>
        </>
    )
}

const App: React.FC = () => <EditPetPage />

export default App;