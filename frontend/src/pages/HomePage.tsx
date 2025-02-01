import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { dummyUser } from "../state/User.types";

export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header user={dummyUser} path={location.pathname} loginStatus={false} />
            <div className="rounded-lg p-4">
                <h1>Home Page</h1>
                <button onClick={() => navigate('/shelter-page')} className="m-4">
                    Shelter Page
                </button>
                <button onClick={() => navigate('/my-account-page')} className="m-4">
                    My Account Page
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
                <button onClick={() => navigate('/sign-page')} className="m-4">
                    Logout
                </button>
            </div>
        </>
    )
}

const App: React.FC = () => <HomePage />

export default App;