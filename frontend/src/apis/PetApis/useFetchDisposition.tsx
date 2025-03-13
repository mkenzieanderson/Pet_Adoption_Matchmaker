import { useQuery } from '@tanstack/react-query';
import { URL } from '../../App';
import { Pet } from '../../state/Pets/Pet.store';

const fetchDisposition = async (pet_id: number) => {
    try {
        const response = await fetch(`${URL}pet_dispositions/${pet_id}`, {
            method: 'GET',
        });
        if (response.status === 404) {
            return { dispositions: [] };
        } else if (!response.ok && response.status !== 404) {
            throw new Error(`Failed to fetch dispositions for pet ${pet_id}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return { dispositions: [] };
    }
};

const fetchAllDispositions = async (pets: Pet[]) => {
    const dispositionsData: { [key: number]: any } = {};
    for (const pet of pets) {
        const disposition = await fetchDisposition(pet.pet_id);
        dispositionsData[pet.pet_id] = disposition.dispositions;
    }
    return dispositionsData;
};

export const useFetchAllDispositions = (pets: Pet[]) => {
    return useQuery({
        queryKey: ['dispositions', pets],
        queryFn: () => fetchAllDispositions(pets),
        enabled: pets.length > 0,
    });
};