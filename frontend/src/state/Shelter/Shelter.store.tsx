import { create } from 'zustand';

interface Shelter {
    shelter_id: number;
    name: string;
    address: string;
    user_id: number;
    zip_code: number;
};

interface ShelterStore {
    shelters: Shelter[];
    fetchShelters: (token: string) => void;
}

const useShelterStore = create<ShelterStore>((set) => ({
    /** 
     * @type {Shelter[]} shelters - An array of shelters
     * @type {function} fetchShelters - A function that fetches shelters from the backend
     * Note: The param @type {token} is temporary and will be replaced with global
     * auth state management
    */
    shelters: [],
    fetchShelters: async (token: string) => {
        try {
            const response = await fetch('http://localhost:8080/shelters', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }); 
            if (!response.ok) {
                throw new Error('Failed to fetch shelters');
            }
            const data = await response.json();
            set({ shelters: data.shelters });
        } catch (error) {
            console.error('Failed to fetch shelters:', error);
        }
    },
}));

export default useShelterStore;    