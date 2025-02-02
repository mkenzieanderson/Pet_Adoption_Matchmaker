import { dummyUser } from "../state/User.types";
import Header from "../components/Header";

export const ShelterPage = () => {

    return (
        <>
            <Header user={dummyUser} path={location.pathname} loginStatus={true} />
        </>
    )
}

const App: React.FC = () => <ShelterPage />

export default App;