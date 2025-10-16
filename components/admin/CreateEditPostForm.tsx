import React, { useState, useCallback, ChangeEvent, FormEvent, useEffect } from 'react';
import { Post, PostType, FilmographyItem, FanzSay, Reaction } from '../../types';
import SearchableLinkSelector from './SearchableLinkSelector';

interface CreateEditPostFormProps {
  onSave: (postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>) => void;
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


const CreateEditPostForm: React.FC<CreateEditPostFormProps> = ({ onSave, onCancel, postToEdit, allMovies, allCelebrities }) => {
  const [postType, setPostType] = useState<PostType>(postToEdit?.type || PostType.Announcement);
  const [formData, setFormData] = useState<any>({ content: '', linkedMovieIds: [], linkedCelebrityIds: [] });
  
  const getInitialDataForType = useCallback((type: PostType, post: Post | null) => {
      let initialData: any = { 
        content: '', 
        linkedMovieIds: [], 
        linkedCelebrityIds: [], 
        fanzSaysEnabled: true,
        reactionsEnabled: true,
        reactions: [
            { id: 'love', emoji: '❤️', count: 0 },
            { id: 'whistle', emoji: '🥳', count: 0 },
            { id: 'celebrate', emoji: '🎉', count: 0 },
        ],
        fanzSays: [
            { id: `sc-new-${Date.now()}-1`, text: 'This is great!', fans: [] },
            { id: `sc-new-${Date.now()}-2`, text: 'Awesome!', fans: [] },
        ]
      };

    if (post) {
        // Deep copy nested objects to avoid mutation issues
        const postData = JSON.parse(JSON.stringify(post));
        
        // Use post data if it exists
        initialData = {
          ...initialData,
          ...postData,
          fanzSaysEnabled: post.fanzSaysEnabled !== false,
          reactionsEnabled: post.reactionsEnabled !== false,
          reactions: post.reactions && post.reactions.length > 0 ? post.reactions : initialData.reactions,
          fanzSays: post.fanzSays && post.fanzSays.length > 0 ? post.fanzSays : initialData.fanzSays,
        };

        // Convert arrays back to comma-separated strings for form fields
        if (postData.movieDetails?.cast) initialData.movieDetails.cast = postData.movieDetails.cast.join(', ');
        if (postData.movieDetails?.genres) initialData.movieDetails.genres = postData.movieDetails.genres.join(', ');
        if (postData.characterDetails?.keyTraits) initialData.characterDetails.keyTraits = postData.characterDetails.keyTraits.join(', ');
        if (postData.celebrityDetails?.notableWorks) initialData.celebrityDetails.notableWorks = postData.celebrityDetails.notableWorks.join(', ');
        if (postData.triviaDetails?.triviaItems) initialData.triviaDetails.triviaItems = postData.triviaDetails.triviaItems.join('\n');
        
        return initialData;
    }
    
    // Set default structures for new posts of a specific type
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
        case PostType.BoxOffice:
            initialData = { ...initialData, eventDetails: { title: '' }, boxOfficeDetails: { title: '', grossRevenue: 0, ranking: 1, region: 'Domestic', sourceUrl: '' } };
            break;
        case PostType.Trivia:
            initialData = { ...initialData, eventDetails: { title: '' }, triviaDetails: { title: '', triviaItems: '' } };
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
    
    // Check for checkbox type
    const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox';
    const checkedValue = (e.target as HTMLInputElement).checked;

    const parsedValue = isCheckbox ? checkedValue : (type === 'number' ? parseFloat(value) || 0 : value);

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
  
  const handleFanzSayTextChange = (index: number, newText: string) => {
    const updatedFanzSays = [...(formData.fanzSays || [])];
    updatedFanzSays[index] = { ...updatedFanzSays[index], text: newText };
    setFormData({ ...formData, fanzSays: updatedFanzSays });
  };

  const addFanzSayItem = () => {
    const newFanzSay: FanzSay = { id: `sc-new-${Date.now()}`, text: '', fans: [] };
    setFormData({ ...formData, fanzSays: [...(formData.fanzSays || []), newFanzSay] });
  };

  const removeFanzSayItem = (indexToRemove: number) => {
    setFormData({
      ...formData,
      fanzSays: (formData.fanzSays || []).filter((_: any, index: number) => index !== indexToRemove),
    });
  };
  
  const handleReactionChange = (index: number, field: keyof Omit<Reaction, 'id'>, value: string | number) => {
    const updatedReactions = [...(formData.reactions || [])];
    updatedReactions[index] = { ...updatedReactions[index], [field]: value };
    setFormData({ ...formData, reactions: updatedReactions });
  };

  const addReactionItem = () => {
    const newReaction: Reaction = { id: `reaction-${Date.now()}`, emoji: '', count: 0 };
    setFormData({ ...formData, reactions: [...(formData.reactions || []), newReaction] });
  };

  const removeReactionItem = (indexToRemove: number) => {
    setFormData({
      ...formData,
      reactions: (formData.reactions || []).filter((_: any, index: number) => index !== indexToRemove),
    });
  };


  const handleLinksChange = (type: 'movie' | 'celebrity', newIds: string[]) => {
    const key = type === 'movie' ? 'linkedMovieIds' : 'linkedCelebrityIds';
    setFormData((prev: any) => ({ ...prev, [key]: newIds }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const postData: any = { 
      type: postType, 
      content: formData.content,
      linkedMovieIds: formData.linkedMovieIds,
      linkedCelebrityIds: formData.linkedCelebrityIds,
      fanzSaysEnabled: formData.fanzSaysEnabled,
      fanzSays: formData.fanzSays,
      reactionsEnabled: formData.reactionsEnabled,
      reactions: formData.reactions,
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
     if (formData.boxOfficeDetails) {
        postData.boxOfficeDetails = formData.boxOfficeDetails;
    }
    if (formData.triviaDetails) {
        postData.triviaDetails = {
            ...formData.triviaDetails,
            triviaItems: formData.triviaDetails.triviaItems.split('\n').filter((s: string) => s.trim() !== '')
        };
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
      case PostType.BoxOffice:
        const bo = formData.boxOfficeDetails || {};
        return <>
            <FormInput label="Event Title (e.g., Weekend Box Office)" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />
            <FormInput label="Gross Revenue ($)" name="boxOfficeDetails.grossRevenue" type="number" value={bo.grossRevenue || 0} onChange={handleInputChange} required />
            <FormInput label="Ranking (#)" name="boxOfficeDetails.ranking" type="number" value={bo.ranking || 1} onChange={handleInputChange} required />
            <FormInput label="Region (e.g., Domestic, Worldwide)" name="boxOfficeDetails.region" value={bo.region || ''} onChange={handleInputChange} required />
            <FormInput label="Source URL (Optional)" name="boxOfficeDetails.sourceUrl" value={bo.sourceUrl || ''} onChange={handleInputChange} />
        </>;
      case PostType.Trivia:
        const tr = formData.triviaDetails || {};
        return <>
            <FormInput label="Event Title (e.g., Did You Know?)" name="eventDetails.title" value={formData.eventDetails?.title || ''} onChange={handleInputChange} required />
            <FormInput label="Trivia Items (one per line)" name="triviaDetails.triviaItems" as="textarea" value={tr.triviaItems || ''} onChange={handleInputChange} required />
        </>;
      default: // Announcement
        return null;
    }
  };

  const renderLinksSection = () => {
    const canLinkMovies = [PostType.ProjectAnnouncement, PostType.Trailer, PostType.CharacterIntroduction, PostType.Countdown, PostType.Announcement, PostType.Awards, PostType.Anniversary, PostType.BoxOffice].includes(postType);
    const canLinkCelebrities = [PostType.CharacterIntroduction, PostType.Announcement, PostType.Awards, PostType.Filmography, PostType.Birthday, PostType.Trivia].includes(postType);
    
    if (!canLinkMovies && !canLinkCelebrities) return null;

    return (
        <div className="space-y-6 pt-4 border-t border-slate-700">
            <h2 className="text-xl font-bold text-white">Post Links</h2>
            {canLinkMovies && (
                <SearchableLinkSelector
                    title="Link to Movie(s)"
                    items={allMovies.map(m => ({ id: m.id, name: m.title }))}
                    selectedIds={formData.linkedMovieIds || []}
                    onSelectionChange={(newIds) => handleLinksChange('movie', newIds)}
                />
            )}
            {canLinkCelebrities && (
                 <SearchableLinkSelector
                    title="Link to Celebrity(s)"
                    items={allCelebrities.map(c => ({ id: c.id, name: c.name }))}
                    selectedIds={formData.linkedCelebrityIds || []}
                    onSelectionChange={(newIds) => handleLinksChange('celebrity', newIds)}
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

        <fieldset className="space-y-4 pt-4 border-t border-slate-700">
          <legend className="text-xl font-bold text-white w-full pb-2">Engagement Settings</legend>
          
           <div className="flex items-center bg-slate-700/50 p-3 rounded-lg hover:bg-slate-700">
              <input
                  type="checkbox"
                  id="reactionsEnabled"
                  name="reactionsEnabled"
                  checked={formData.reactionsEnabled || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-slate-500 bg-slate-800 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="reactionsEnabled" className="ml-3 text-sm font-medium text-slate-200">
                  Enable Reactions Section
              </label>
          </div>

          {formData.reactionsEnabled && (
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Reactions</h3>
              <div className="space-y-2">
                {(formData.reactions || []).map((reaction: Reaction, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={reaction.emoji}
                      onChange={(e) => handleReactionChange(index, 'emoji', e.target.value)}
                      placeholder="Emoji"
                      className="w-16 bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center"
                    />
                    <input
                      type="number"
                      value={reaction.count}
                      onChange={(e) => handleReactionChange(index, 'count', parseInt(e.target.value, 10) || 0)}
                      placeholder="Count"
                      className="flex-1 bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeReactionItem(index)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-md"
                      aria-label="Remove reaction"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addReactionItem}
                className="mt-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-3 rounded-md text-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Add Reaction
              </button>
            </div>
          )}

          <div className="flex items-center bg-slate-700/50 p-3 rounded-lg hover:bg-slate-700">
              <input
                  type="checkbox"
                  id="fanzSaysEnabled"
                  name="fanzSaysEnabled"
                  checked={formData.fanzSaysEnabled || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-slate-500 bg-slate-800 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="fanzSaysEnabled" className="ml-3 text-sm font-medium text-slate-200">
                  Enable Fanz Say (Comments) Section
              </label>
          </div>

          {formData.fanzSaysEnabled && (
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Fanz Say Prompts</h3>
              <div className="space-y-2">
                {(formData.fanzSays || []).map((say: FanzSay, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={say.text}
                      onChange={(e) => handleFanzSayTextChange(index, e.target.value)}
                      placeholder="Enter a prompt, e.g. 'So excited!'"
                      className="flex-1 bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeFanzSayItem(index)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-md"
                      aria-label="Remove prompt"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addFanzSayItem}
                className="mt-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-3 rounded-md text-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Add Prompt
              </button>
            </div>
          )}
        </fieldset>

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