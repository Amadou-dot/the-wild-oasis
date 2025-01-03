import { UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { editCabin } from '../../services/apiCabins';
import { Database } from '../../utils/database.types';
type Cabin = Database['public']['Tables']['cabins']['Row'];

interface UseUpdateCabinReturn {
  isPending: boolean;
  updateCabin: UseMutateFunction<Cabin, unknown, Cabin, unknown>;
}

export function useUpdateCabin(cabinEdit: Cabin | null): UseUpdateCabinReturn {
  const queryClient = useQueryClient();
  const { id: editId } = cabinEdit || {};
  const { mutate: updateCabin, isPending: isUpdating } = useMutation({
    mutationFn: (data: Cabin) => {
      return editCabin(
        {
          ...data,
          image: data.image?.length ? data.image : cabinEdit?.image,
          id: editId!,
          created_at: cabinEdit!.created_at,
        },
        editId!
      );
    },
    onSuccess: () => {
      toast.success('Cabin updated');
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cabins'] }),
  });
  if (!cabinEdit) return { isPending: false, updateCabin: () => {} };
  return { isPending: isUpdating, updateCabin };
}
