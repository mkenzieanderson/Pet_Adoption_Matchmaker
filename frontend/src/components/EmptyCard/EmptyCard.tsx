import CatDog from '../../assets/cat_dog_default.jpg';

interface EmptyCardProps {
    title: string;
    message: string;
}

const EmptyCard = ({ title, message }: EmptyCardProps) => {
    return (
        <div className="empty-card bg-black bg-opacity-10 w-full h-full flex flex-col items-center justify-center rounded-lg">
            <div className="empty-card__icon">
                <img src={CatDog} alt="Empty Card" />
            </div>
            <div className="empty-card__text">
                <h3>No Pets Found</h3>
                <p>Try adjusting your filters or check back later.</p>
                <p>{title}{message}</p>
            </div>
        </div>
    )
}

export default EmptyCard;