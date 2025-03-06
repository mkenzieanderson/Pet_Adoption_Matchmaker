import { useQuery } from '@tanstack/react-query';
import { URL } from '../../App';
import { Pet } from '../../state/Pets/Pet.store';

const fetchPets = async (filters: {} = {}): Promise<Pet[]> => {
    
    if (typeof filters !== 'object' || Array.isArray(filters)) {
        throw new Error("Invalid filters parameter. Expected an object.");
    }

    const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== 0)
    );

    const queryParams = new URLSearchParams(cleanedFilters).toString();
    const requestUrl = queryParams ? `${URL}pets?${queryParams}` : `${URL}pets`;

    const response = await fetch(requestUrl, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch pets');
    }
    const data = await response.json();
    return data.pets;
};

export const useFetchPets = (filters: {} = {}) => {
    return useQuery({
        queryKey: ['pets', filters],
        queryFn: () => fetchPets(filters)
    });
};
