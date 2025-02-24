import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import { PetFormPage } from "../components/PetForm/PetForm";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";
import DeletePopUp from "../components/PopUp/DeletePopUp";
import Button from "../components/Buttons/Button";
import { errorButtonStyle } from "../components/Buttons/ButtonStyles";

export const EditPetPage = () => {
    const user = useUserStore((state) => state.user);
    const auth = useAuthStore((state) => state);
    const navigate = useNavigate();
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);

    function submitHandler() {
        return;
    }

    function openDeleteWarning() {
        setShowDeleteWarning(true)
    }

    function handleDelete() {
        setShowDeleteWarning(false)
        navigate('pets-page')
    }

    function handleCancel() {
        setShowDeleteWarning(false)
    }

    return (
        <>
            <Header user={user} path={location.pathname} loginStatus={auth.status} />
            <PetFormPage mode="edit" submitHandler={submitHandler}/>
            <div className="w-4/5 mb-10 text-right">
                    <Button 
                        text="DELETE PET"
                        className={errorButtonStyle}
                        onClick={openDeleteWarning}
                    >
                    </Button>
            </div>
            {showDeleteWarning && (
                <div className="fixed inset-0 bg-espresso bg-opacity-50 flex items-center justify-center z-50">
                    <DeletePopUp 
                        header="Delete Pet" 
                        description="Are you sure that you want to delete this pet from your shelter?"
                        onDelete={handleDelete}
                        onCancel={handleCancel}
                    />
                </div>
            )}
        </>
    )
}

const App: React.FC = () => <EditPetPage />

export default App;