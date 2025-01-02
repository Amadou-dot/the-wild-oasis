import { SubmitErrorHandler, useForm } from 'react-hook-form';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Form from '../../ui/Form';
import { useAddCabin } from './useAddCabin';
import { useUpdateCabin } from './useUpdateCabin';
import { Database } from '../../utils/database.types';
type Cabin = Database['public']["Tables"]['cabins']['Row'];
type NewCabin = Database['public']['Tables']['cabins']['NewCabin'];
function CreateCabinForm({ cabinEdit }: { cabinEdit?: Cabin }) {
  const { isPending: isAdding, addCabin } = useAddCabin();
  const { isPending: isUpdating, updateCabin } = useUpdateCabin(cabinEdit || null);
  const editCabinDetails: Partial<Cabin> = cabinEdit
    ? {
        ...cabinEdit,
        name: cabinEdit.name ?? undefined,
        maxCapacity: cabinEdit.maxCapacity ?? undefined,
        regularPrice: cabinEdit.regularPrice ?? undefined,
        discount: cabinEdit.discount ?? undefined,
        description: cabinEdit.description ?? undefined,
        image: undefined,
      }
    : {};
  const isBusy = isAdding || isUpdating;
  const isEditingSession = Boolean(cabinEdit);
  
  const { register, handleSubmit, reset, formState:{errors} } = useForm<Cabin>({
    defaultValues: isEditingSession
      ? { ...editCabinDetails, image: undefined }
      : undefined,
  });


  const onError: SubmitErrorHandler<Cabin> = errors => {
    console.log(errors);
  };
  const onSubmit = (data: Cabin | NewCabin) =>
    isEditingSession
      ? updateCabin(data as Cabin)
      : addCabin(data as NewCabin, { onSuccess: () => reset() });

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
