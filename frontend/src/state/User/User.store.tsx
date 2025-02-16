import { create } from 'zustand';

interface User {
    user_id: bigint;
    name: string;
    email: string;
    role: string;
}

interface UserStore {
    user: User | null;
    fetchUser: (userID: bigint, token: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
    /** 
     * @type {User} user - A user object
     * @type {function} fetchUser - A function that fetches a user from the backend
     * @param {bigint} userID - The ID of the user
     * @param {string} token - The token of the user
    */
    user: null,
    fetchUser: async (userID: bigint, token: string) => {
        try {
            const response = await fetch(`http://localhost:8080/users/${userID}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }); 
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const data = await response.json();
            //console.log("User data: ", data); // For debugging, will be removed
            set({ user: data });
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    },
}));

export default useUserStore;