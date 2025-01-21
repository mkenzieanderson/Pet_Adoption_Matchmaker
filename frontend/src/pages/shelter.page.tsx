import { useNavigate } from "react-router-dom";

export const ShelterPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="bg-red-400 rounded-lg p-4">
                <h1>Shelter Page</h1>
                <button onClick={() => navigate('/')} className="m-4">
                    Back
                </button>
            </div>
        </>
    )
}

const App: React.FC = () => <ShelterPage />

export default App;