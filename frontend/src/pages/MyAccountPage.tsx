import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import { dummyUser } from "../state/User.types";
import Button from "../components/Buttons/Button";
import TextInput from "../components/TextInput/TextInput";
import Form from "../components/Form/Form";

export const MyAccountPage = () => {

    return (
        <>
            <Header user={dummyUser} path={location.pathname} loginStatus={true} />
        </>
    )
}

const App: React.FC = () => <MyAccountPage />

export default App;