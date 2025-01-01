import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { createCabin, editCabin } from '../../services/apiCabins';
import { Cabin, CabinFormData } from '../../utils/interfaces';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';
import Button from '../../ui/Button';
import toast from 'react-hot-toast';
import Input from '../../ui/Input';
import Form from '../../ui/Form';

function CreateCabinForm({ cabinEdit }: { cabinEdit?: Cabin }) {
  const isEditingSession = Boolean(cabinEdit);
  const { id: editId, ...editCabinDetails } = cabinEdit || {};
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState } = useForm<CabinFormData>({
    defaultValues: isEditingSession ? editCabinDetails : undefined,
  });
  const { errors } = formState;

  const { mutate: addCabin, isPending: isAdding } = useMutation({
    mutationFn: (data: CabinFormData) =>
      createCabin({
        ...data,
        image: data.image.item(0) as string & File,
      }),
    onSuccess: () => {
      toast.success('New Cabin added');
      reset();
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cabins'] }),
  });

  const { mutate: updateCabin, isPending: isUpdating } = useMutation({
    mutationFn: (data: CabinFormData) =>
      editCabin(
        {
          ...data,
          image: (data.image.item(0) as string & File) || cabinEdit!.image,
          id: editId!,
          created_at: cabinEdit!.created_at,
        },
        editId!
      ),
    onSuccess: () => {
      toast.success('Cabin updated');
      reset();
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cabins'] }),
  });

  const onError: SubmitErrorHandler<CabinFormData> = errors => {
    console.log(errors);
  };

  const onSubmit = (data: CabinFormData) =>
    isEditingSession ? updateCabin(data) : addCabin(data);

  const isBusy = isAdding || isUpdating;
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label='Cabin Name' error={errors?.name?.message}>
        <Input
          disabled={isBusy}
          type='text'
          id='name'
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
        <Input
          disabled={isBusy}
          type='number'
          id='maxCapacity'
          {...register('maxCapacity', {
            required: 'This field is required',
            min: { value: 1, message: 'Capacity should be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label='Regular price' error={errors?.regularPrice?.message}>
        <Input
          disabled={isBusy}
          type='number'
          id='regularPrice'
          {...register('regularPrice', {
            required: 'This field is required',
            min: { value: 1, message: 'Price should be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label='Discount' error={errors?.discount?.message}>
        <Input
          disabled={isBusy}
          type='number'
          id='discount'
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            min: { value: 0, message: 'Discount should not be negative' },
            max: {
              value: 100,
              message: 'Discount should not be more than 100',
            },
          })}
        />
      </FormRow>

      <FormRow label='Cabin Description' error={errors?.description?.message}>
        <Textarea
          disabled={isBusy}
          id='description'
          defaultValue=''
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Cabin photo' error={errors?.image?.message}>
        <FileInput
          id='image'
          accept='image/*'
          {...register('image', {
            required: isEditingSession ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        <Button $variation='secondary' type='reset'>
          Cancel
        </Button>
        <Button disabled={isBusy} type='submit'>
          {isEditingSession ? 'Edit' : 'Create new'} cabin
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
