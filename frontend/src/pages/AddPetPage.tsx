import React from "react";
import Header from "../components/Header/Header";
import { PetFormPage } from "../components/PetForm/PetForm";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";

export const AddPetPage = () => {
    const user = useUserStore((state) => state.user);
    const auth = useAuthStore((state) => state);

    function submitHandler() {
        return;
    }

    return (
        <>
            <Header user={user} path={location.pathname} loginStatus={auth.status} />
            <div className="mb-16">
                <PetFormPage mode="add" submitHandler={submitHandler}/>
            </div>
        </>
    )
}

const App: React.FC = () => <AddPetPage />

export default App;