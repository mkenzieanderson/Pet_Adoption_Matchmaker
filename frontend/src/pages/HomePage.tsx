import { useContext } from "react";
import Header from "../components/Header";
import { dummyUser } from "../state/User.types";
import AuthContext from "../state/AuthContext";


export const HomePage = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("Some component must be used within an AuthProvider");
    }
    const { auth } = authContext;

    return (
        <>
            <Header user={dummyUser} path={location.pathname} loginStatus={true} />
            <p>Token: {auth.token}</p>
        </>
    )
}

const App: React.FC = () => <HomePage />

export default App;