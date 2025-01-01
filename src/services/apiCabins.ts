import { Cabin } from '../utils/interfaces';
import supabase from './supabase';

export const getCabins = async () => {
  const { data: cabins, error } = await supabase.from('cabins').select('*');
  if (!error) return cabins as Cabin[];
  throw new Error('Error fetching cabins');
};

export const deleteCabin = async (id: number) => {
  const { error } = await supabase.from('cabins').delete().eq('id', id);
  if (error) throw new Error('Error deleting cabin');
};

export const addCabin = async (newCabin: Cabin) => {
  const imageName = `${Math.random()}-${newCabin.image.name}`.replace(/\//g, '');
  const imagePath = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`;
  // create cabin
  const {data, error } = await supabase
    .from('cabins')
    .insert([{ ...newCabin, image: imagePath }])
    .select();
  if (error) throw new Error('Error adding cabin');

  // upload image
  const {error: uploadError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);
    if (uploadError) throw new Error('Error uploading image');

    // delete cabin if image upload fails
    if (uploadError) {
      await supabase.from('cabins').delete().eq('id', (data as unknown as Cabin)?.id);
      throw new Error('Cabin image upload failed. Cabin was not added');
    }

    return data as Cabin[];
};


