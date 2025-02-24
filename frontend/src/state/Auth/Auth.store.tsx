import { create } from 'zustand';

interface AuthStore {
    userId: bigint | null;
    token: string;
    status: boolean;
    setToken: (token: string) => void;
    setUserID: (userId: bigint) => void;
    setStatus: (status: boolean) => void;
    clearAuth: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    token: '',
    userId: null,
    status: false,
    setToken: (token: string) => set({ token }),
    setUserID: (userId: bigint) => set({ userId }),
    setStatus: (status: boolean) => set({ status }),
    clearAuth: () => set({ token: '', userId: null, status: false }),
}));

export default useAuthStore;
