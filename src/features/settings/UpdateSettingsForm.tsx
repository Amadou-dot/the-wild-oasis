import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import { Database } from '../../utils/database.types';
import { useSettings } from './useSettings';
import { useUpdateSettings } from './useUpdateSettings';
type Settings = Database['public']['Tables']['settings']['Row'];

function UpdateSettingsForm() {
  const { isPending: isLoading, settings } = useSettings();
  const { isPending: isUpdating, updateSettings } = useUpdateSettings();
  const isPending = isLoading || isUpdating;
  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = settings || {};
  if (isLoading) return <Spinner />;

  const handleUpdateSettings = (
    e: React.FocusEvent<HTMLInputElement>,
    field: keyof Omit<Settings, 'id' | 'created_at'>
  ) => {
    const { value } = e.target;
    if (!value) return;
    updateSettings({ [field]: parseInt(value) });
  };

  return (
    <Form>
      <FormRow label='Minimum nights/booking'>
        <Input
          type='number'
          id='min-nights'
          defaultValue={minBookingLength || 0}
          disabled={isPending}
          onBlur={e => handleUpdateSettings(e, 'minBookingLength')}
        />
      </FormRow>
      <FormRow label='Maximum nights/booking'>
        <Input
          type='number'
          id='max-nights'
          defaultValue={maxBookingLength || 0}
          disabled={isPending}
          onBlur={e => handleUpdateSettings(e, 'maxBookingLength')}
        />
      </FormRow>
      <FormRow label='Maximum guests/booking'>
        <Input
          type='number'
          id='max-guests'
          defaultValue={maxGuestsPerBooking || 0}
          disabled={isPending}
          onBlur={e => handleUpdateSettings(e, 'maxGuestsPerBooking')}
        />
      </FormRow>
      <FormRow label='Breakfast price'>
        <Input
          type='number'
          id='breakfast-price'
          defaultValue={breakfastPrice || 0}
          disabled={isPending}
          onBlur={e => handleUpdateSettings(e, 'breakfastPrice')}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
