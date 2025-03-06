import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Buttons/Button";
import TextInput from "../components/TextInput/TextInput";
import Form from "../components/Form/Form";
import Header from "../components/Header/Header";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";
import useShelterStore from "../state/Shelter/Shelter.store";
import { useFetchUser } from "../apis/UserApis/useFetchUser";
import { useFetchShelter } from "../apis/ShelterApis/useFetchShelter";
import { URL } from "../App";

export const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const authStore = useAuthStore((state) => state);
    const shelter = useShelterStore((state) => state);
    const fetchShelterPets = useShelterStore((state) => state.fetchShelterPets);
    const user = useUserStore((state) => state.user);
    const errorMessage = "Email and/or password are incorrect. Please try again.";

    function clearDataFields() {
        setEmail("");
        setPassword("");
    }

    
    async function handleValidLogin(res_token: string, res_user_id: number) {
        clearDataFields();
        setShowError(false);

        authStore.setToken(res_token);
        authStore.setUserID(res_user_id);
        authStore.setStatus(true);
    }

    const { data: userData, isLoading: userIsLoading, isError: userIsError } = useFetchUser(authStore.userId, authStore.token);

    useEffect(() => {
        if (userIsError) {
            console.error("Failed to fetch user:", userIsError);
        } else if (userData && !userIsLoading) {
            useUserStore.getState().setUser(userData);
        }
        if (user && user.role === "user") {
            navigate("/")
        }
    }, [userData, userIsLoading, userIsError]);

    const { data: shelterData, isLoading: shelterIsLoading, isError: shelterIsError } = useFetchShelter(authStore.token, user?.user_id ?? 0);

    useEffect(() => {
        if (shelterIsError) {
            console.error("Failed to fetch shelter:", shelterIsError);
        } else if (shelterData && !shelterIsLoading) {
            useShelterStore.getState().setShelter(shelterData);
            navigate("/")
        }
    }, [shelterData, shelterIsLoading, shelterIsError]);

    useEffect(() => {
        console.log("Data in shelter store:", useShelterStore.getState().shelter);
    }, [shelter]);

    function handleInvalidLogin() {
        clearDataFields();
        setShowError(true);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await authenticateLogin();
    }

    const authenticateLogin = async () => {
        try {
            const response = await fetch(`${URL}users/login`, {
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