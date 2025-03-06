import { useQuery } from '@tanstack/react-query';
import { URL } from '../../App';

const fetchShelter = async (token: string, userID: number) => {
    
    const queryParams = new URLSearchParams({ user_id: userID.toString() }).toString();
    const requestUrl =  `${URL}shelters?${queryParams}`;

    const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch shelters');
    }
    const data = await response.json();
    console.log("[DEBUG] fetch shelter response data:", data);
    return data.shelters;
}

export const useFetchShelter = (token: string, userID: number) => {
    return useQuery({
        queryKey: ['shelters', token, userID],
        queryFn: () => fetchShelter(token, userID),
        enabled: userID !== 0
    });
};