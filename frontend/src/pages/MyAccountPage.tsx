import { useNavigate } from "react-router-dom";

export const MyAccountPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className=" rounded-lg p-4">
                <h1>My Account Page</h1>
                <button onClick={() => navigate('/')} className="m-4">
                    HomePage
                </button>
                <button onClick={() => navigate('/shelter-page')} className="m-4">
                    ShelterPage
                </button>
                <button onClick={() => navigate('/pets-page')} className="m-4">
                    Pets Page
                </button>
                <button onClick={() => navigate('/add-pet-page')} className="m-4">
                    Add Pet Page
                </button>
                <button onClick={() => navigate('/edit-pet-page')} className="m-4">
                    Edit Pet Page
                </button>
            </div>
        </>
    )
}

const App: React.FC = () => <MyAccountPage />

export default App;