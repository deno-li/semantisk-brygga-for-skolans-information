import { useMemo } from 'react';
import { ShanarriIndicator } from '../types/types';
import { SHANARRI_DATA } from '../data/constants';
import { getShanarriDataByProfile } from '../data/profileData';
import { JOURNEY_PROFILES } from '../data/journeyMockData';
import { convertWelfareWheelArrayToShanarri } from '../utils/welfareConverter';

/**
 * Custom hook for welfare data with filtering capabilities
 * @param profileId - The ID of the profile to fetch
 * @param searchQuery - Optional search query to filter data
 * @returns Filtered welfare data
 */
export function useWelfareData(profileId: string = 'erik', searchQuery: string = '') {
  // Get profile-specific data - prioritize Journey Profile data if available
  const shanarriData = useMemo(() => {
    // First, check if this profile has Journey Profile data with welfareWheel
    const journeyProfile = JOURNEY_PROFILES[profileId];
    if (journeyProfile && journeyProfile.welfareWheel && journeyProfile.welfareWheel.length > 0) {
      // Convert Journey Profile welfareWheel data to ShanarriIndicator format
      return convertWelfareWheelArrayToShanarri(journeyProfile.welfareWheel);
    }
    
    // Fall back to profile-specific SHANARRI data
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
