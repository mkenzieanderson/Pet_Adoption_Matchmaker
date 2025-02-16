import { create } from 'zustand';

interface AuthStore {
    userId: bigint | null;
    token: string;
    setToken: (token: string) => void;
    setUserID: (userId: bigint) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    /** 
     * @type {string} token - The token of the user
     * @type {function} setToken - A function that sets the token of the user
     */
    token: '',
    userId: null,
    setToken: (token: string) => set({ token }),
    setUserID: (userId: bigint) => set({ userId }),
}));

export default useAuthStore;

// NOTES @ANDREW: On sign in will need to get that user to set the name and role. Token
// can be set on sign in.