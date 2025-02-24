import React from "react";
import Header from "../components/Header/Header";
import { PetFormPage } from "../components/PetForm/PetForm";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";

export const EditPetPage = () => {
    const user = useUserStore((state) => state.user);
    const auth = useAuthStore((state) => state);

    function submitHandler() {
        return;
    }

    return (
        <>
            <Header user={user} path={location.pathname} loginStatus={auth.status} />
            <PetFormPage mode="edit" submitHandler={submitHandler}/>
        </>
    )
}

const App: React.FC = () => <EditPetPage />

export default App;