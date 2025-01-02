import { Database } from '../utils/database.types';
import supabase from './supabase';
type Cabin = Database['public']['Tables']['cabins']['Row'];
type CabinUpdate = Database['public']['Tables']['cabins']['Update'];
type NewCabin = Database['public']['Tables']['cabins']['NewCabin'];

const handleImage = async (image: FileList | string): Promise<string> => {
  // If image is already a string, it means it's a URL
  if (typeof image === 'string') {
    return image;
  }

  // Generate a random name for the image
  const [file] = image;
  const imageName = `${Math.random()}-${file.name}`.replace(/\//g, '');
  const imagePath = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/cabin-images/${imageName}`;

  const { error: uploadError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, file);

  if (uploadError) throw new Error('Error uploading image');

  return imagePath;
};

export const getCabins = async () => {
  const { data: cabins, error } = await supabase.from('cabins').select('*');
  if (!error) return cabins as Cabin[];
  throw new Error('Error fetching cabins');
};

export const deleteCabin = async (id: number) => {
  const { error } = await supabase.from('cabins').delete().eq('id', id);
  if (error) throw new Error('Error deleting cabin');
};

export const createCabin = async (newCabin: NewCabin): Promise<Cabin> => {
  const imagePath = await handleImage(newCabin.image);

  const { data, error } = await supabase
    .from('cabins')
    .insert([{ ...newCabin, image: imagePath }])
    .select()
    .single();

  if (error) {
    if (typeof newCabin.image !== 'string') {
      await supabase.storage
        .from('cabin-images')
        .remove([imagePath.split('/').pop()!]);
    }
    throw new Error('Error creating cabin');
  }

  return data as Cabin;
};

export const editCabin = async (cabin: CabinUpdate, id: number) => {
  const imagePath = cabin.image ? await handleImage(cabin.image) : null;

  const { data, error } = await supabase
    .from('cabins')
    .update({ ...cabin, image: imagePath })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (imagePath && typeof cabin.image !== 'string') {
      await supabase.storage
        .from('cabin-images')
        .remove([imagePath.split('/').pop()!]);
    }
    throw new Error('Error updating cabin');
  }

  return data as Cabin;
};
