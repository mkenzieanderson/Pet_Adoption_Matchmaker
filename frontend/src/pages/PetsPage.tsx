import { dummyUser } from "../state/User/User.types";
import Header from "../components/Header/Header";
import PetCardGrid from "../components/PetCardGrid/PetCardGrid";

export const PetsPage = () => {
    return (
        <>
            <div className="w-full">
                <Header user={dummyUser} path={location.pathname} loginStatus={true}/>
            </div>
            <div className=" rounded-lg p-4">
               <PetCardGrid user={dummyUser}/>
            </div>
        </>
    )
}

const App: React.FC = () => <PetsPage />

export default App;