import { create } from 'zustand';

interface Pet {
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
    fetchPets: (token: string) => void;
}


const usePetStore = create<PetStore>((set) => ({
    /** 
     * @type {Pet[]} pets - An array of pets
     * @type {function} fetchPets - A function that fetches pets from the backend
     * Note: The param @type {token} is temporary and will be replaced with global
     * auth state management
    */
    pets: [],
    fetchPets: async (token: string) => {
        try {
            const response = await fetch('http://localhost:8080/pets', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }); 
            if (!response.ok) {
                throw new Error('Failed to fetch pets');
            }
            const data = await response.json();
            //console.log(data.pets); // For debugging, will be removed
            set({ pets: data.pets });
        } catch (error) {
            console.error('Failed to fetch pets:', error);
        }
    },
}));

export default usePetStore;