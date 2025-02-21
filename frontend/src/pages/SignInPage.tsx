import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Buttons/Button";
import TextInput from "../components/TextInput/TextInput";
import Form from "../components/Form/Form";
import Header from "../components/Header/Header";
import usePetStore from "../state/Pets/Pet.store";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";

export const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);

    const authStore = useAuthStore((state) => state);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const fetchPets = usePetStore((state) => state.fetchPets);
    const errorMessage = "Email and/or password are incorrect. Please try again.";


    function clearDataFields () {
        setEmail("");
        setPassword("");
    }

    function handleValidLogin (res_token: string, res_user_id: bigint) {
        clearDataFields();
        setShowError(false);

        // Set auth global state
        authStore.setToken(res_token);
        authStore.setUserID(res_user_id);
        authStore.setStatus(true);
        
        // Fetch user and set global state
        fetchUser(res_user_id, res_token);
        // Fetch pets and set global state
        fetchPets(authStore.token);
        navigate('/');
    }

    function handleInvalidLogin () {
        clearDataFields();
        setShowError(true);
    }
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await authenticateLogin();
    }

    const authenticateLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                handleValidLogin(data.token, data.user_id);
            } else {
                handleInvalidLogin();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <Header path={location.pathname} loginStatus={authStore.status} />
            <div className="place-items-center">
                <div className="w-2/5 mt-16">
                    <Form
                        title="Sign in to continue"
                        description="Welcome back!"
                        error_msg={showError ? errorMessage : ""}
                    >
                        <TextInput
                            type="email"
                            title="Email"
                            width="w-3/5"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </TextInput>

                        <TextInput
                            type="password"
                            title="Password"
                            width="w-3/5"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </TextInput>

                        <Button
                            text="SIGN IN"
                            onClick={handleSubmit}
                        >
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    )
}

const App: React.FC = () => <SignInPage />

export default App;