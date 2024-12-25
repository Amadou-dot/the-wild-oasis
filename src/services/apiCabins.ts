import { Cabin } from '../utils/interfaces';
import supabase from './supabase';

export const getCabins = async () => {
  const { data: cabins, error } = await supabase.from('cabins').select('*');
  if (!error) return cabins as Cabin[];
  throw new Error('Error fetching cabins');
};
