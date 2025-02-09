import React, { useState } from "react";
import Header from "../components/Header/Header";
import { dummyUser } from "../state/User.types";
import Button from "../components/Buttons/Button";
import TextInput from "../components/TextInput/TextInput";
import Form from "../components/Form/Form";
import { errorButtonStyle } from "../components/Buttons/ButtonStyles";

export const MyAccountPage = () => {
    const [firstName, setFirstName] = useState("Jane");
    const [lastName, setLastName] = useState("Doe");
    const [email, setEmail] = useState("janedoe@email.com");
    const [phone, setPhone] = useState("1234567890");
    const [password, setPassword] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [editMode, setEditMode] = useState(false);

    function handleEditAccount() {
        setEditMode(true);
    }
    
    function handleSaveChanges() {
        setEditMode(false);
    }

    return (
        <>
            <Header user={dummyUser} path={location.pathname} loginStatus={true} />
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
                                disabled={editMode ? false : true}
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
                        {editMode && (
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
                        )}
                        <div className={editMode ? "text-center" : ""}>
                            <Button
                                text={editMode ? "SAVE CHANGES" : "EDIT ACCOUNT INFO"}
                                onClick={editMode ? handleSaveChanges : handleEditAccount}
                            >
                            </Button>
                        </div>
                    </Form>
                </div>
                <div className="w-3/5 mb-10 text-right">
                    <Button 
                        text="DELETE ACCOUNT"
                        className={errorButtonStyle}
                        onClick={handleSaveChanges}
                    >
                    </Button>
                </div>
            </div>
        </>
    )
}

const App: React.FC = () => <MyAccountPage />

export default App;