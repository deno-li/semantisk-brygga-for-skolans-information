import { useMemo } from 'react';
import { ShanarriIndicator } from '../types/types';
import { SHANARRI_DATA } from '../data/constants';
import { getShanarriDataByProfile } from '../data/profileData';

/**
 * Custom hook for welfare data with filtering capabilities
 * @param profileId - The ID of the profile to fetch
 * @param searchQuery - Optional search query to filter data
 * @returns Filtered welfare data
 */
export function useWelfareData(profileId: string = 'erik', searchQuery: string = '') {
  // Get profile-specific data or fall back to default (Erik's data from constants)
  const shanarriData = useMemo(() => {
    const profileData = getShanarriDataByProfile(profileId);
    return profileData.length > 0 ? profileData : SHANARRI_DATA;
  }, [profileId]);

  // Filter Logic
  const filteredData = useMemo(() => {
    if (!searchQuery) return shanarriData;
    
    const query = searchQuery.toLowerCase();
    return shanarriData.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.nameEn.toLowerCase().includes(query) ||
      item.notes.toLowerCase().includes(query) ||
      item.icf.toLowerCase().includes(query)
    );
  }, [shanarriData, searchQuery]);

  const hasData = filteredData.length > 0;

  return {
    shanarriData,
    filteredData,
    hasData,
  };
}
