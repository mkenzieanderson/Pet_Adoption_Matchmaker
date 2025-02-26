import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Buttons/Button";
import TextInput from "../components/TextInput/TextInput";
import Form from "../components/Form/Form";
import Header from "../components/Header/Header";
import usePetStore from "../state/Pets/Pet.store";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";
import useShelterStore from "../state/Shelter/Shelter.store";
import { URL } from "../App";

export const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const [isUserFetched, setIsUserFetched] = useState(false);

    const authStore = useAuthStore((state) => state);
    const shelter = useShelterStore((state) => state);
    const fetchShelterPets = useShelterStore((state) => state.fetchShelterPets);
    const user = useUserStore((state) => state.user);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const fetchPets = usePetStore((state) => state.fetchPets);
    const errorMessage = "Email and/or password are incorrect. Please try again.";


    function clearDataFields() {
        setEmail("");
        setPassword("");
    }

    async function handleValidLogin(res_token: string, res_user_id: bigint) {
        clearDataFields();
        setShowError(false);

        authStore.setToken(res_token);
        authStore.setUserID(res_user_id);
        authStore.setStatus(true);

        await fetchUser(res_user_id, res_token);
        setIsUserFetched(true);
    }

    useEffect(() => {
        if (isUserFetched && user) {
            console.log("User data after fetch:", user);
            if (user.role === "admin") {
                shelter.fetchShelter(user.user_id, authStore.token).then(() => {
                    if (shelter.currentShelter?.shelter_id) {
                        fetchShelterPets(shelter.currentShelter.shelter_id)
                    }
                });
            }
            fetchPets();
            navigate("/");
        }
    }, [isUserFetched, user]);

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
            console.log("From URL:", URL);
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