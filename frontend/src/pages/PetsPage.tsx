import PetProfileCard from "../components/PetProfileCard";
import pitbull from "../assets/pitbull.png"
import { dummyUser } from "../state/User.types";
import Header from "../components/Header";

export const PetsPage = () => {
    return (
        <>
            <div className="w-full">
                <Header user={dummyUser} path={location.pathname} loginStatus={true}/>
            </div>
            <div className=" rounded-lg p-4">
                <PetProfileCard 
                pet={{ 
                    name: 'Buddy', 
                    breed: 'Pitbull', 
                    image: pitbull, 
                    age: 4, 
                    availability: "Available",
                    gender: "Male",
                    disposition: "Good with kids, good with other animals.",
                    shelter: "Sunshine Shelter"
                    }} user={dummyUser} />
            </div>
        </>
    )
}

const App: React.FC = () => <PetsPage />

export default App;