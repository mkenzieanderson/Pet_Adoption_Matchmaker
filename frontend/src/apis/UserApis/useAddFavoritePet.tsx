import { useMutation } from '@tanstack/react-query';
import { URL } from '../../App';

const addFavoritePet = async ({ petID, userID, token } : { petID: number, userID: number, token: string }): Promise<void> => {
    const response = await fetch(`${URL}favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userID, pet_id: petID }),
    });
    if (!response.ok) {
        throw new Error('Failed to add favorite pet');
    } else {
        console.log("[DEBUG] add favorite pet response data:", await response.json());
    }
};

export const useAddFavoritePet = () => {
    return useMutation({
        mutationFn: ({ petID, userID, token }: { petID: number, userID: number, token: string }) => addFavoritePet({ petID, userID, token })
    });
};