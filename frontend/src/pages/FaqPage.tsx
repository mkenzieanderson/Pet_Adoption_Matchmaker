import React from 'react';
import Header from '../components/Header/Header';
import useUserStore from '../state/User/User.store';
import useAuthStore from '../state/Auth/Auth.store';

export const FaqPage = () => {
    const user = useUserStore((state) => state.user);
    const auth = useAuthStore((state) => state);

    return (
        <>
            <Header user={user} loginStatus={auth.status} />
            <div className="flex flex-col items-center mt-6">
                <div className="font-header text-espresso bg-cream border-tawny-brown border-2 rounded-lg p-14 pt-10 pb-10 w-full max-w-4xl">
                    <h1 className="font-bold text-3xl mb-1 text-center">Frequently Asked Questions</h1>
                    <p className="mb-8 text-center">
                        Here are some of the most common questions we receive. If you have any other questions, feel free to contact us.
                    </p>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Q: How can I browse pets?</h2>
                        <p className="text-gray-700">
                            A: You can browse available pets by visiting our homepage, adjusting the filters to your preferences, and clicking on the 
                            pet's tooltip for more information about them
                        </p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Q: How can I adopt a pet?</h2>
                        <p className="text-gray-700">
                            A: After finding your perfect match, you can contact the shelter directly to begin the adoption process.
                        </p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Q: What are the adoption fees?</h2>
                        <p className="text-gray-700">
                            A: Adoption fees vary depending on the shelter. Please contact the shelter for specific information.
                        </p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Q: Can I volunteer at a shelter?</h2>
                        <p className="text-gray-700">
                            A: Yes, most shelters welcome volunteers! Please contact the shelter you are interested in for information on how to get involved.
                        </p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Q: How can I donate to a shelter?</h2>
                        <p className="text-gray-700">
                            A: Donations can be made through the specific shelter. Please contact them for details. We appreciate your support!
                        </p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Q: What should I bring when adopting a pet?</h2>
                        <p className="text-gray-700">
                            A: When adopting a pet, you should bring a valid ID, proof of address, and any necessary adoption fees. It's also a good idea to bring a leash or 
                            carrier for your new pet. Check with the shelter you are adopting from for any additional requirements.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

const App: React.FC = () => <FaqPage />;

export default App;