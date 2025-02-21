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
    currentShelter: Shelter | null;
    fetchShelters: (token: string) => void;
    fetchShelter: (shelterID: number) => void;
    addShelter: (token: string, newShelter: Partial<Shelter>) => void;
    updateShelter: (shelterID: number, updatedData: Partial<Shelter>, token: string) => void;
    deleteShelter: (shelterID: number, token: string) => void;
}

const useShelterStore = create<ShelterStore>((set) => ({
    shelters: [],
    currentShelter: null,
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
    fetchShelter: async (shelterID: number) => {
        try {
            const response = await fetch(`http://localhost:8080/shelters/${shelterID}`, {
                method: 'GET',
                }); 
            if (!response.ok) {
                throw new Error('Failed to fetch shelter');
            }
            const data = await response.json();
            set({ currentShelter: data.shelter });
        } catch (error) {
            console.error('Failed to fetch shelter:', error);
        }
    },
    addShelter: async (token: string, newShelter: Partial<Shelter>) => {
        try {
            const response = await fetch('http://localhost:8080/shelters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newShelter),
            });
            if (!response.ok) {
                throw new Error('Failed to add shelter');
            }
            const data = await response.json();
            set((state) => ({ shelters: [...state.shelters, data.shelter] }));
        } catch (error) {
            console.error('Failed to add shelter:', error);
        }
    },
    updateShelter: async (shelterID: number, updatedData: Partial<Shelter>, token) => {
        try {
            const response = await fetch(`http://localhost:8080/shelters/${shelterID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error('Failed to update shelter');
            }
            const data = await response.json();
            set((state) => ({
                shelters: state.shelters.map((shelter) =>
                    shelter.shelter_id === shelterID ? data.shelter : shelter
                ),
            }));
        } catch (error) {
            console.error('Failed to update shelter:', error);
        }
    },
    deleteShelter: async (shelterID: number, token: string) => {
        try {
            const response = await fetch(`http://localhost:8080/shelters/${shelterID}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete shelter');
            }
            set((state) => ({
                shelters: state.shelters.filter((shelter) => shelter.shelter_id !== shelterID),
            }));
        } catch (error) {
            console.error('Failed to delete shelter:', error);
        }
    }
}));

export default useShelterStore;