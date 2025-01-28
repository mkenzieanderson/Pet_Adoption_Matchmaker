import { useNavigate } from "react-router-dom";

export const SignInPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="bg-red-400 rounded-lg p-4">
                <h1>Sign In Page</h1>
                <button onClick={() => navigate('/')} className="m-4">
                    Login
                </button>
            </div>
        </>
    )
}

const App: React.FC = () => <SignInPage />

export default App;