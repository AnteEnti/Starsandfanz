import React, { useState, useCallback, ChangeEvent, FormEvent, useEffect } from 'react';
import { Post, PostType, FilmographyItem } from '../../types';

interface CreateEditPostFormProps {
  onSave: (postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp' | 'reactions' | 'fanzSays'>) => void;
  onCancel: () => void;
  postToEdit: Post | null;
  allMovies: { id: string, title: string }[];
  allCelebrities: { id: string, name: string }[];
}

// Helper function to render form inputs
const FormInput: React.FC<{ label: string; name: string; value: string | number; onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; required?: boolean, as?: 'textarea' }> = 
({ label, name, value, onChange, type = 'text', required = false, as = 'input' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    {as === 'textarea' ? (
       <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={3}
        className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
    )}
  </div>
);

const LinksSelector: React.FC<{
  title: string;
  items: { id: string; name: string }[];
  selectedIds: string[];
  onChange: (id: string) => void;
}> = ({ title, items, selectedIds, onChange }) => {
  if (items.length === 0) return (
     <div>
      <h3 className="text-lg font-semibold text-purple-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 italic">No available {title.toLowerCase().includes('movie') ? 'movies' : 'celebrities'} to link. Create a "Movie Details" or "Celebrity" post first.</p>
    </div>
  );

  return (
    <div>
      <h3 className="text-lg font-semibold text-purple-300 mb-2">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 bg-slate-700/50 p-3 rounded-lg">
        {items.map(item => (
          <label key={item.id} className="flex items-center space-x-2 bg-slate-700 p-2 rounded-md cursor-pointer hover:bg-slate-600">
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => onChange(item.id)}
              className="form-checkbox h-4 w-4 text-purple-500 bg-slate-800 border-slate-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-slate-200 truncate" title={item.name}>{item.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};


const CreateEditPostForm: React.FC<CreateEditPostFormProps> = ({ onSave, onCancel, postToEdit, allMovies, allCelebrities }) => {
  const [postType, setPostType] = useState<PostType>(postToEdit?.type || PostType.Announcement);
  const [formData, setFormData] = useState<any>({ content: '', linkedMovieIds: [], linkedCelebrityIds: [] });
  
  const getInitialDataForType = useCallback((type: PostType, post: Post | null) => {
    if (post && post.type === type) {
        // Deep copy nested objects to avoid mutation issues
        const postData = JSON.parse(JSON.stringify(post));

        // Convert arrays back to comma-separated strings for form fields
        if (postData.movieDetails?.cast) postData.movieDetails.cast = postData.movieDetails.cast.join(', ');
        if (postData.movieDetails?.genres) postData.movieDetails.genres = postData.movieDetails.genres.join(', ');
        if (postData.characterDetails?.keyTraits) postData.characterDetails.keyTraits = postData.characterDetails.keyTraits.join(', ');
        if (postData.celebrityDetails?.notableWorks) postData.celebrityDetails.notableWorks = postData.celebrityDetails.notableWorks.join(', ');
        return postData;
    }
    
    let initialData: any = { content: '', linkedMovieIds: [], linkedCelebrityIds: [] };
    switch (type) {
        case PostType.Image:
        case PostType.Anniversary:
            initialData = { ...initialData, imageUrl: '', eventDetails: { title: '', subtitle: '' } };
            break;
        case PostType.ProjectAnnouncement:
            initialData = { ...initialData, eventDetails: { title: '' }, projectAnnouncementDetails: { title: '', posterUrl: '', status: 'In Production', expectedRelease: '', crew: '', logline: '' } };
            break;
        case PostType.Trailer:
            initialData = { ...initialData, videoUrl: '', videoDuration: 0 };
            break;
        case PostType.Birthday:
            initialData = { ...initialData, eventDetails: { title: '' } };
            break;
        case PostType.MovieDetails:
            initialData = { ...initialData, eventDetails: { title: '' }, movieDetails: { id: `movie-${Date.now()}`, title: '', posterUrl: '', rating: 0, director: '', cast: '', genres: '', synopsis: '' } };
            break;
        case PostType.CharacterIntroduction:
            initialData = { ...initialData, eventDetails: { title: '' }, characterDetails: { name: '', imageUrl: '', role: '', bio: '', keyTraits: '', firstAppearance: '' } };
            break;
        case PostType.Celebrity:
            initialData = { ...initialData, eventDetails: { title: '' }, celebrityDetails: { id: `celeb-${Date.now()}`, name: '', imageUrl: '', knownFor: '', bio: '', notableWorks: '', birthDate: '' } };
            break;
        case PostType.Countdown:
            initialData = { ...initialData, eventDetails: { title: '' }, countdownDetails: { title: '', targetDate: '', imageUrl: '', bookingUrl: '' } };
            break;
        case PostType.Filmography:
            initialData = { ...initialData, eventDetails: { title: '' }, filmographyDetails: [{ id: `film-${Date.now()}`, title: '', year: new Date().getFullYear(), posterUrl: '' }] };
            break;
        case PostType.Awards:
            initialData = { ...initialData, eventDetails: { title: '' }, awardDetails: { awardName: '', awardFor: '', event: '', year: new Date().getFullYear(), imageUrl: '' } };
            break;
        default: // Announcement
            break;
    }
    return initialData;
  }, []);

  useEffect(() => {
    const type = postToEdit?.type || PostType.Announcement;
    const initialData = getInitialDataForType(type, postToEdit);
    initialData.linkedMovieIds = postToEdit?.linkedMovieIds || [];
    initialData.linkedCelebrityIds = postToEdit?.linkedCelebrityIds || [];
    setPostType(type);
    setFormData(initialData);
  }, [postToEdit, getInitialDataForType]);

  const handleTypeChange = (type: PostType) => {
    setPostType(type);
    setFormData(getInitialDataForType(type, null)); // Reset form when type changes
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Check if the input is a number type for proper parsing
    const isNumberInput = (e.target as HTMLInputElement).type === 'number';
    const parsedValue = isNumberInput ? parseFloat(value) || 0 : value;

    const keys = name.split('.');
    
    if (keys.length > 1) {
        setFormData((prev: any) => {
            const newState = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid nested state issues
            let current = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                 if (!current[keys[i]]) current[keys[i]] = {};
                 current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = parsedValue;
            return newState;
        });
    } else {
        setFormData((prev: any) => ({ ...prev, [name]: parsedValue }));
    }
  };
  
  const handleFilmographyChange = (index: number, field: keyof Omit<FilmographyItem, 'id'>, value: string | number) => {
    const updatedFilmography = [...formData.filmographyDetails];
    updatedFilmography[index] = { ...updatedFilmography[index], [field]: value };
    setFormData({ ...formData, filmographyDetails: updatedFilmography });
  };
  
  const addFilmographyItem = () => {
    setFormData({
      ...formData,
      filmographyDetails: [
        ...formData.filmographyDetails,
        { id: `film-${Date.now()}`, title: '', year: new Date().getFullYear(), posterUrl: '' }
      ]
    });
  };

  const removeFilmographyItem = (index: number) => {
    const updatedFilmography = formData.filmographyDetails.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, filmographyDetails: updatedFilmography });
  };

  const handleLinkChange = (type: 'movie' | 'celebrity', id: string) => {
    setFormData((prev: any) => {
      const key = type === 'movie' ? 'linkedMovieIds' : 'linkedCelebrityIds';
      const currentIds = prev[key] || [];
      const newIds = currentIds.includes(id)
        ? currentIds.filter((i: string) => i !== id)
        : [...currentIds, id];
      return { ...prev, [key]: newIds };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const postData: any = { 
      type: postType, 
      content: formData.content,
      linkedMovieIds: formData.linkedMovieIds,
      linkedCelebrityIds: formData.linkedCelebrityIds,
    };

    // Copy details from form that don't need processing
    ['imageUrl', 'videoUrl', 'videoDuration', 'eventDetails', 'projectAnnouncementDetails', 'countdownDetails', 'awardDetails'].forEach(key => {
        if (formData[key]) postData[key] = formData[key];
    });

    // Clean up data for complex objects before submitting
    if (formData.movieDetails) {
        postData.movieDetails = {
            ...formData.movieDetails,
            cast: formData.movieDetails.cast.split(',').map((s: string) => s.trim()),
            genres: formData.movieDetails.genres.split(',').map((s: string) => s.trim()),
        };
    }
    if (formData.characterDetails) {
        postData.characterDetails = {
            ...formData.characterDetails,
            keyTraits: formData.characterDetails.keyTraits.split(',').map((s: string) => s.trim())
        };
    }
    if (formData.celebrityDetails) {
        postData.celebrityDetails = {
            ...formData.celebrityDetails,
            notableWorks: formData.celebrityDetails.notableWorks.split(',').map((s: string) => s.trim())
        };
    }
    if (formData.filmographyDetails) {
        postData.filmographyDetails = formData.filmographyDetails;
    }
    
    onSave(postData);
  };
  
  const renderFormFields = () => {
    switch (postType) {
      case PostType.Image:
      case PostType.Anniversary:
        return <>
          <FormInput label="Event Title" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} />
          {postType === PostType.Anniversary && <FormInput label="Event Subtitle" name="eventDetails.subtitle" value={formData.eventDetails?.subtitle || ''} onChange={handleInputChange} />}
          <FormInput label="Image URL" name="imageUrl" value={formData.imageUrl || ''} onChange={handleInputChange} required />
        </>;
      case PostType.ProjectAnnouncement:
        const pa = formData.projectAnnouncementDetails || {};
        return <>
            <FormInput label="Event Title" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required/>
            <FormInput label="Project Title" name="projectAnnouncementDetails.title" value={pa.title || ''} onChange={handleInputChange} required/>
            <FormInput label="Poster URL" name="projectAnnouncementDetails.posterUrl" value={pa.posterUrl || ''} onChange={handleInputChange} required/>
            <FormInput label="Status" name="projectAnnouncementDetails.status" value={pa.status || ''} onChange={handleInputChange} required/>
            <FormInput label="Expected Release" name="projectAnnouncementDetails.expectedRelease" value={pa.expectedRelease || ''} onChange={handleInputChange} required/>
            <FormInput label="Crew" name="projectAnnouncementDetails.crew" value={pa.crew || ''} onChange={handleInputChange} />
            <FormInput label="Logline" name="projectAnnouncementDetails.logline" as="textarea" value={pa.logline || ''} onChange={handleInputChange} />
        </>;
      case PostType.Trailer:
        return <>
            <FormInput label="Video URL (Embed)" name="videoUrl" value={formData.videoUrl || ''} onChange={handleInputChange} required />
            <FormInput label="Video Duration (seconds)" name="videoDuration" type="number" value={formData.videoDuration || 0} onChange={handleInputChange} required />
        </>;
      case PostType.Birthday:
         return <FormInput label="Event Title (e.g., Happy Birthday...)" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />;
      case PostType.MovieDetails:
        const md = formData.movieDetails || {};
        return <>
            <FormInput label="Event Title (e.g., Movie Deep Dive)" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />
            <FormInput label="Movie Title" name="movieDetails.title" value={md.title || ''} onChange={handleInputChange} required />
            <FormInput label="Poster URL" name="movieDetails.posterUrl" value={md.posterUrl || ''} onChange={handleInputChange} required />
            <FormInput label="Rating" name="movieDetails.rating" type="number" value={md.rating || 0} onChange={handleInputChange} required />
            <FormInput label="Director" name="movieDetails.director" value={md.director || ''} onChange={handleInputChange} required />
            <FormInput label="Cast (comma-separated)" name="movieDetails.cast" value={md.cast || ''} onChange={handleInputChange} />
            <FormInput label="Genres (comma-separated)" name="movieDetails.genres" value={md.genres || ''} onChange={handleInputChange} />
            <FormInput label="Synopsis" name="movieDetails.synopsis" as="textarea" value={md.synopsis || ''} onChange={handleInputChange} />
        </>;
      case PostType.CharacterIntroduction:
         const cd = formData.characterDetails || {};
         return <>
             <FormInput label="Event Title (e.g., Character Spotlight)" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />
             <FormInput label="Character Name" name="characterDetails.name" value={cd.name || ''} onChange={handleInputChange} required />
             <FormInput label="Image URL" name="characterDetails.imageUrl" value={cd.imageUrl || ''} onChange={handleInputChange} required />
             <FormInput label="Role" name="characterDetails.role" value={cd.role || ''} onChange={handleInputChange} />
             <FormInput label="Bio" name="characterDetails.bio" as="textarea" value={cd.bio || ''} onChange={handleInputChange} />
             <FormInput label="Key Traits (comma-separated)" name="characterDetails.keyTraits" value={cd.keyTraits || ''} onChange={handleInputChange} />
             <FormInput label="First Appearance" name="characterDetails.firstAppearance" value={cd.firstAppearance || ''} onChange={handleInputChange} />
         </>;
      case PostType.Celebrity:
        const celeb = formData.celebrityDetails || {};
        return <>
            <FormInput label="Event Title (e.g., Celebrity Spotlight)" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />
            <FormInput label="Celebrity Name" name="celebrityDetails.name" value={celeb.name || ''} onChange={handleInputChange} required />
            <FormInput label="Image URL" name="celebrityDetails.imageUrl" value={celeb.imageUrl || ''} onChange={handleInputChange} required />
            <FormInput label="Known For (e.g., Actor, Producer)" name="celebrityDetails.knownFor" value={celeb.knownFor || ''} onChange={handleInputChange} />
            <FormInput label="Bio" name="celebrityDetails.bio" as="textarea" value={celeb.bio || ''} onChange={handleInputChange} />
            <FormInput label="Notable Works (comma-separated)" name="celebrityDetails.notableWorks" value={celeb.notableWorks || ''} onChange={handleInputChange} />
            <FormInput label="Birth Date" name="celebrityDetails.birthDate" type="date" value={celeb.birthDate || ''} onChange={handleInputChange} />
        </>;
      case PostType.Countdown:
        const ctd = formData.countdownDetails || {};
        const targetDate = ctd.targetDate ? ctd.targetDate.substring(0, 16) : '';
        return <>
            <FormInput label="Event Title (e.g., Premiere)" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />
            <FormInput label="Countdown Title" name="countdownDetails.title" value={ctd.title || ''} onChange={handleInputChange} required />
            <FormInput label="Target Date" name="countdownDetails.targetDate" type="datetime-local" value={targetDate} onChange={handleInputChange} required />
            <FormInput label="Image URL" name="countdownDetails.imageUrl" value={ctd.imageUrl || ''} onChange={handleInputChange} required />
            <FormInput label="Booking URL" name="countdownDetails.bookingUrl" value={ctd.bookingUrl || ''} onChange={handleInputChange} />
        </>;
      case PostType.Filmography:
        return <>
            <FormInput label="Event Title (e.g., A Look Back)" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Movies</h3>
            {formData.filmographyDetails?.map((item: FilmographyItem, index: number) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end bg-slate-700/50 p-3 rounded-lg mb-3">
                    <FormInput label="Title" name={`filmographyDetails.${index}.title`} value={item.title} onChange={(e) => handleFilmographyChange(index, 'title', e.target.value)} />
                    <FormInput label="Year" name={`filmographyDetails.${index}.year`} type="number" value={item.year} onChange={(e) => handleFilmographyChange(index, 'year', parseInt(e.target.value, 10))} />
                    <FormInput label="Poster URL" name={`filmographyDetails.${index}.posterUrl`} value={item.posterUrl} onChange={(e) => handleFilmographyChange(index, 'posterUrl', e.target.value)} />
                    <button type="button" onClick={() => removeFilmographyItem(index)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md h-10">Remove</button>
                </div>
            ))}
            <button type="button" onClick={addFilmographyItem} className="mt-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md">Add Movie</button>
        </>;
      case PostType.Awards:
        const ad = formData.awardDetails || {};
        return <>
            <FormInput label="Event Title" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />
            <FormInput label="Award Name" name="awardDetails.awardName" value={ad.awardName || ''} onChange={handleInputChange} required />
            <FormInput label="Award For" name="awardDetails.awardFor" value={ad.awardFor || ''} onChange={handleInputChange} required />
            <FormInput label="Event (e.g., Golden Globes)" name="awardDetails.event" value={ad.event || ''} onChange={handleInputChange} required />
            <FormInput label="Year" name="awardDetails.year" type="number" value={ad.year || new Date().getFullYear()} onChange={handleInputChange} required />
            <FormInput label="Image URL (Optional)" name="awardDetails.imageUrl" value={ad.imageUrl || ''} onChange={handleInputChange} />
        </>;
      default: // Announcement
        return null;
    }
  };

  const renderLinksSection = () => {
    const canLinkMovies = [PostType.ProjectAnnouncement, PostType.Trailer, PostType.CharacterIntroduction, PostType.Countdown, PostType.Announcement, PostType.Awards, PostType.Anniversary].includes(postType);
    const canLinkCelebrities = [PostType.CharacterIntroduction, PostType.Announcement, PostType.Awards, PostType.Filmography, PostType.Birthday].includes(postType);
    
    if (!canLinkMovies && !canLinkCelebrities) return null;

    return (
        <div className="space-y-4 pt-4 border-t border-slate-700">
            <h2 className="text-xl font-bold text-white">Post Links</h2>
            {canLinkMovies && (
                <LinksSelector
                    title="Link to Movie(s)"
                    items={allMovies.map(m => ({ id: m.id, name: m.title }))}
                    selectedIds={formData.linkedMovieIds || []}
                    onChange={(id) => handleLinkChange('movie', id)}
                />
            )}
            {canLinkCelebrities && (
                <LinksSelector
                    title="Link to Celebrity(s)"
                    items={allCelebrities.map(c => ({ id: c.id, name: c.name }))}
                    selectedIds={formData.linkedCelebrityIds || []}
                    onChange={(id) => handleLinkChange('celebrity', id)}
                />
            )}
        </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">{postToEdit && postToEdit.id ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="postType" className="block text-sm font-medium text-slate-300 mb-1">Post Type</label>
          <select
            id="postType"
            value={postType}
            onChange={(e) => handleTypeChange(e.target.value as PostType)}
            className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {Object.values(PostType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <FormInput label="Main Content / Description" name="content" as="textarea" value={formData.content || ''} onChange={handleInputChange} required />
        
        <div className="space-y-4 pt-4 border-t border-slate-700">
            {renderFormFields()}
        </div>

        {renderLinksSection()}

        <div className="flex justify-end items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-full transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
          >
            {postToEdit && postToEdit.id ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPostForm;