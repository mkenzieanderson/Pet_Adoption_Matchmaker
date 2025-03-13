import { create } from 'zustand';
import { Pet } from '../Pets/Pet.store';
import { URL } from '../../App';  

export interface Shelter {
    shelter_id: number;
    name: string;
    address: string;
    user_id: number;
    zip_code: number;
    shelterPets: Pet[];
};

interface ShelterStore {
    shelter: Shelter | null;
    setShelter: (shelter: Shelter) => void;
    fetchShelterPets: (shelterID: number) => Promise<void>;
}

const useShelterStore = create<ShelterStore>((set) => ({
    shelter: null,
    setShelter: (shelter: Shelter | Shelter[]) => {
        const formattedShelter = Array.isArray(shelter) ? shelter[0] : shelter;
        set({ shelter: formattedShelter });
    },
    fetchShelterPets: async (shelterID: number) => {
        try {
            const response = await fetch(`${URL}pets/${shelterID}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch shelter pets');
            }
        } catch (error) {
            console.error('Failed to fetch shelter pets:', error);
        }
    },
}));

export default useShelterStore;