import { create } from 'zustand';

interface AuthStore {
    name: string;
    role: string;
    token: string;
    setToken: (token: string) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    /** 
     * @type {string} name - The name of the user
     * @type {string} role - The role of the user
     * @type {string} token - The token of the user
     * @type {function} setToken - A function that sets the token of the user
     */
    name: '',
    role: '',
    token: '',
    setToken: (token: string) => set({ token }),
}));

export default useAuthStore;

// NOTES @ANDREW: On sign in will need to get that user to set the name and role. Token
// can be set on sign in.