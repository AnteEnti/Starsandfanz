import { Post, PostType, AdminUser, MovieDetails, CelebrityDetails, Reaction, FanzSay } from '../types';
import { formatTimestamp } from '../utils/formatTimestamp';

const API_BASE_URL = 'https://starsandfanz.com/wp-json/wp/v2';

// A mapping from WordPress meta keys (assumed) to our app's PostType enum
const postTypeMap: { [key: string]: PostType } = {
  Image: PostType.Image,
  Announcement: PostType.Announcement,
  ProjectAnnouncement: PostType.ProjectAnnouncement,
  Trailer: PostType.Trailer,
  Anniversary: PostType.Anniversary,
  Birthday: PostType.Birthday,
  MovieDetails: PostType.MovieDetails,
  CharacterIntroduction: PostType.CharacterIntroduction,
  Countdown: PostType.Countdown,
  Filmography: PostType.Filmography,
  Awards: PostType.Awards,
  Celebrity: PostType.Celebrity,
  BoxOffice: PostType.BoxOffice,
  Trivia: PostType.Trivia,
};
const wpPostTypeMap = Object.fromEntries(Object.entries(postTypeMap).map(([k, v]) => [v, k]));


// Helper to safely parse a single JSON object from meta fields
const parseMetaJson = (field: any, fallback: any = undefined) => {
    if (Array.isArray(field) && field.length > 0) {
        field = field[0];
    }
    if (typeof field !== 'string') return field || fallback;
    try {
      const cleanedField = field.replace(/\\"/g, '"');
      return cleanedField ? JSON.parse(cleanedField) : fallback;
    } catch (e) {
      console.warn("Could not parse meta JSON string:", field, e);
      return fallback;
    }
};

/**
 * Robustly parses meta fields that should contain an array of objects.
 * Handles multiple formats from WordPress:
 * 1. A single string containing a JSON array: '\[{...}, {...}\]'
 * 2. An array containing a single stringified JSON array: \['\[{...}, {...}\]'\]
 * 3. An array of individual JSON strings (for repeatable fields): \['{...}', '{...}'\]
 */
const parseMetaArray = (field: any, fallback: any[] = []): any[] => {
    if (!field) return fallback;

    let target = field;

    // Handle standard WP meta array wrapper e.g. ['...']
    if (Array.isArray(target) && target.length === 1 && typeof target[0] === 'string') {
        target = target[0];
    }
    
    // Handle repeatable fields which give an array of strings e.g. ['{...}', '{...}']
    if (Array.isArray(target)) {
        return target.map(item => {
            if (typeof item === 'string') {
                try { return JSON.parse(item.replace(/\\"/g, '"')); } catch (e) { return null; }
            }
            return item; // Already an object
        }).filter(Boolean);
    }
    
    // Handle a single string that contains a JSON array e.g. '[{...}, {...}]'
    if (typeof target === 'string') {
        try {
            const parsed = JSON.parse(target.replace(/\\"/g, '"'));
            // This can also be a double-encoded JSON string
            if (typeof parsed === 'string') {
                 const doubleParsed = JSON.parse(parsed);
                 return Array.isArray(doubleParsed) ? doubleParsed : fallback;
            }
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (e) {
            console.warn("Could not parse meta array string:", target, e);
            return fallback;
        }
    }
    
    return fallback;
};


const mapRelationshipIds = (field: any, prefix: 'movie-' | 'celeb-'): string[] => {
    if (Array.isArray(field)) {
        return field.map(item => {
            if (typeof item === 'number' || (typeof item === 'string' && !isNaN(Number(item)))) {
                return `${prefix}${item}`;
            }
            if (typeof item === 'object' && item !== null && (item.ID || item.id)) {
                return `${prefix}${item.ID || item.id}`;
            }
            return null;
        }).filter((id): id is string => id !== null);
    }
    return parseMetaJson(field, []);
};

const stripHtml = (html: string | undefined): string => {
  if (!html) return '';
  if (typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
  return html.replace(/<[^>]+>/g, '');
};

const mapWpPostToAppData = (wpPost: any): Post => {
    const meta = wpPost.meta || {};

    let type: PostType;
    if (wpPost.type === 'fanzposters') {
        type = PostType.Image;
    } else {
        const typeKey = (Array.isArray(meta.fanz_adda_post_type) ? meta.fanz_adda_post_type[0] : meta.fanz_adda_post_type) || 'Announcement';
        type = postTypeMap[typeKey] || PostType.Announcement;
    }
    
    const defaultReactions: Reaction[] = [
      { id: 'love', emoji: '❤️', count: 0 },
      { id: 'whistle', emoji: '🥳', count: 0 },
      { id: 'celebrate', emoji: '🎉', count: 0 },
    ];
    
    const reactionsFromMeta = parseMetaArray(meta.fanz_adda_reactions);
    const reactions: Reaction[] = reactionsFromMeta.length > 0 ? reactionsFromMeta : defaultReactions;
    
    const parsedFanzSays: FanzSay[] = parseMetaArray(meta.fanz_say);
    
    let imageUrlSource = (Array.isArray(meta.image_url) ? meta.image_url[0] : meta.image_url) || wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    if (imageUrlSource && imageUrlSource.startsWith('data:image')) {
        imageUrlSource = imageUrlSource.replace(/\\\//g, '/');
    }

    const post: Post = {
        id: String(wpPost.id),
        type: type,
        author: wpPost._embedded?.author?.[0]?.name || 'Fanz Adda Admin',
        avatar: wpPost._embedded?.author?.[0]?.avatar_urls?.['96'] || 'https://i.pravatar.cc/150?u=admin',
        timestamp: formatTimestamp(wpPost.date),
        content: stripHtml(wpPost.content?.rendered),
        imageUrl: imageUrlSource,
        reactions: reactions,
        fanzSays: parsedFanzSays,
        reactionsEnabled: true,
        fanzSaysEnabled: true,
        linkedMovieIds: mapRelationshipIds(meta.linked_movie_ids, 'movie-'),
        linkedCelebrityIds: mapRelationshipIds(meta.linked_celebrity_ids, 'celeb-'),
        metaDescription: Array.isArray(meta.meta_description) ? meta.meta_description[0] : meta.meta_description || '',
        seoKeywords: ((Array.isArray(meta.seo_keywords) ? meta.seo_keywords[0] : meta.seo_keywords) || '').split(',').map((s:string) => s.trim()).filter(Boolean),
        videoUrl: Array.isArray(meta.video_url) ? meta.video_url[0] : meta.video_url,
        videoDuration: meta.video_duration ? parseInt((Array.isArray(meta.video_duration) ? meta.video_duration[0] : meta.video_duration), 10) : undefined,
    };
    
    const eventTitle = Array.isArray(meta.event_title) ? meta.event_title[0] : meta.event_title;
    if (eventTitle) {
        post.eventDetails = { title: eventTitle, subtitle: Array.isArray(meta.event_subtitle) ? meta.event_subtitle[0] : meta.event_subtitle };
    }

    const detailsFields = [
      'project_announcement_details', 'movie_details', 'character_details', 
      'countdown_details', 'filmography_details', 'award_details', 
      'celebrity_details', 'box_office_details', 'trivia_details'
    ];
    const postKeyMap: { [key: string]: keyof Post } = {
      project_announcement_details: 'projectAnnouncementDetails',
      movie_details: 'movieDetails',
      character_details: 'characterDetails',
      countdown_details: 'countdownDetails',
      filmography_details: 'filmographyDetails',
      award_details: 'awardDetails',
      celebrity_details: 'celebrityDetails',
      box_office_details: 'boxOfficeDetails',
      trivia_details: 'triviaDetails',
    }

    detailsFields.forEach(field => {
      const detailsJson = meta[field];
      if(detailsJson) {
        const postKey = postKeyMap[field];
        if (postKey) {
            (post as any)[postKey] = parseMetaJson(detailsJson, undefined);
        }
      }
    });

    if (type === PostType.MovieDetails && post.movieDetails) {
        const md = post.movieDetails;
        md.id = `movie-${post.id}`;
        post.content = post.content || stripHtml(md.synopsis) || 'A new movie has been added!';
        post.imageUrl = post.imageUrl || md.posterUrl;
        post.eventDetails = post.eventDetails || { title: 'Movie Spotlight' };
    }

    return post;
};

export async function getPosts(): Promise<Post[]> {
  try {
    const postsResponsePromise = fetch(`${API_BASE_URL}/posts?_embed&per_page=100`, { mode: 'cors' });
    const postersResponsePromise = fetch(`${API_BASE_URL}/fanzposters?_embed&per_page=100`, { mode: 'cors' });

    const [postsResponse, postersResponse] = await Promise.all([postsResponsePromise, postersResponsePromise]);
    
    if (!postsResponse.ok) console.warn(`WordPress API for 'posts' returned status ${postsResponse.status}`);
    if (!postersResponse.ok) console.warn(`WordPress API for 'fanzposters' returned status ${postersResponse.status}`);

    const wpPosts: any[] = postsResponse.ok ? await postsResponse.json() : [];
    const wpFanzPosters: any[] = postersResponse.ok ? await postersResponse.json() : [];
    
    const allWpContent = [...wpPosts, ...wpFanzPosters];

    console.log("Raw response from WordPress API:", allWpContent);

    allWpContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return allWpContent.map(mapWpPostToAppData);
  } catch (error) {
    console.error("Failed to fetch or map posts from WordPress:", error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn(`[Fanz Adda] API request was blocked. This is likely a CORS or firewall issue.`);
    }
    return [];
  }
}

const mapPostToWpData = (postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>): any => {
    const body: { [key: string]: any } = {
        status: 'publish',
        content: postData.content,
        title: postData.eventDetails?.title 
              || postData.projectAnnouncementDetails?.title
              || postData.movieDetails?.title 
              || postData.celebrityDetails?.name 
              || `${postData.type} Post - ${new Date().toISOString().split('T')[0]}`
    };

    const meta: { [key: string]: any } = {};

    if (postData.type !== PostType.Image) {
        meta.fanz_adda_post_type = wpPostTypeMap[postData.type] || 'Announcement';
    }
    
    if (postData.imageUrl) meta.image_url = postData.imageUrl;
    if (postData.eventDetails?.title) meta.event_title = postData.eventDetails.title;
    if (postData.eventDetails?.subtitle) meta.event_subtitle = postData.eventDetails.subtitle;
    
    // CORRECT WAY: Serialize the entire reactions array into a single JSON string.
    if (postData.reactions) {
        meta.fanz_adda_reactions = JSON.stringify(postData.reactions);
    }
    
    // CORRECT WAY for repeatable fields: Send an array of stringified JSON objects.
    if (postData.fanzSays) {
        meta.fanz_say = postData.fanzSays.map(fs => JSON.stringify(fs));
    }


    if (postData.metaDescription) meta.meta_description = postData.metaDescription;
    const keywords = postData.seoKeywords || [];
    if (keywords.length > 0) meta.seo_keywords = keywords.join(', ');

    const movieIds = (postData.linkedMovieIds || []).map(id => parseInt(id.replace('movie-', ''), 10)).filter(id => !isNaN(id));
    if (movieIds.length > 0) meta.linked_movie_ids = movieIds;

    const celebIds = (postData.linkedCelebrityIds || []).map(id => parseInt(id.replace('celeb-', ''), 10)).filter(id => !isNaN(id));
    if (celebIds.length > 0) meta.linked_celebrity_ids = celebIds;
    
    if (postData.videoUrl) meta.video_url = postData.videoUrl;
    if (postData.videoDuration) meta.video_duration = String(postData.videoDuration);

    // Stringify all complex detail objects
    if (postData.projectAnnouncementDetails) meta.project_announcement_details = JSON.stringify(postData.projectAnnouncementDetails);
    if (postData.movieDetails) meta.movie_details = JSON.stringify(postData.movieDetails);
    if (postData.characterDetails) meta.character_details = JSON.stringify(postData.characterDetails);
    if (postData.countdownDetails) meta.countdown_details = JSON.stringify(postData.countdownDetails);
    if (postData.filmographyDetails) meta.filmography_details = JSON.stringify(postData.filmographyDetails);
    if (postData.awardDetails) meta.award_details = JSON.stringify(postData.awardDetails);
    if (postData.celebrityDetails) meta.celebrity_details = JSON.stringify(postData.celebrityDetails);
    if (postData.boxOfficeDetails) meta.box_office_details = JSON.stringify(postData.boxOfficeDetails);
    if (postData.triviaDetails) meta.trivia_details = JSON.stringify(postData.triviaDetails);

    body.meta = meta;

    return body;
};


export async function createWpPost(token: string, postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>): Promise<Post> {
    const body = mapPostToWpData(postData);
    const endpoint = postData.type === PostType.Image ? 'fanzposters' : 'posts';
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}?_embed`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post.');
    }
    const newWpPost = await response.json();
    return mapWpPostToAppData(newWpPost);
}

export async function updateWpPost(token: string, postId: string, postData: Post): Promise<Post> {
    const body = mapPostToWpData(postData);
    const endpoint = postData.type === PostType.Image ? 'fanzposters' : 'posts';

    const response = await fetch(`${API_BASE_URL}/${endpoint}/${postId}?_embed`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post.');
    }
    const updatedWpPost = await response.json();
    return mapWpPostToAppData(updatedWpPost);
}

// --- User Management Functions ---

export async function getUsers(token: string): Promise<AdminUser[]> {
  const response = await fetch(`${API_BASE_URL}/users?context=edit&per_page=100`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch users.');
  }
  const wpUsers = await response.json();
  return wpUsers.map((user: any) => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar_urls['96'],
    email: user.email,
    registeredDate: user.registered_date,
    roles: user.roles,
  }));
}

export async function createUser(token: string, userData: { username: string; email: string; password: string, roles: string[] }): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create user.');
  }

  return await response.json();
}

export async function updateUserRole(token: string, userId: number, role: string): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roles: [role] }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update user role.');
  }
  const updatedWpUser = await response.json();
    return {
    id: updatedWpUser.id,
    name: updatedWpUser.name,
    avatar: updatedWpUser.avatar_urls['96'],
    email: updatedWpUser.email,
    registeredDate: updatedWpUser.registered_date,
    roles: updatedWpUser.roles,
  };
}

export async function deleteUser(token: string, userId: number, reassignUserId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}?force=true&reassign=${reassignUserId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete user.');
  }
}