import PopUp from "./PopUp";
import Button from "../Buttons/Button";
import { errorButtonStyle } from "../Buttons/ButtonStyles";

interface DeletePopUpProps {
    header: string;
    description?: string;
    onDelete: () => void;
    onCancel: () => void;
}

export const DeletePopUp: React.FC<DeletePopUpProps> = ({ header, description, onDelete, onCancel }) => {
    return (
        <PopUp
            header={header}
            description={description}
        >
            <div className="flex justify-center items-center mt-4 gap-16">
                <Button
                    text="CANCEL"
                    onClick={onCancel}
                >
                </Button>
                <Button
                    text="DELETE"
                    className={errorButtonStyle}
                    onClick={onDelete}
                >
                </Button>
            </div>
        </PopUp>
    )
}

export default DeletePopUp;