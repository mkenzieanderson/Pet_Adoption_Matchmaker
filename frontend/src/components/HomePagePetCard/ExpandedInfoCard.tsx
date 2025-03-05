import { Pet } from '../../state/Pets/Pet.store';

interface ExpandedInfoCardProps {
    pet: Pet;
}

const ExpandedInfoCard = ({ pet }: ExpandedInfoCardProps) => {
    const titleStyles = "my-1 mx-4 text-xl font-bold font-body"
    const contentStyles = "font-normal font-body mx-4"

    return (
        <>
            <div className="absolute bottom-0 left-0 bg-beige bg-opacity-95 text-espresso p-2 w-full h-1/2 rounded-sm">
                <h2 className="flex justify-center text-4xl font-semibold font-body">{pet.name}</h2>
                <div className="flex flex-col justify-start my-2 mx-6">
                    <span className={titleStyles}>
                        Breed:
                        <span className={contentStyles}>{pet.breed}</span>
                    </span>
                    <span className={titleStyles}>
                        Age:
                        <span className={contentStyles}>{pet.age} years old</span>
                    </span>
                    <span className={titleStyles}>
                        Gender:
                        <span className={contentStyles}>{pet.gender}</span>
                    </span>
                    <span className={titleStyles}>
                        Availability:
                        <span className={contentStyles}>{pet.availability}</span>
                    </span>
                    <span className={titleStyles}>
                        Disposition:
                        <span className={contentStyles}>
                            {Array.isArray(pet.disposition) ? pet.disposition.join(', ') : pet.disposition}
                        </span>
                    </span>
                    <span className={titleStyles}>
                        Shelter:
                        <span className={contentStyles}>{pet.shelter_id}</span>
                    </span>
                </div>
            </div>
        </>
    );
}

export default ExpandedInfoCard;