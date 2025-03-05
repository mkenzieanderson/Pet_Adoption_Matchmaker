import { create } from 'zustand';
import { Pet } from '../Pets/Pet.store';
import { URL } from '../../App'

export interface User {
    user_id: bigint;
    name: string;
    email: string;
    phone_number: string;
    role: string;
    favoritePets: Pet[];
}

interface UserStore {
    user: User | null;
    fetchUser: (userID: bigint, token: string) => Promise<void>;
    updateUser: (userID: bigint, token: string, updatedData: Partial<User>) => Promise<void>;
    addFavoritePet: (petID: number, userID: bigint, token: string) => Promise<void>;
    deleteFavoritePet: (petID: number, userID: bigint, token: string) => Promise<void>;
    fetchFavoritePets: (userID: bigint, token: string) => Promise<void>;
    clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    fetchUser: async (userID: bigint, token: string) => {
        try {
            const response = await fetch(`${URL}users/${userID}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const data = await response.json();
            console.log("User data: ", data);

            // Fetch the user's favorite pets
            if (data.role === 'user') {
                const favoritesResponse = await fetch(`${URL}favorites/${userID}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!favoritesResponse.ok) {
                    throw new Error('Failed to fetch favorite pets');
                }
                const favoritesData = await favoritesResponse.json();
                const favoritePets = await Promise.all(
                    favoritesData.favorites.map(async (favorite: { pet_id: number }) => {
                        const petResponse = await fetch(`${URL}pets/${favorite.pet_id}`, {
                            method: 'GET',
                        });
                        if (!petResponse.ok) {
                            throw new Error('Failed to fetch pet');
                        }
                        return await petResponse.json();
                    })
                );
 
                set({ user: { ...data, favoritePets } });
            } else {
                set({ user: data });
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    },
    updateUser: async (userID: bigint, token: string, updatedData: Partial<User>) => {
        try {
            const response = await fetch(`${URL}users/${userID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            const data = await response.json();
            set({ user: data });
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    },
    addFavoritePet: async (petID: number, userID: bigint, token: string) => {
        try {
            const response = await fetch(`${URL}favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ pet_id: petID, user_id: userID }),
            });
            if (!response.ok) {
                throw new Error('Failed to add favorite pet');
            }
        // Need to perform second fetch to get the Pet object necessary to update the user state
        const data = await response.json();
        const petResponse = await fetch(`${URL}pets/${data.pet_id}`, {
            method: 'GET',
        });
        if (!petResponse.ok) {
            throw new Error('Failed to fetch pet');
        }
        const pet = await petResponse.json();
        set((state) => ({
            user: state.user ? {
                ...state.user,
                favoritePets: [...state.user.favoritePets, pet],
            } : null,
        }));
        } catch (error) {
            console.error('Failed to add favorite pet:', error);
        }
    },
    deleteFavoritePet: async (petID: number, userID: bigint, token: string) => {
        try {
            const response = await fetch(`${URL}${userID}/favorites/${petID}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete favorite pet');
            }
            set((state) => ({
                user: state.user ? {
                    ...state.user,
                    favoritePets: state.user.favoritePets.filter((pet) => pet.pet_id !== petID),
                } : null,
            }));
        } catch (error) {
            console.error('Failed to delete favorite pet:', error);
        }
    },
    fetchFavoritePets: async (userID: bigint, token: string) => {
        try {
            const response = await fetch(`${URL}favorites/${userID}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch favorite pets');
            }
            // Second fetch to get the Pet objects necessary to update the user state
            const data = await response.json();
            const favoritePets = await Promise.all(
                data.favorites.map(async (favorite: { pet_id: number }) => {
                    const pet = await fetch(`${URL}${favorite.pet_id}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!pet.ok) {
                        throw new Error('Failed to fetch pet');
                    }
                    return await pet.json();
                })
            );
            set((state) => ({
                user: state.user ? { ...state.user, favoritePets } : null,
            }));
        } catch (error) {
            console.error('Failed to fetch favorite pets:', error);
        }
    },
    clearUser: () => set({ user: null }),
}));

export default useUserStore;