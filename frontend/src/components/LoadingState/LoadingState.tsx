import { MdPets } from 'react-icons/md';

const LoadingState = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <MdPets className="text-9xl text-espresso" />
            <h1 className="text-4xl font-header text-espresso py-2">Loading</h1>
        </div>
    );
}

export default LoadingState;