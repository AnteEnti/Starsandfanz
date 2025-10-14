import React, { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { Post, PostType, FilmographyItem } from '../types';

interface AdminPageProps {
  onAddPost: (postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp' | 'reactions' | 'fanzSays'>) => void;
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


const AdminPage: React.FC<AdminPageProps> = ({ onAddPost }) => {
  const [postType, setPostType] = useState<PostType>(PostType.Announcement);
  const [formData, setFormData] = useState<any>({ content: '' });

  const resetFormForType = useCallback((type: PostType) => {
    setPostType(type);
    let initialData: any = { content: '' };
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
            initialData = { ...initialData, eventDetails: { title: '' }, movieDetails: { title: '', posterUrl: '', rating: 0, director: '', cast: '', genres: '', synopsis: '' } };
            break;
        case PostType.CharacterIntroduction:
            initialData = { ...initialData, eventDetails: { title: '' }, characterDetails: { name: '', imageUrl: '', role: '', bio: '', keyTraits: '', firstAppearance: '' } };
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
    setFormData(initialData);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    if (keys.length > 1) {
        setFormData((prev: any) => {
            const newState = { ...prev };
            let current = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newState;
        });
    } else {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
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


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const postData: any = { type: postType, content: formData.content };

    // Clean up data before submitting
    if (formData.movieDetails) {
        postData.movieDetails = {
            ...formData.movieDetails,
            cast: formData.movieDetails.cast.split(',').map((s: string) => s.trim()),
            genres: formData.movieDetails.genres.split(',').map((s: string) => s.trim()),
            rating: parseFloat(formData.movieDetails.rating)
        };
    }
     if (formData.characterDetails) {
        postData.characterDetails = {
            ...formData.characterDetails,
            keyTraits: formData.characterDetails.keyTraits.split(',').map((s: string) => s.trim())
        };
    }
    if (formData.filmographyDetails) postData.filmographyDetails = formData.filmographyDetails.map((f:any) => ({...f, year: parseInt(f.year, 10)}));
    if (formData.awardDetails) postData.awardDetails = {...formData.awardDetails, year: parseInt(formData.awardDetails.year, 10)};
    if (formData.trailerDetails) postData.trailerDetails = {...formData.trailerDetails, videoDuration: parseInt(formData.trailerDetails.videoDuration, 10)};

    // Copy details from form
    ['imageUrl', 'videoUrl', 'videoDuration', 'eventDetails', 'projectAnnouncementDetails', 'countdownDetails', 'awardDetails'].forEach(key => {
        if (formData[key]) postData[key] = formData[key];
    });
    
    onAddPost(postData);
    resetFormForType(PostType.Announcement); // Reset form after submission
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
            <FormInput label="Project Title" name="projectAnnouncementDetails.title" value={pa.title} onChange={handleInputChange} required/>
            <FormInput label="Poster URL" name="projectAnnouncementDetails.posterUrl" value={pa.posterUrl} onChange={handleInputChange} required/>
            <FormInput label="Status" name="projectAnnouncementDetails.status" value={pa.status} onChange={handleInputChange} required/>
            <FormInput label="Expected Release" name="projectAnnouncementDetails.expectedRelease" value={pa.expectedRelease} onChange={handleInputChange} required/>
            <FormInput label="Crew" name="projectAnnouncementDetails.crew" value={pa.crew} onChange={handleInputChange} />
            <FormInput label="Logline" name="projectAnnouncementDetails.logline" as="textarea" value={pa.logline} onChange={handleInputChange} />
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
            <FormInput label="Movie Title" name="movieDetails.title" value={md.title} onChange={handleInputChange} required />
            <FormInput label="Poster URL" name="movieDetails.posterUrl" value={md.posterUrl} onChange={handleInputChange} required />
            <FormInput label="Rating" name="movieDetails.rating" type="number" value={md.rating} onChange={handleInputChange} required />
            <FormInput label="Director" name="movieDetails.director" value={md.director} onChange={handleInputChange} required />
            <FormInput label="Cast (comma-separated)" name="movieDetails.cast" value={md.cast} onChange={handleInputChange} />
            <FormInput label="Genres (comma-separated)" name="movieDetails.genres" value={md.genres} onChange={handleInputChange} />
            <FormInput label="Synopsis" name="movieDetails.synopsis" as="textarea" value={md.synopsis} onChange={handleInputChange} />
        </>;
      case PostType.CharacterIntroduction:
         const cd = formData.characterDetails || {};
         return <>
             <FormInput label="Event Title (e.g., Character Spotlight)" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />
             <FormInput label="Character Name" name="characterDetails.name" value={cd.name} onChange={handleInputChange} required />
             <FormInput label="Image URL" name="characterDetails.imageUrl" value={cd.imageUrl} onChange={handleInputChange} required />
             <FormInput label="Role" name="characterDetails.role" value={cd.role} onChange={handleInputChange} />
             <FormInput label="Bio" name="characterDetails.bio" as="textarea" value={cd.bio} onChange={handleInputChange} />
             <FormInput label="Key Traits (comma-separated)" name="characterDetails.keyTraits" value={cd.keyTraits} onChange={handleInputChange} />
             <FormInput label="First Appearance" name="characterDetails.firstAppearance" value={cd.firstAppearance} onChange={handleInputChange} />
         </>;
      case PostType.Countdown:
        const ctd = formData.countdownDetails || {};
        return <>
            <FormInput label="Event Title (e.g., Premiere)" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />
            <FormInput label="Countdown Title" name="countdownDetails.title" value={ctd.title} onChange={handleInputChange} required />
            <FormInput label="Target Date" name="countdownDetails.targetDate" type="datetime-local" value={ctd.targetDate} onChange={handleInputChange} required />
            <FormInput label="Image URL" name="countdownDetails.imageUrl" value={ctd.imageUrl} onChange={handleInputChange} required />
            <FormInput label="Booking URL" name="countdownDetails.bookingUrl" value={ctd.bookingUrl} onChange={handleInputChange} />
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
            <FormInput label="Award Name" name="awardDetails.awardName" value={ad.awardName} onChange={handleInputChange} required />
            <FormInput label="Award For" name="awardDetails.awardFor" value={ad.awardFor} onChange={handleInputChange} required />
            <FormInput label="Event (e.g., Golden Globes)" name="awardDetails.event" value={ad.event} onChange={handleInputChange} required />
            <FormInput label="Year" name="awardDetails.year" type="number" value={ad.year} onChange={handleInputChange} required />
            <FormInput label="Image URL (Optional)" name="awardDetails.imageUrl" value={ad.imageUrl} onChange={handleInputChange} />
        </>;
      default: // Announcement
        return null;
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="postType" className="block text-sm font-medium text-slate-300 mb-1">Post Type</label>
          <select
            id="postType"
            value={postType}
            onChange={(e) => resetFormForType(e.target.value as PostType)}
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

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;