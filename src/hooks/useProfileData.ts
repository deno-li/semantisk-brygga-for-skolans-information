import { useMemo } from 'react';
import { SHANARRI_DATA, RISK_FACTORS, PROTECTIVE_FACTORS, CHILD_PROFILE } from '../data/constants';
import { getShanarriDataByProfile, getRiskFactorsByProfile, getProtectiveFactorsByProfile } from '../data/profileData';
import { getProfileById } from '../data/childProfiles';

/**
 * Custom hook to fetch and memoize profile-specific data
 * @param profileId - The ID of the profile to fetch
 * @returns Profile data including shanarri data, risk factors, protective factors, and child profile
 */
export function useProfileData(profileId: string = 'erik') {
  const shanarriData = useMemo(() => {
    const profileData = getShanarriDataByProfile(profileId);
    return profileData.length > 0 ? profileData : SHANARRI_DATA;
  }, [profileId]);

  const riskFactors = useMemo(() => {
    const profileRiskFactors = getRiskFactorsByProfile(profileId);
    return profileRiskFactors.length > 0 ? profileRiskFactors : RISK_FACTORS;
  }, [profileId]);

  const protectiveFactors = useMemo(() => {
    const profileProtectiveFactors = getProtectiveFactorsByProfile(profileId);
    return profileProtectiveFactors.length > 0 ? profileProtectiveFactors : PROTECTIVE_FACTORS;
  }, [profileId]);

  const childProfile = useMemo(() => {
    const currentProfile = getProfileById(profileId);
    return currentProfile || CHILD_PROFILE;
  }, [profileId]);

  const needsAttention = useMemo(
    () => shanarriData.filter(d => d.status < 3).length,
    [shanarriData]
  );

  return {
    shanarriData,
    riskFactors,
    protectiveFactors,
    childProfile,
    needsAttention,
  };
}
