import { create } from 'zustand';
import { URL } from '../../App';

export interface FilterCriteria {
    type?: string,
    gender?: string,
    age?: number,
    breed?: string,
    disposition?: string,
    availability?: string
}

export interface Pet {
    pet_id: number;
    name: string;
    type: string;
    breed: string;
    image: string;
    age: number;
    availability: string;
    gender: string;
    disposition: (string | undefined)[];
    shelter_id: string;
    description: string;
}

interface PetStore {
    pets: Pet[];                       
    currentPet: Pet | null;          // For cases where we need to track one pet in state
    fetchPets: (filter?: FilterCriteria) => Promise<void>; 
    fetchPet: (petID: number) => Promise<void>;
    addPet: (token: string, newPet: Partial<Pet>) => Promise<void>;
    updatePet: (petID: number, updatedData: Partial<Pet>) => Promise<void>;
    deletePet: (petID: number, token: string) => Promise<void>;
    uploadAvatar: (petID: number, avatar: File) => Promise<void>;
    addDisposition: (token: string, petID: number, dispostions: string[]) => Promise<void>;
    getAvatar: (petID: number) => Promise<string | undefined>;
}


const usePetStore = create<PetStore>((set) => ({
    pets: [],
    currentPet: null,
    fetchPets: async (filters = {}) => {
        try {
            
            if (typeof filters !== 'object' || Array.isArray(filters)) {
                throw new Error("Invalid filters parameter. Expected an object.");
            }
    
            const cleanedFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '' && value !== 0)
            );
            
            const queryParams = new URLSearchParams(cleanedFilters).toString();
            const requestUrl = queryParams ? `${URL}pets?${queryParams}` : `${URL}pets`;
    
            console.log("Fetching pets from:", requestUrl); 
            const response = await fetch(requestUrl, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch pets');
            }
            const data = await response.json();
            console.log("Pet Data: ", data);

            // Now, fetch the dispositions for each pet and add it to pets data
            const fetchData = data.pets.map(async (pet: Pet) => {
                try {
                    const dispositionsRes = await fetch(`${URL}pet_dispositions/${pet.pet_id}`, { 
                        method: 'GET' 
                    });
                    let dispositions: string[] = [];
                    if (dispositionsRes.status === 404) {
                        console.warn(`No dispositions found for pet ${pet.pet_id}, setting to empty array.`);
                    }
                    else if (!dispositionsRes.ok) {
                        throw new Error(`Failed to fetch dispositions for pet ${pet.pet_id}`);
                    }
                    else {
                        const dispositionData = await dispositionsRes.json();
                        dispositions = dispositionData.dispositions;
                    }
                    const avatarURL = await usePetStore.getState().getAvatar(pet.pet_id);
                    return { ...pet, disposition: dispositions, image: avatarURL };

                } catch (error) {
                    console.error(error);
                    return {...pet, disposition: [], image: null };
                }
            });

            const petsWithDispositionsAndImage = await Promise.all(fetchData);
            set({ pets: petsWithDispositionsAndImage });

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
            const response = await fetch(`${URL}pets`, {
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
            console.log("[DEBUG] add pet response data:", data);
            set((state) => ({ pets: [...state.pets, data.pet] }));
            return data.pet_id;
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
            formData.append('file', avatar);
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
    addDisposition: async (token: string, petID: number, dispositions: string[]) => {
        try {
            for (const disposition of dispositions) {
                const response = await fetch(`${URL}pet_dispositions/${petID}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ disposition }),
                });
                if (!response.ok) {
                    throw new Error(`Failed to add disposition: ${disposition}`);
                }
            }
        } catch (error) {
            console.error('Failed to add dispositions:', error);
        }
    },
    getAvatar: async (petID: number) => {
        try {
            const response = await fetch(`${URL}pets/${petID}/avatar`, {
                method: 'GET',
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch avatar for pet ${petID}`);
            }
            const blob = await response.blob();
            return window.URL.createObjectURL(blob);
        } catch (error) {
            console.error(`Failed to fetch avatar for pet ${petID}:`, error);
        }
    }
}));

export default usePetStore;