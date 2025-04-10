import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User } from "../../state/User/User.store";
import FetchLogo from "../../assets/fetch-logo.svg";
import Button from "../Buttons/Button";
import { BiUser } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import useAuthStore from "../../state/Auth/Auth.store";
import useUserStore from "../../state/User/User.store";

interface HeaderProps {
    user?: User | null;
    path?: string;
    loginStatus?: boolean;
}

const Header = ({ user, path, loginStatus }: HeaderProps) => {
    const navigate = useNavigate();
    const auth = useAuthStore((state) => state);
    const userStore = useUserStore((state) => state);
    const [menuOpen, setMenuOpen] = useState(false);
    const subMenuClassName = "w-full text-left py-4 px-4 font-serif font-semibold text-xl hover:bg-transparent-clay";
    const svgButtonClassName = `bg-mustard text-espresso font-header font-semibold border-tawny-brown 
                                border-4 rounded-3xl px-6 py-2 hover:border-espresso mt-4 mb-2 w-auto 
                                hover:bg-transparent-clay`;
    const subHeaderClassName = "h-10 flex items-center justify-start px-4 sm:px-6 lg:px-8 font-serif lg:text-xl sm:text-md font-semibold rounded-xl hover:bg-transparent-clay";

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const renderButton = () => {
        if (auth.status) {
            return <Button onClick={toggleMenu} svgIcon={BiUser} className={svgButtonClassName}/>;
        } else if ((path === '/' || path == '/Pet-Adoption/') && !auth.status) {
            return <Button onClick={() => navigate('/sign-page')} text="Sign In" />;
        } else {
            return <Button onClick={() => navigate('/')} svgIcon={FaHome} className={svgButtonClassName}/>;
        }
    };

    const renderSubMenuButton = () => {
        if (user?.role === "admin") {
            return <Button onClick={() => navigate('/pets-page')} 
                            text="My Shelter" 
                            className={`${subMenuClassName} border-solid border-b-4 border-tawny-brown`} />;
        } else {
            return <Button onClick={() => navigate('/pets-page')} 
                           text="Saved Pets" 
                           className={`${subMenuClassName} border-solid border-b-4 border-tawny-brown`}  />;
        }
    };


    return (
        <>
            <div className="bg-beige w-full h-20 flex flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
                <div 
                    className="flex flex-row items-center space-x-4 sm:space-x-6 cursor-pointer" 
                    onClick={() => navigate('/')}
                >
                    <FetchLogo  />
                    <span className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-espresso">Fetch!</span>
                </div>
                {renderButton()}
            </div>
            {menuOpen && (
                <div className="flex flex-col absolute top-20 right-4 bg-mustard border-solid border-4 border-tawny-brown shadow-md rounded-lg z-50 w-48 sm:w-56 lg:w-64">
                    { (path !== "/" && loginStatus) ? (
                        <Button onClick={() => navigate('/')} 
                                text="Home" 
                                className={`${subMenuClassName} border-solid border-b-4 border-tawny-brown`} />
                    ): null}
                    <Button onClick={() => navigate('/my-account-page')}
                            text="My Account" 
                            className={`${subMenuClassName} border-solid border-b-4 border-tawny-brown`} />
                    {renderSubMenuButton()}
                    <Button onClick={() => {navigate('/sign-page'), auth.clearAuth(), userStore.clearUser()} } 
                            text="Sign Out" 
                            className={subMenuClassName} />
                </div>
            )}
            <div className="bg-mustard w-full h-12 flex items-center justify-start px-4 sm:px-6 lg:px-8 border-solid border-t-2 border-b-2 border-tawny-brown">
                <Button onClick={() => navigate('/faq-page')} text="FAQ" className={subHeaderClassName} />
                <Button onClick={() => navigate('/contact-page')} text="Contact Us" className={subHeaderClassName} />
            </div>
        </>
    );
}

export default Header;