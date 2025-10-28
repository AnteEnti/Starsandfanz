import { UserProfileData } from '../types';

const API_BASE_URL = 'https://starsandfanz.com/wp-json';
const TOKEN_KEY = 'fanz_adda_jwt';

const mapWpUserToProfileData = (wpUser: any): UserProfileData => {
  const meta = wpUser.meta || {};
  return {
    id: wpUser.id,
    name: wpUser.name || 'Fan',
    avatar: wpUser.avatar_urls?.['96'] || `https://i.pravatar.cc/150?u=${wpUser.id}`,
    favoriteStars: meta.favorite_stars ? meta.favorite_stars.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    favoriteMovies: meta.favorite_movies ? meta.favorite_movies.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    favoriteGenres: meta.favorite_genres ? meta.favorite_genres.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    roles: wpUser.roles || ['subscriber'],
  };
};

export const loginUser = async (username: string, password: string): Promise<{ token: string; user: UserProfileData }> => {
  const response = await fetch(`${API_BASE_URL}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed. Please check your credentials.');
  }

  const data = await response.json();
  const token = data.token;

  const userProfile = await getCurrentUser(token);
  
  return { token, user: userProfile };
};

export const registerUser = async (username: string, email: string, password: string): Promise<any> => {
  // Use the custom, secure endpoint we created in functions.php
  const response = await fetch(`${API_BASE_URL}/fanzadda/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Our custom endpoint provides clear error messages we can use directly.
    throw new Error(errorData.message || 'Registration failed.');
  }

  return await response.json();
};


export const getCurrentUser = async (token: string): Promise<UserProfileData> => {
    // This is the correct endpoint for fetching all user meta fields needed for the profile.
    const response = await fetch(`${API_BASE_URL}/wp/v2/users/me?context=edit`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Failed to fetch user profile. Status:", response.status, "Body:", errorBody);
        const errorJson = JSON.parse(errorBody);
        throw new Error(errorJson.message || `Failed to fetch user profile. Server responded with status ${response.status}. This is likely a WordPress permission issue.`);
    }

    const wpUser = await response.json();
    return mapWpUserToProfileData(wpUser);
};

export const updateCurrentUser = async (token: string, profileUpdate: Partial<UserProfileData>): Promise<UserProfileData> => {
    const payload: { meta?: any } = {};
    if (profileUpdate.favoriteStars) payload.meta = { ...payload.meta, favorite_stars: profileUpdate.favoriteStars.join(', ') };
    if (profileUpdate.favoriteMovies) payload.meta = { ...payload.meta, favorite_movies: profileUpdate.favoriteMovies.join(', ') };
    if (profileUpdate.favoriteGenres) payload.meta = { ...payload.meta, favorite_genres: profileUpdate.favoriteGenres.join(', ') };
    if (profileUpdate.name) (payload as any).name = profileUpdate.name;

    // The context=edit parameter is also required for updating user meta.
    const response = await fetch(`${API_BASE_URL}/wp/v2/users/me?context=edit`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile.');
    }
    
    const updatedWpUser = await response.json();
    return mapWpUserToProfileData(updatedWpUser);
};

export const validateToken = async (token: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/jwt-auth/v1/token/validate`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.ok;
    } catch (error) {
        return false;
    }
};

export const storeToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);