import { useQuery } from '@tanstack/react-query';
import { URL } from '../../App';
import { Pet } from '../../state/Pets/Pet.store';

export const fetchAvatar = async (petID: number): Promise<string> => {
    const response = await fetch(`${URL}pets/${petID}/avatar`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch avatar');
    }
    const blob = await response.blob();
    return window.URL.createObjectURL(blob);
};

const fetchAllAvatars = async (pets: Pet[]) => {
    const avatarData: { [key: number]: any } = {};
    for (const pet of pets) {
        const avatar = await fetchAvatar(pet.pet_id);
        avatarData[pet.pet_id] = avatar;
    }
    return avatarData;
};

export const useFetchAvatar = (pets: Pet[]) => {
    return useQuery({
        queryKey: ['avatar', pets],
        queryFn: () => fetchAllAvatars(pets),
        enabled: pets.length > 0,
    });
};