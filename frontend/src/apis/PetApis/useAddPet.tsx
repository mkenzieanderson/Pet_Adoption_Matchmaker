import { useMutation } from '@tanstack/react-query';
import { URL } from '../../App';
import { Pet } from '../../state/Pets/Pet.store';

const addPet = async (token: string, newPet: Partial<Pet>) => {
    const response = await fetch(`${URL}pets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPet),
    });
    if (!response.ok) {
        throw new Error('Failed to add pet');
    }
    const data = await response.json();
    return data;
};

export const useAddPet = (token: string) => {
    return useMutation({
        mutationFn: (newPet: Partial<Pet>) => addPet(token, newPet),
        onMutate: (newPet: Partial<Pet>) => {
            return { pet: newPet };
        },
    });
};