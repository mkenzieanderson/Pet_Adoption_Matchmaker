import { dummyUser } from "../state/User/User.types";
import Header from "../components/Header/Header";
import PetCardGrid from "../components/PetCardGrid/PetCardGrid";
import useUserStore from "../state/User/User.store";

export const PetsPage = () => {
    const user = useUserStore((state) => state.user);

    return (
        <>
            <div className="w-full">
                <Header user={user} path={location.pathname} loginStatus={true}/>
            </div>
            <div className=" rounded-lg p-4">
               <PetCardGrid user={dummyUser}/>
            </div>
        </>
    )
}

const App: React.FC = () => <PetsPage />

export default App;