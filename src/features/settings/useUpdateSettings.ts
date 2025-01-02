import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSetting } from '../../services/apiSettings';
import toast from 'react-hot-toast';
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => toast.success('Settings updated'),
    onError: () => toast.error('Failed to update settings'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });
  return { isPending, updateSettings: mutate };
}
