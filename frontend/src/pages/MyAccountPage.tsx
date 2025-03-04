import React, { useState } from "react";
import Header from "../components/Header/Header";
import Button from "../components/Buttons/Button";
import TextInput from "../components/TextInput/TextInput";
import Form from "../components/Form/Form";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";

export const MyAccountPage = () => {
    const user = useUserStore((state) => state.user);
    const auth = useAuthStore((state) => state);
    const updateUser = useUserStore((state) => state.updateUser);

    const [firstName, setFirstName] = useState(user?.name.split(" ")[0] || "");
    const [lastName, setLastName] = useState(user?.name.split(" ")[1] || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone_number || "");
    const [editMode, setEditMode] = useState(false);

    // Un-comment this if we allow the user to change their password and/or delete their account
    // const navigate = useNavigate();
    // const [password, setPassword] = useState("");
    // const [confirmPwd, setConfirmPwd] = useState("");
    // const [showDeleteWarning, setShowDeleteWarning] = useState(false);

    // function openDeleteWarning () {
    //     setShowDeleteWarning(true);
    // }

    // function handleDelete() {
    //     setShowDeleteWarning(false)
    //     navigate('/');
    // }

    // function handleCancel() {
    //     setShowDeleteWarning(false);
    // }

    // useEffect(() => {
    //     console.log("[DEBUG] User data from store:", user);
    //     if (user) {
    //         setFirstName(user.name.split(" ")[0] || "");
    //         setLastName(user.name.split(" ")[1] || "");
    //         setEmail(user.email || "");
    //         setPhone(user.phone_number || "");
    //     }
    // }, [user]);
    
    function handleEditAccount() {
        setEditMode(true);
    }
    
    async function handleSaveChanges() {
        if (!user || !auth.token) {
            console.error("User or auth token is missing");
            return;
        }
        const updatedData = {
            name: `${firstName} ${lastName}`,
            phone_number: phone,
        };
        try {
            await updateUser(user.user_id, auth.token, updatedData);
            console.log("[DEBUG] user successfully updated")
            setEditMode(false);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }

    return (
        <>
            <Header user={user} path={location.pathname} loginStatus={auth.status} />
            <div className="place-items-center">
                <div className="w-3/5 mt-10 mb-2">
                    <Form
                        title="My Account"
                    >
                        <div className="flex space-x-12 mt-6">
                            <TextInput
                                type="text"
                                title="First Name"
                                width="w-full"
                                disabled={editMode ? false : true}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            >
                            </TextInput>
                            <TextInput
                                type="text"
                                title="Last Name"
                                width="w-full"
                                disabled={editMode ? false : true}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            >
                            </TextInput>
                        </div>
                        <TextInput
                                type="email"
                                title="Email"
                                width="w-6/12"
                                disabled={true}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            >
                        </TextInput>
                        <TextInput
                                type="tel"
                                title="Phone Number"
                                width="w-4/12"
                                disabled={editMode ? false : true}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            >
                        </TextInput>
                        
                        {/* If we allow the user to change their password, this is the React code for that */}
                        {/* {editMode && (
                            <>
                                <TextInput
                                    type="password"
                                    title="New Password"
                                    width="w-4/12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                >
                                </TextInput>
                                <TextInput
                                    type="password"
                                    title="Confirm New Password"
                                    width="w-4/12"
                                    value={confirmPwd}
                                    onChange={(e) => setConfirmPwd(e.target.value)}
                                >
                                </TextInput>
                            </>
                        )} */}

                        <div className={editMode ? "text-center" : ""}>
                            <Button
                                text={editMode ? "SAVE CHANGES" : "EDIT ACCOUNT INFO"}
                                onClick={editMode ? handleSaveChanges : handleEditAccount}
                            >
                            </Button>
                        </div>
                    </Form>
                </div>

                {/* Un-comment this if we allow the user to delete their account */}
                {/* <div className="w-3/5 mb-10 text-right">
                    <Button 
                        text="DELETE ACCOUNT"
                        className={errorButtonStyle}
                        onClick={openDeleteWarning}
                    >
                    </Button>
                </div>
                {showDeleteWarning && (
                    <div className="fixed inset-0 bg-espresso bg-opacity-50 flex items-center justify-center z-50">
                        <DeletePopUp 
                            header="Delete Account" 
                            description="Are you sure that you want to delete your account?"
                            onDelete={handleDelete}
                            onCancel={handleCancel}
                        />
                    </div>
                )} */}

            </div>
        </>
    )
}

const App: React.FC = () => <MyAccountPage />

export default App;