import Header from "../components/Header/Header";
import HomePagePetCard from "../components/HomePagePetCard/HomePagePetCard";
import pitbull from "../assets/pitbull.png";
import useAuthStore from "../state/Auth/Auth.store";
import useUserStore from "../state/User/User.store";

export const HomePage = () => {
    const auth = useAuthStore((state) => state);
    const user = useUserStore((state) => state.user);

    return (
        <>
            <Header user={user} path={location.pathname} loginStatus={auth.status} />
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