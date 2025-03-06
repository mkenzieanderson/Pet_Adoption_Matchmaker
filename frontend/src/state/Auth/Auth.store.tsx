import { create } from 'zustand';

interface AuthStore {
    userId: number | null;
    token: string;
    status: boolean;
    setToken: (token: string) => void;
    setUserID: (userId: number) => void;
    setStatus: (status: boolean) => void;
    clearAuth: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    token: '',
    userId: null,
    status: false,
    setToken: (token: string) => set({ token }),
    setUserID: (userId: number) => set({ userId }),
    setStatus: (status: boolean) => set({ status }),
    clearAuth: () => set({ token: '', userId: null, status: false }),
}));

export default useAuthStore;
