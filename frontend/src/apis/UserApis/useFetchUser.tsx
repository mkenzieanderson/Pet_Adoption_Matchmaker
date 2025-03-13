import { useQuery } from '@tanstack/react-query';
import { URL } from '../../App';
import { User } from '../../state/User/User.store';

const fetchUser = async (userID: number | null, token: string): Promise<User> => {
    const response = await fetch(`${URL}users/${userID}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    const data = await response.json();  
    return data;
}

export const useFetchUser = (userID: number | null, token: string) => {
    return useQuery({
        queryKey: ['user', userID],
        queryFn: () => fetchUser(userID, token),
        enabled: userID !== null,
    });
};