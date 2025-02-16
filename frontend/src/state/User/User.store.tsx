import { create } from 'zustand';

interface User {
    user_id: number;
    name: string;
    email: string;
    role: string;
    self: string;
    sub: string;
}

interface UserStore {
    users: User[];
    fetchUser: (token: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
    /** 
     * @type {User[]} users - An array of users
     * @type {function} fetchUser - A function that fetches users from the backend
     * Note: The param @type {token} is temporary and will be replaced with global
     * auth state management
    */
    users: [],
    fetchUser: async (token: string) => {
        try {
            const response = await fetch('http://localhost:8080/users', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }); 
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            set({ users: data.users });
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    },
}));

export default useUserStore;