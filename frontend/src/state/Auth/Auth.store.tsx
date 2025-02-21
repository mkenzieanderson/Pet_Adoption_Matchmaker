import { create } from 'zustand';

interface AuthStore {
    userId: bigint | null;
    token: string;
    setToken: (token: string) => void;
    setUserID: (userId: bigint) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    token: '',
    userId: null,
    setToken: (token: string) => set({ token }),
    setUserID: (userId: bigint) => set({ userId }),
}));

export default useAuthStore;
