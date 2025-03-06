import { useQuery } from '@tanstack/react-query';
import { Pet } from '../../state/Pets/Pet.store';
import { User } from '../../state/User/User.store';
import { URL } from '../../App'

const fetchUserFavorites = async (userID: number, token: string): Promise<Pet[]> => {
    const response = await fetch(`${URL}favorites/${userID}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch favorite pets');
    }
    const data = await response.json();
    console.log("[DEBUG] fetch user favorites response data:", data);

    const validFavorites = data.favorites.filter((favorite: { pet_id: number | null }) => favorite.pet_id !== null);

    const favoritePets = await Promise.all(
        validFavorites.map(async (favorite: { pet_id: number }) => {
            const petResponse = await fetch(`${URL}pets/${favorite.pet_id}`, {
                method: 'GET',
            });
            if (!petResponse.ok) {
                throw new Error(`Failed to fetch pet with ID ${favorite.pet_id}`);
            }
            const petData = await petResponse.json();
            return petData;
        })
    );

    return favoritePets;
};

export const useFetchUserFavorites = (user: User, token: string) => {
    return useQuery({
        queryKey: ['userFavorites', user?.user_id],
        queryFn: () => fetchUserFavorites(user.user_id, token),
        enabled: user !== null && user.role === 'user',
    })
}