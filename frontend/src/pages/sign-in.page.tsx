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
            <div style={{ width: "550px" }}>
                <Form
                    title="Sign in to continue"
                    description="Welcome back!"
                >
                    <TextInput
                        type="email"
                        title="Email"
                        width="w-80"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </TextInput>

                    <TextInput
                        type="password"
                        title="Password"
                        width="w-80"
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
        </>
    )
}

const App: React.FC = () => <SignInPage />

export default App;