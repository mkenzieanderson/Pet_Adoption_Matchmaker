import Header from "../components/Header";
import { dummyUser } from "../state/User.types";

export const HomePage = () => {

    return (
        <>
            <Header user={dummyUser} path={location.pathname} loginStatus={true} />
        </>
    )
}

const App: React.FC = () => <HomePage />

export default App;