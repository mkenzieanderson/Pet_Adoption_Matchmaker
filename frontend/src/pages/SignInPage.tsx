import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import Form from "../components/Form";

export const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        setEmail("");
        setPassword("");
        navigate('/');
    }

    return (
        <>
            <div  className="place-items-center">
                <div className="w-1/2">
                    <Form
                        title="Sign in to continue"
                        description="Welcome back!"
                    >
                        <TextInput
                            type="email"
                            title="Email"
                            width="w-4/6"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </TextInput>

                        <TextInput
                            type="password"
                            title="Password"
                            width="w-4/6"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </TextInput>
                        <div className="self-start">
                        <Button
                            text="SIGN IN"
                            onClick={handleSubmit}
                        >
                        </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}

const App: React.FC = () => <SignInPage />

export default App;