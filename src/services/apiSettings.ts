import supabase from './supabase';
import { Database } from '../utils/database.types';
type Settings = Database['public']['Tables']['settings']['Row'];
type UpdateSettings = Database['public']['Tables']['settings']['Update'];
export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single<Settings>();

  if (error) {
    console.error(error);
    throw new Error('Settings could not be loaded');
  }
  return data;
}

// We expect a newSetting object that looks like {setting: newValue}

export async function updateSetting(
  newSetting: UpdateSettings
): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .update(newSetting)
    .eq('id', 1)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Settings could not be updated');
  }
  return data;
}
