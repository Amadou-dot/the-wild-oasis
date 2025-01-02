import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createCabin } from '../../services/apiCabins';
import { Database } from '../../utils/database.types';
type NewCabin = Database['public']["Tables"]['cabins']['NewCabin'];

export function useAddCabin() {
  const queryClient = useQueryClient();
  const { mutate: addCabin, isPending: isAdding } = useMutation({
    mutationFn: (data: NewCabin) =>
      createCabin(data),
    onSuccess: () => {
      toast.success('New Cabin added');
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cabins'] }),
  });
  return { isPending: isAdding, addCabin };
}
