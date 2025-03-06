import { useQuery } from '@tanstack/react-query';
import { URL } from '../../App';

const fetchShelter = async (shelterID: number) => {
    const response = await fetch(`${URL}pets/${shelterID}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch shelter pets');
    }
    const data = await response.json();
    console.log("[DEBUG] fetch shelter pets response data:", data);
    return data.pets;
}

export const useFetchShelterPets = (shelterID: number) => {
    return useQuery({
        queryKey: ['shelterPets', shelterID],
        queryFn: () => fetchShelter(shelterID),
        enabled: shelterID !== 0
    });
};