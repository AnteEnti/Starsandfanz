import { SiteSettings } from '../types';

const SITE_SETTINGS_KEY = 'fanzAddaSiteSettings';

const DEFAULTS: SiteSettings = {
  siteName: 'Fanz Adda',
  logo: null,
  favicon: null,
};

export const loadSiteSettings = (): SiteSettings => {
  try {
    const storedSettings = localStorage.getItem(SITE_SETTINGS_KEY);
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      // Ensure all keys are present, falling back to default for missing ones
      return { ...DEFAULTS, ...parsed };
    }
    return DEFAULTS;
  } catch (error) {
    console.error("Failed to load site settings from localStorage", error);
    return DEFAULTS;
  }
};

export const saveSiteSettings = (settings: SiteSettings) => {
  try {
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save site settings to localStorage", error);
  }
};
