import { FaDog } from 'react-icons/fa';

interface EmptyCardProps {
    title: string;
    message: string;
}

const EmptyCard = ({ title, message }: EmptyCardProps) => {
    return (
        <>
            <div className="bg-mustard w-1/2 h-[650px] p-4 rounded-lg shadow-md relative">
                <div className="flex flex-col items-center justify-center w-full h-full gap-y-24">
                    <span className="text-espresso text-3xl font-header font-bold">{title}</span>
                    <div className="bg-beige w-1/3 h-1/3 rounded-full flex items-center justify-center">
                        <FaDog className="text-espresso text-9xl" />
                    </div>
                    <span className="text-espresso text-3xl font-header font-bold">{message}</span>
                </div>
            </div>
        </>
    )
}

export default EmptyCard;