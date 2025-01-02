import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin } from "../../services/apiCabins";

export function useDeleteCabin() {
    const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: deleteCabin,
    onSuccess: () => {
      toast.success('Cabin deleted');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
      throw new Error(error.message);
    },
  });
  return { isPending, deleteCabin: mutate };
}