import { StoredCabin } from '../utils/interfaces';
import supabase from './supabase';

export const getCabins = async () => {
  const { data: cabins, error } = await supabase.from('cabins').select('*');
  if (!error) return cabins as StoredCabin[];
  throw new Error('Error fetching cabins');
};

export const deleteCabin = async (id: number) => {
  const {error } = await supabase.from('cabins').delete().eq('id', id);
  if (error) throw new Error('Error deleting cabin');
};

const handleImage = async (image: File | string) => {
  const isNewImage = image instanceof File;
  if (!isNewImage) return image;

  const imageName = `${Math.random()}-${image.name}`.replace(/\//g, '');
  const imagePath = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`;

  const { error: uploadError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, image);
  
  if (uploadError) throw new Error('Error uploading image');
  
  return imagePath;
};

export const createCabin = async (newCabin: Omit<StoredCabin, 'id' | 'created_at'> & { image: File }) => {
  const imagePath = await handleImage(newCabin.image);
  
  const { data, error } = await supabase
    .from('cabins')
    .insert([{ ...newCabin, image: imagePath }])
    .select()
    .single();

  if (error) {
    if (imagePath !== newCabin.image) {
      await supabase.storage
        .from('cabin-images')
        .remove([imagePath.split('/').pop()!]);
    }
    throw new Error('Error creating cabin');
  }

  return data as StoredCabin;
};

export const editCabin = async (
  cabin: Partial<StoredCabin> & { image: File | string }, 
  id: number
) => {
  const imagePath = await handleImage(cabin.image);

  const { data, error } = await supabase
    .from('cabins')
    .update({ ...cabin, image: imagePath })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (imagePath !== cabin.image) {
      await supabase.storage
        .from('cabin-images')
        .remove([imagePath.split('/').pop()!]);
    }
    throw new Error('Error updating cabin');
  }

  return data as StoredCabin;
};