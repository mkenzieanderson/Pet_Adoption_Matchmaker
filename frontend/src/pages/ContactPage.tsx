import React from 'react';
import Header from '../components/Header/Header';
import useUserStore from '../state/User/User.store';
import useAuthStore from '../state/Auth/Auth.store';

export const ContactPage = () => {
  const user = useUserStore((state) => state.user);
  const auth = useAuthStore((state) => state);
  
  return (
    <>
      <Header user={user} loginStatus={auth.status} />
      <div className="flex flex-col items-center mt-10">
        <div className="font-header text-espresso bg-cream border-tawny-brown border-2 rounded-lg p-14 pt-10 pb-12 w-full max-w-lg">
          <h1 className="font-bold text-3xl mb-1 text-center">Contact Us</h1>
          <p className="mb-8 text-center">
            If you have any questions or need further information, please feel free to contact us.
          </p>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Email</h2>
            <p className="text-gray-700">contact@petadoption.com</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Phone</h2>
            <p className="text-gray-700">+1 (123) 456-7890</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Address</h2>
            <p className="text-gray-700">
              123 Pet Adoption St.<br />
              Pet City, PC 12345<br />
              United States
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => <ContactPage />;

export default App;