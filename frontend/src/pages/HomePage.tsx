import Header from "../components/Header/Header";
import { dummyUser } from "../state/User.types";
import HomePagePetCard from "../components/HomePagePetCard/HomePagePetCard";
import pitbull from "../assets/pitbull.png";


export const HomePage = () => {

    return (
        <>
            <Header user={dummyUser} path={location.pathname} loginStatus={true} />
            <HomePagePetCard  
                pet={{ 
                    name: 'Buddy', 
                    breed: 'Pitbull', 
                    image: pitbull, 
                    age: 4, 
                    availability: "available",
                    gender: "Male",
                    disposition: ["Good with kids", "good with other animals."],
                    shelter: "Sunshine Shelter"
                    }} />
        </>
    )
}

const App: React.FC = () => <HomePage />

export default App;