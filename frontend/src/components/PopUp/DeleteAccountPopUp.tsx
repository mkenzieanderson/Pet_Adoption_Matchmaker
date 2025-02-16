import { useNavigate } from "react-router-dom";
import PopUp from "./PopUp";
import Button from "../Buttons/Button";
import { errorButtonStyle } from "../Buttons/ButtonStyles";

interface DeleteAccountPopUpProps {
    onClose: () => void;
}

export const DeleteAccountPopUp: React.FC<DeleteAccountPopUpProps> = ({ onClose }) => {
    const navigate = useNavigate();

    function handleCancel() {
        onClose();
    }

    function handleDelete() {
        onClose();
        navigate('/');
    }

    return (
        <PopUp
            header="Delete Account"
            description="Are you sure that you want to delete your account?"
        >
            <div className="flex justify-center items-center mt-4 gap-16">
                <Button
                    text="CANCEL"
                    onClick={handleCancel}
                >
                </Button>
                <Button
                    text="DELETE"
                    className={errorButtonStyle}
                    onClick={handleDelete}
                >
                </Button>
            </div>
        </PopUp>
    )
}

export default DeleteAccountPopUp;