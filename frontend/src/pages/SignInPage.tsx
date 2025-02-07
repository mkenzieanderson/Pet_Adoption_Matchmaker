import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Buttons/Button";
import TextInput from "../components/TextInput/TextInput";
import Form from "../components/Form/Form";
import Header from "../components/Header/Header";


export const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const [token, setToken] = useState();

    const errorMessage = "Email and/or password are incorrect. Please try again.";
    
    function clearDataFields () {
        setEmail("");
        setPassword("");
    }
    
    function handleValidLogin () {
        clearDataFields();
        setShowError(false);
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
                setToken(data.token);
                handleValidLogin();
            } else {
                handleInvalidLogin();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <Header path={location.pathname} loginStatus={false} />
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