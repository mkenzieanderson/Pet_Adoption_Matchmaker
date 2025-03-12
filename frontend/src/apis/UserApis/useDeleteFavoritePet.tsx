import { useMutation } from '@tanstack/react-query';
import useUserStore from '../../state/User/User.store';

export const useDeleteFavoritePet = () => {
    const deleteFavoritePet = useUserStore((state) => state.deleteFavoritePet);

    return useMutation({
        mutationFn: ({ userID, petID, token }: { userID: number; petID: number; token: string }) =>
            deleteFavoritePet(userID, petID, token),
    });
};
