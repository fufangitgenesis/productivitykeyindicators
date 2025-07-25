import { useState, useEffect } from 'react';
import { db } from '../utils/database';
import { Profile } from '../types';

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        await db.init();
        
        // Check for existing profiles
        const profiles = await db.getAll<Profile>('profiles');
        
        if (profiles.length === 0) {
          // Check if a profile with the default name already exists
          const existingDefault = await db.getByIndex<Profile>('profiles', 'name', 'Default Profile');
          
          if (existingDefault) {
            setCurrentProfile(existingDefault);
          } else {
            // Create default profile only if it doesn't exist
            const defaultProfile: Omit<Profile, 'id'> = {
              name: 'Default Profile',
              createdAt: Date.now(),
              settings: { theme: 'light' },
              stats: { totalXP: 0, level: 1 }
            };
            
            const created = await db.add<Profile>('profiles', defaultProfile);
            setCurrentProfile(created);
          }
        } else {
          setCurrentProfile(profiles[0]);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDB();
  }, []);

  return {
    isInitialized,
    currentProfile,
    setCurrentProfile
  };
}