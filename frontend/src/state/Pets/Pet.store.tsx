import { create } from 'zustand';
import { URL } from '../../App';

export interface Pet {
    pet_id: number;
    name: string;
    breed: string;
    image: string;
    age: number;
    availability: string;
    gender: string;
    disposition: string[];
    shelter: string;
}

interface PetStore {
    pets: Pet[];                       
    currentPet: Pet | null;          // For cases where we need to track one pet in state
    fetchPets: () => Promise<void>; 
    fetchPet: (petID: number) => Promise<void>;
    addPet: (token: string, newPet: Partial<Pet>) => Promise<void>;
    updatePet: (petID: number, updatedData: Partial<Pet>) => Promise<void>;
    deletePet: (petID: number, token: string) => Promise<void>;
    uploadAvatar: (petID: number, avatar: File) => Promise<void>;
}


const usePetStore = create<PetStore>((set) => ({
    pets: [],
    currentPet: null,
    fetchPets: async () => {
        try {
            const response = await fetch(`${URL}pets`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch pets');
            }
            const data = await response.json();
            set({ pets: data.pets });
        } catch (error) {
            console.error('Failed to fetch pets:', error);
        }
    },
    fetchPet: async (petID: number) => {
        try {
            const response = await fetch(`${URL}pets/${petID}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch pet');
            }
            const data = await response.json();
            set({ currentPet: data.pet });
        } catch (error) {
            console.error('Failed to fetch pet:', error);
        }
    },
    addPet: async (token: string, newPet: Partial<Pet>) => {
        try {
            const response = await fetch(`${URL}/pets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newPet),
            });
            if (!response.ok) {
                throw new Error('Failed to add pet');
            }
            const data = await response.json();
            set((state) => ({ pets: [...state.pets, data.pet] }));
        } catch (error) {
            console.error('Failed to add pet:', error);
        }
    },
    updatePet: async (petID: number, updatedData: Partial<Pet>) => {
        try {
            const response = await fetch(`${URL}pets/${petID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error('Failed to update pet');
            }
            const data = await response.json();
            set((state) => ({
                pets: state.pets.map((pet) =>
                    pet.pet_id === petID ? data.pet : pet
                ),
            }));
        } catch (error) {
            console.error('Failed to update pet:', error);
        }
    },
    deletePet: async (petID: number, token: string) => {
        try {
            const response = await fetch(`${URL}pets/${petID}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete pet');
            }
            set((state) => ({
                pets: state.pets.filter((pet) => pet.pet_id !== petID),
            }));
        } catch (error) {
            console.error('Failed to delete pet:', error);
        }
    },
    uploadAvatar: async (petID: number, avatar: File) => {
        try {
            const formData = new FormData();
            formData.append('avatar', avatar);
            const response = await fetch(`${URL}pets/${petID}/avatar`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to upload avatar');
            }
            const data = await response.json();
            set((state) => ({
                pets: state.pets.map((pet) =>
                    pet.pet_id === petID ? { ...pet, image: data.image } : pet
                ),
            }));
        } catch (error) {
            console.error('Failed to upload avatar:', error);
        }
    },
}));

export default usePetStore;