import React, { useState, useMemo, useEffect } from 'react';
import { Post, PostType } from '../../types';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { getApiService } from '../../utils/apiConfig';

interface AIPostGeneratorProps {
  allMovies: { id: string; title: string }[];
  allCelebrities: { id: string; name: string }[];
  onCreatePost: (template: Partial<Post>) => void;
}

type Step = 'select_type' | 'select_topic' | 'generating' | 'draft_ready' | 'error';
type TopicType = 'movie' | 'celebrity' | 'any';
const AI_WRITING_STYLES_KEY = 'ai_writing_styles';


interface PostTypeConfig {
  topicType: TopicType;
  icon: string;
  description: string;
  newsPrompt: (topic: string) => string;
  draftSchema: any;
  draftPrompt: (topic: string) => string;
}

const POST_TYPE_CONFIG: { [key in PostType]?: PostTypeConfig } = {
  [PostType.Birthday]: {
    topicType: 'celebrity',
    icon: 'cake',
    description: 'Generate a celebratory birthday message for a star.',
    newsPrompt: (topic) => `Find recent positive news, achievements, or milestones for "${topic}" that can be mentioned in a celebratory birthday post.`,
    draftSchema: {
      type: Type.OBJECT, properties: {
        content: { type: Type.STRING },
        imageSearchQuery: { type: Type.STRING, description: "A simple, descriptive search query for a relevant, royalty-free image (e.g., 'happy birthday celebration cake')." },
        eventDetails: { type: Type.OBJECT, properties: { title: { type: Type.STRING } }, required: ['title'] },
      }, required: ['content', 'eventDetails', 'imageSearchQuery']
    },
    draftPrompt: (topic) => `- The 'content' should be a warm and exciting birthday message for ${topic}. Mention one of their recent achievements from the summary if available. - The 'eventDetails.title' must be a birthday greeting, like "Happy Birthday, ${topic}!". - Generate a descriptive search query for a relevant, royalty-free image in the 'imageSearchQuery' field. The query should be simple, like 'celebratory birthday cake'.`
  },
  [PostType.Trivia]: {
    topicType: 'celebrity',
    icon: 'lightbulb',
    description: 'Create a "Did You Know?" post with fun facts.',
    newsPrompt: (topic) => `Find interesting, lesser-known facts, or behind-the-scenes stories about "${topic}" or their recent projects. Focus on positive and surprising information.`,
    draftSchema: {
      type: Type.OBJECT, properties: {
        content: { type: Type.STRING },
        imageSearchQuery: { type: Type.STRING, description: "A simple, descriptive search query for a relevant, royalty-free image related to the celebrity." },
        eventDetails: { type: Type.OBJECT, properties: { title: { type: Type.STRING } }, required: ['title'] },
        triviaDetails: { type: Type.OBJECT, properties: { triviaItems: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['triviaItems'] }
      }, required: ['content', 'eventDetails', 'triviaDetails', 'imageSearchQuery']
    },
    draftPrompt: (topic) => `- The 'content' should be an engaging intro to a trivia post about ${topic}. - The 'eventDetails.title' should be "Did You Know?". - The 'triviaDetails.triviaItems' array must contain 3-4 interesting facts from the summary, written as complete sentences. - Generate a descriptive search query for a relevant, royalty-free image in the 'imageSearchQuery' field.`
  },
  [PostType.ProjectAnnouncement]: {
    topicType: 'any',
    icon: 'movie_creation',
    description: 'Announce a new movie or TV series project.',
    newsPrompt: (topic) => `Find official announcements or latest news about the new project "${topic}", including its status, genre, director, cast, and a short logline or synopsis.`,
    draftSchema: {
       type: Type.OBJECT, properties: {
            content: { type: Type.STRING },
            eventDetails: { type: Type.OBJECT, properties: { title: { type: Type.STRING } }, required: ['title'] },
            projectAnnouncementDetails: {
                type: Type.OBJECT, properties: {
                    title: { type: Type.STRING }, status: { type: Type.STRING }, expectedRelease: { type: Type.STRING }, crew: { type: Type.STRING }, logline: { type: Type.STRING }, imageSearchQuery: { type: Type.STRING, description: "A simple, descriptive search query for a relevant, royalty-free image for the movie poster (e.g., 'epic fantasy movie poster')." }
                }, required: ['title', 'status', 'expectedRelease', 'logline', 'imageSearchQuery']
            }
        }, required: ['content', 'eventDetails', 'projectAnnouncementDetails']
    },
    draftPrompt: (topic) => `- The 'content' should be an exciting announcement for the project. - The 'eventDetails.title' should be "New Project Announcement". - Fill in all fields for 'projectAnnouncementDetails' based on the summary. The title must be "${topic}". Status can be 'Announced', 'In Production', etc. The 'imageSearchQuery' should be a simple but descriptive search query for a conceptual movie poster.`
  },
  [PostType.Awards]: {
    topicType: 'any',
    icon: 'emoji_events',
    description: 'Celebrate an award win for a star or movie.',
    newsPrompt: (topic) => `Find recent news about awards won by "${topic}". Include the award name, the event (e.g., Oscars), the year, and for which project they won.`,
    draftSchema: {
      type: Type.OBJECT, properties: {
        content: { type: Type.STRING },
        imageSearchQuery: { type: Type.STRING, description: "A simple, descriptive search query for a relevant, royalty-free image (e.g., 'golden award trophy on stage')." },
        eventDetails: { type: Type.OBJECT, properties: { title: { type: Type.STRING } }, required: ['title'] },
        awardDetails: { type: Type.OBJECT, properties: {
            awardName: { type: Type.STRING }, awardFor: { type: Type.STRING }, event: { type: Type.STRING }, year: { type: Type.INTEGER },
          }, required: ['awardName', 'awardFor', 'event', 'year']
        }
      }, required: ['content', 'eventDetails', 'awardDetails', 'imageSearchQuery']
    },
    draftPrompt: (topic) => `- The 'content' must be a congratulatory message for the award win for ${topic}. - 'eventDetails.title' should be "And the Award Goes To...". - Fill in 'awardDetails' accurately. 'awardFor' is the project name or category. 'year' should be the current year if not specified. - Generate a descriptive search query for a relevant, royalty-free image in the 'imageSearchQuery' field.`
  },
   [PostType.Announcement]: {
    topicType: 'any',
    icon: 'campaign',
    description: 'Create a general announcement on any topic.',
    newsPrompt: (topic) => `Find the latest positive news or announcements about "${topic}". Summarize the key points.`,
    draftSchema: {
      type: Type.OBJECT, properties: {
        content: { type: Type.STRING },
        imageSearchQuery: { type: Type.STRING, description: "A simple, descriptive search query for a relevant, royalty-free image related to the topic." },
        eventDetails: { type: Type.OBJECT, properties: { title: { type: Type.STRING } }, required: ['title'] },
      }, required: ['content', 'eventDetails', 'imageSearchQuery']
    },
    draftPrompt: (topic) => `- Based on the summary, write an engaging and celebratory 'content' field. - Create a suitable 'eventDetails.title' for the announcement. - Generate a descriptive search query for a relevant, royalty-free image in the 'imageSearchQuery' field.`
  },
  [PostType.MovieDetails]: {
    topicType: 'movie',
    icon: 'theaters',
    description: 'Generate a deep-dive post for a movie.',
    newsPrompt: (topic) => `Find comprehensive details for the movie "${topic}", including its official synopsis, director, main cast (up to 5 key actors), genres, and any available public rating (like IMDb or Rotten Tomatoes score).`,
    draftSchema: {
        type: Type.OBJECT, properties: {
            content: { type: Type.STRING },
            eventDetails: { type: Type.OBJECT, properties: { title: { type: Type.STRING } }, required: ['title'] },
            movieDetails: {
                type: Type.OBJECT, properties: {
                    title: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                    director: { type: Type.STRING },
                    cast: { type: Type.ARRAY, items: { type: Type.STRING } },
                    genres: { type: Type.ARRAY, items: { type: Type.STRING } },
                    synopsis: { type: Type.STRING },
                    imageSearchQuery: { type: Type.STRING, description: "A simple, descriptive search query for a relevant, royalty-free image for the movie poster." }
                }, required: ['title', 'director', 'cast', 'genres', 'synopsis', 'imageSearchQuery']
            }
        }, required: ['content', 'eventDetails', 'movieDetails']
    },
    draftPrompt: (topic) => `- The 'content' should be an exciting deep-dive intro for the movie "${topic}".
- The 'eventDetails.title' must be "Movie Deep Dive".
- Fill all 'movieDetails' fields based on the summary. The 'title' must be exactly "${topic}". 'cast' and 'genres' must be arrays of strings. 'rating' should be a number (e.g., 8.7), use 0 if not found. The 'imageSearchQuery' should be a simple but descriptive search query for a conceptual movie poster.`
  },
  [PostType.Celebrity]: {
    topicType: 'celebrity',
    icon: 'person',
    description: 'Create a spotlight post for a celebrity.',
    newsPrompt: (topic) => `Find biographical information for the celebrity "${topic}", including what they are known for (e.g., Actor, Director), a short bio, their most notable works/movies, and their birth date.`,
    draftSchema: {
        type: Type.OBJECT, properties: {
            content: { type: Type.STRING },
            eventDetails: { type: Type.OBJECT, properties: { title: { type: Type.STRING } }, required: ['title'] },
            celebrityDetails: {
                type: Type.OBJECT, properties: {
                    name: { type: Type.STRING },
                    imageSearchQuery: { type: Type.STRING, description: "A simple, descriptive search query for a high-quality, royalty-free portrait image of the celebrity." },
                    knownFor: { type: Type.STRING },
                    bio: { type: Type.STRING },
                    notableWorks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    birthDate: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
                }, required: ['name', 'knownFor', 'bio', 'notableWorks', 'birthDate', 'imageSearchQuery']
            }
        }, required: ['content', 'eventDetails', 'celebrityDetails']
    },
    draftPrompt: (topic) => `- The 'content' must be a celebratory spotlight intro for the celebrity "${topic}".
- The 'eventDetails.title' must be "Celebrity Spotlight".
- Fill all 'celebrityDetails' fields based on the summary. The 'name' must be exactly "${topic}". 'notableWorks' must be an array of strings. 'birthDate' must be in YYYY-MM-DD format. The 'imageSearchQuery' should be a simple but descriptive search query for a high-quality, royalty-free portrait of the celebrity.`
  },
};

const DraftPreview: React.FC<{ draft: Partial<Post> | null }> = ({ draft }) => {
  if (!draft) return null;

  const { type, content, eventDetails, imageUrl, ...details } = draft;

  const renderDetails = () => {
    switch (type) {
      case PostType.Trivia:
        const trivia = (details as any).triviaDetails;
        if (!trivia?.triviaItems) return null;
        return (
          <div className="bg-yellow-400/10 p-4 rounded-lg mt-4 border border-yellow-400/20">
            <h5 className="font-semibold text-yellow-300 mb-2">Trivia Items</h5>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
              {trivia.triviaItems.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        );
      case PostType.ProjectAnnouncement:
        const pa = (details as any).projectAnnouncementDetails;
        if (!pa) return null;
        return (
          <div className="bg-slate-700 p-4 rounded-lg mt-4">
            <p className="text-yellow-300 font-semibold text-sm">{pa.expectedRelease}</p>
            <h4 className="text-xl font-bold text-white mt-1">{pa.title}</h4>
            <p className="text-sm italic my-2 text-slate-300">"{pa.logline}"</p>
            <div className="text-xs text-slate-400 border-t border-slate-600 pt-2 mt-2">
              <p><strong>Status:</strong> {pa.status}</p>
              {pa.crew && <p><strong>Crew:</strong> {pa.crew}</p>}
            </div>
          </div>
        );
      case PostType.Awards:
        const aw = (details as any).awardDetails;
        if (!aw) return null;
        return (
          <div className="bg-amber-500/10 p-4 rounded-lg text-center mt-4 border border-amber-500/20">
            <p className="text-amber-300 font-semibold">{aw.event} {aw.year}</p>
            <h4 className="text-2xl font-bold text-white my-1">{aw.awardName}</h4>
            <p className="text-lg text-slate-300">for <span className="font-semibold">{aw.awardFor}</span></p>
          </div>
        );
      case PostType.MovieDetails:
        const md = (details as any).movieDetails;
        if (!md) return null;
        return (
            <div className="bg-slate-700 p-4 rounded-lg mt-4">
                <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold text-white">{md.title}</h4>
                    {md.rating > 0 && (
                        <div className="flex items-center space-x-1 bg-amber-500 text-white font-bold px-2 py-1 rounded-md text-sm">
                            <span>⭐</span>
                            <span>{md.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                <p className="text-sm italic my-2 text-slate-300">"{md.synopsis}"</p>
                <div className="text-xs text-slate-400 border-t border-slate-600 pt-2 mt-2 space-y-1">
                    <p><strong>Director:</strong> {md.director}</p>
                    <p><strong>Cast:</strong> {md.cast?.join(', ')}</p>
                    <p><strong>Genres:</strong> {md.genres?.join(', ')}</p>
                </div>
            </div>
        );
    case PostType.Celebrity:
        const celeb = (details as any).celebrityDetails;
        if (!celeb) return null;
        return (
            <div className="bg-slate-700 p-4 rounded-lg mt-4">
                <h4 className="text-xl font-bold text-white">{celeb.name}</h4>
                <p className="text-teal-300 font-semibold text-sm">{celeb.knownFor}</p>
                <p className="text-sm italic my-2 text-slate-300">"{celeb.bio}"</p>
                <div className="text-xs text-slate-400 border-t border-slate-600 pt-2 mt-2 space-y-1">
                    <p><strong>Born:</strong> {celeb.birthDate}</p>
                    <p><strong>Notable Works:</strong> {celeb.notableWorks?.join(', ')}</p>
                </div>
            </div>
        );
      default:
        return null;
    }
  }

  const displayImageUrl = imageUrl || (draft.projectAnnouncementDetails as any)?.posterUrl || (draft.celebrityDetails as any)?.imageUrl || (draft.movieDetails as any)?.posterUrl;

  return (
    <div className="p-4 bg-slate-900/50 rounded-lg space-y-4">
      {eventDetails?.title && (
        <div className="bg-slate-700 p-3 rounded-lg">
          <h3 className="font-bold text-lg text-purple-300">{eventDetails.title}</h3>
        </div>
      )}
       {displayImageUrl && (
          <img src={displayImageUrl} alt="AI Generated" className="rounded-lg mt-4 max-h-60 w-auto mx-auto" />
        )}
      <p className="text-slate-300 whitespace-pre-wrap">{content}</p>
      {renderDetails()}
    </div>
  );
};


const AIPostGenerator: React.FC<AIPostGeneratorProps> = ({ allMovies, allCelebrities, onCreatePost }) => {
  const [step, setStep] = useState<Step>('select_type');
  const [selectedPostType, setSelectedPostType] = useState<PostType | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [draft, setDraft] = useState<Partial<Post> | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy Sources');
  const [isRefining, setIsRefining] = useState(false);
  const [styleSample, setStyleSample] = useState('');
  const [saveStyle, setSaveStyle] = useState(true);
  const [isFetchingSeo, setIsFetchingSeo] = useState(false);

  const topics = useMemo(() => ({
    movie: allMovies.map(m => ({ id: m.id, name: m.title })),
    celebrity: allCelebrities.map(c => ({ id: c.id, name: c.name })),
  }), [allMovies, allCelebrities]);

  const handlePostTypeSelect = (type: PostType) => {
    setSelectedPostType(type);
    setStep('select_topic');
    setSearchTerm('');
  };
  
  const handleBack = () => {
    setError(null);
    setDraft(null);
    if (step === 'select_topic') {
      setSelectedPostType(null);
      setStep('select_type');
    } else if (step === 'draft_ready' || step === 'error') {
      setStep('select_topic');
    }
  };

  const getSavedWritingStyles = (): { [key: string]: string } => {
    try {
        const styles = localStorage.getItem(AI_WRITING_STYLES_KEY);
        return styles ? JSON.parse(styles) : {};
    } catch (e) {
        console.error("Failed to parse writing styles from localStorage", e);
        return {};
    }
  };

  const saveWritingStyle = (postType: PostType, style: string) => {
      const styles = getSavedWritingStyles();
      styles[postType] = style;
      localStorage.setItem(AI_WRITING_STYLES_KEY, JSON.stringify(styles));
  };


  const handleTopicSelect = async (topic: string, linkedId: string | null, topicType: TopicType) => {
    if (!selectedPostType) return;
    setStep('generating');
    setError(null);
    setDraft(null);
    setSources([]);
    
    try {
      const config = POST_TYPE_CONFIG[selectedPostType];
      if (!config) throw new Error("Configuration for this post type is not available.");
      
      const savedStyles = getSavedWritingStyles();
      const savedStyle = savedStyles[selectedPostType];
      
      // --- Step 1: Content Search ---
      setStatusMessage(`Searching web for info on "${topic}"...`);
      const searchConfig = getApiService('contentSearch');
      const searchAi = new GoogleGenAI({ apiKey: searchConfig.apiKey });
      const newsResponse = await searchAi.models.generateContent({
        model: searchConfig.model,
        contents: config.newsPrompt(topic),
        config: { tools: [{ googleSearch: {} }] },
      });

      const summary = newsResponse.text;
      const foundSources = newsResponse.candidates?.[0]?.groundMetadata?.groundingChunks || [];
      
      if (!summary || summary.trim().length < 10) {
        throw new Error("No significant recent news found. Try another topic or post type.");
      }
      setSources(foundSources);
      
      // --- Step 2: Draft Generation ---
      setStatusMessage(`Generating ${selectedPostType} draft...`);
      const draftConfig = getApiService('draftGeneration');
      const draftAi = new GoogleGenAI({ apiKey: draftConfig.apiKey });
      const draftPrompt = `
        ${savedStyle ? `Crucially, you MUST write the entire post in the following style: """${savedStyle}"""\n\n` : ''}
        Based on the news summary below, create a social media post for "Fanz Adda".
        - The tone MUST be exciting, positive, and celebratory. Use emojis!
        - The output MUST be a valid JSON object matching the provided schema.
        ${config.draftPrompt(topic)}
        ${linkedId ? `- Link the post correctly. The ID to use for 'linkedMovieIds' or 'linkedCelebrityIds' is: "${linkedId}".` : `- This is a new topic, so do not include 'linkedMovieIds' or 'linkedCelebrityIds'.`}

        News Summary:
        ${summary}
      `;
      
      let finalSchema = config.draftSchema;
      finalSchema.properties['linkedMovieIds'] = { type: Type.ARRAY, items: { type: Type.STRING } };
      finalSchema.properties['linkedCelebrityIds'] = { type: Type.ARRAY, items: { type: Type.STRING } };

      const draftResponse = await draftAi.models.generateContent({
        model: draftConfig.model,
        contents: draftPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: finalSchema
        }
      });
      
      const postDraft = JSON.parse(draftResponse.text);

      // Image URL Generation Logic
      let imageQuery = '';
      if (postDraft.imageSearchQuery) imageQuery = postDraft.imageSearchQuery;
      else if (postDraft.projectAnnouncementDetails?.imageSearchQuery) imageQuery = postDraft.projectAnnouncementDetails.imageSearchQuery;
      else if (postDraft.movieDetails?.imageSearchQuery) imageQuery = postDraft.movieDetails.imageSearchQuery;
      else if (postDraft.celebrityDetails?.imageSearchQuery) imageQuery = postDraft.celebrityDetails.imageSearchQuery;

      if (imageQuery) {
          const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(imageQuery)}/800/500`;
          if (selectedPostType === PostType.ProjectAnnouncement) postDraft.projectAnnouncementDetails.posterUrl = imageUrl;
          else if (selectedPostType === PostType.MovieDetails) postDraft.movieDetails.posterUrl = imageUrl;
          else if (selectedPostType === PostType.Celebrity) postDraft.celebrityDetails.imageUrl = imageUrl;
          else postDraft.imageUrl = imageUrl;
      }

      setDraft({ ...postDraft, type: selectedPostType });
      setStep('draft_ready');

      // --- Step 3: SEO Generation (Non-blocking) ---
      setIsFetchingSeo(true);
      try {
        const seoConfig = getApiService('seoGeneration');
        const seoAi = new GoogleGenAI({ apiKey: seoConfig.apiKey });
        const seoPrompt = `Based on the following social media post content, generate SEO metadata for a fan celebration website.
        Post Content: """${JSON.stringify(postDraft)}"""
        Your task is to:
        1. Create a compelling meta description under 160 characters.
        2. Generate a list of 5-7 relevant SEO keywords (short and long-tail).
        Return a single, valid JSON object with keys "metaDescription" and "seoKeywords".`;
        
        const seoSchema = {
            type: Type.OBJECT, properties: {
                metaDescription: { type: Type.STRING },
                seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            }, required: ['metaDescription', 'seoKeywords']
        };

        const seoResponse = await seoAi.models.generateContent({
            model: seoConfig.model, contents: seoPrompt,
            config: { responseMimeType: "application/json", responseSchema: seoSchema }
        });

        const seoData = JSON.parse(seoResponse.text);
        setDraft(prevDraft => ({
            ...prevDraft,
            metaDescription: seoData.metaDescription,
            seoKeywords: seoData.seoKeywords,
        }));

      } catch (seoError) {
        console.warn("Could not fetch SEO suggestions:", seoError);
      } finally {
        setIsFetchingSeo(false);
      }

    } catch (e) {
      console.error(e);
      setError((e as Error).message || 'An unexpected error occurred.');
      setStep('error');
    }
  };
  
  const handleRefineDraft = async () => {
    if (!styleSample || !draft || !selectedPostType) return;
    setIsRefining(true);
    setError(null);
    setStatusMessage("Refining draft with your style...");

    try {
      const config = POST_TYPE_CONFIG[selectedPostType];
      if (!config) throw new Error("Configuration for this post type is not available.");

      const refinePrompt = `
        Analyze the writing style of the 'Sample Text' (considering its tone, sentence structure, vocabulary, and use of emojis).
        Then, rewrite the 'Original Draft JSON' to perfectly match that style.
        The output MUST be a valid JSON object that strictly adheres to the original schema. Do not add or remove fields.

        Sample Text:
        """
        ${styleSample}
        """

        Original Draft JSON:
        ${JSON.stringify(draft, null, 2)}
      `;

      const draftConfig = getApiService('draftGeneration');
      const refineAi = new GoogleGenAI({ apiKey: draftConfig.apiKey });
      const refinedResponse = await refineAi.models.generateContent({
          model: draftConfig.model,
          contents: refinePrompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: config.draftSchema,
          },
      });

      const refinedDraft = JSON.parse(refinedResponse.text);
      setDraft({ ...draft, ...refinedDraft, type: selectedPostType }); // Preserve original fields like imageUrl

      if (saveStyle) {
          saveWritingStyle(selectedPostType, styleSample);
      }
    } catch (e) {
        console.error("Failed to refine draft:", e);
        setError((e as Error).message || "Failed to refine the draft.");
    } finally {
        setIsRefining(false);
        setStatusMessage('');
    }
  };

  const handleUseDraft = () => {
    if (draft) {
      onCreatePost(draft);
    }
  };
  
  const handleCopySources = () => {
    if (sources.length === 0) return;

    const urls = sources
        .map(chunk => chunk.web?.uri)
        .filter(Boolean)
        .join('\n');
    
    if (urls) {
        navigator.clipboard.writeText(urls).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy Sources'), 2000);
        }).catch(err => {
            console.error('Failed to copy sources: ', err);
            setCopyStatus('Failed to copy');
            setTimeout(() => setCopyStatus('Copy Sources'), 2000);
        });
    }
  };

  const renderTypeSelection = () => (
    <div className="bg-slate-700/50 p-5 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-1">Step 1: Choose a Post Type</h3>
      <p className="text-sm text-slate-400 mb-4">What kind of celebration post do you want to create?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Object.entries(POST_TYPE_CONFIG).map(([type, config]) => (
          <button
            key={type}
            onClick={() => handlePostTypeSelect(type as PostType)}
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-all duration-200 hover:scale-105"
          >
            <span className="material-symbols-outlined text-3xl text-purple-400">{config.icon}</span>
            <h4 className="font-bold text-white mt-2">{type}</h4>
            <p className="text-xs text-slate-400">{config.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
  
  const renderTopicSelection = () => {
    if (!selectedPostType) return null;
    const config = POST_TYPE_CONFIG[selectedPostType];
    if (!config) return null;

    let topicsToShow: { id: string; name: string; type: TopicType }[] = [];
    if (config.topicType === 'movie') {
        topicsToShow = topics.movie.map(t => ({...t, type: 'movie'}));
    } else if (config.topicType === 'celebrity') {
        topicsToShow = topics.celebrity.map(t => ({...t, type: 'celebrity'}));
    } else if (config.topicType === 'any') {
        topicsToShow = [
            ...topics.movie.map(t => ({...t, type: 'movie' as const})),
            ...topics.celebrity.map(t => ({...t, type: 'celebrity' as const}))
        ];
    }

    const filteredTopics = topicsToShow.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const hasSearchTerm = searchTerm.trim().length > 0;

    return (
        <div className="bg-slate-700/50 p-5 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-700"><span className="material-symbols-outlined">arrow_back</span></button>
                <div>
                    <h3 className="text-lg font-semibold text-white">Step 2: Select a Topic for your '{selectedPostType}' post</h3>
                    <p className="text-sm text-slate-400">Choose from existing topics or search the web for a new one.</p>
                </div>
            </div>
             <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a topic..."
                className="w-full bg-slate-900 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500"
            />
            <div className="max-h-60 overflow-y-auto mt-3 space-y-1 pr-2">
                {filteredTopics.map(topic => (
                    <button
                        key={topic.id}
                        onClick={() => handleTopicSelect(topic.name, topic.id, topic.type)}
                        className="w-full text-left p-2 rounded-md hover:bg-purple-600 flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-purple-300 text-base">{topic.type === 'movie' ? 'theaters' : 'person'}</span>
                      <span className="text-slate-200">{topic.name}</span>
                    </button>
                ))}
                {hasSearchTerm && (
                    <button
                        onClick={() => handleTopicSelect(searchTerm, null, config.topicType)}
                        className="w-full text-left p-2 rounded-md hover:bg-purple-600 flex items-center gap-3 italic"
                    >
                      <span className="material-symbols-outlined text-purple-300 text-base">search</span>
                      <span className="text-slate-300">Search web for new topic: "{searchTerm}"</span>
                    </button>
                )}
            </div>
        </div>
    );
  };
  
  const renderStatus = () => {
    if (step === 'generating' || isRefining) {
      return (
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white font-semibold">{statusMessage}</p>
        </div>
      );
    }
    if (step === 'error') {
      return (
        <div className="text-center bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg">
          <h4 className="font-bold text-rose-400">Generation Failed</h4>
          <p className="text-slate-300 mt-2">{error}</p>
          <button onClick={handleBack} className="mt-4 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-full text-sm">
            Try Again
          </button>
        </div>
      );
    }
    if (step === 'draft_ready' && draft) {
      return (
        <div className="space-y-6 w-full">
          <div>
            <div className="flex items-center gap-4 mb-4">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-700"><span className="material-symbols-outlined">arrow_back</span></button>
                <h4 className="text-lg font-bold text-white">Step 3: Review Your Draft</h4>
            </div>
            <DraftPreview draft={draft} />
          </div>

          <div className="w-full space-y-4 pt-6 border-t border-slate-700">
            <h4 className="text-lg font-bold text-white">Refine with Your Writing Style (Optional)</h4>
            <p className="text-sm text-slate-400">Paste an article you've written on a similar topic. The AI will learn your style and rewrite the draft.</p>
            <textarea
                value={styleSample}
                onChange={(e) => setStyleSample(e.target.value)}
                placeholder="Paste your writing sample here..."
                className="w-full bg-slate-900 text-white rounded-md p-2 border border-slate-600 h-24"
                disabled={isRefining}
            />
            <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={saveStyle} onChange={(e) => setSaveStyle(e.target.checked)} disabled={isRefining} className="form-checkbox h-4 w-4 text-purple-500 bg-slate-800 border-slate-600 rounded focus:ring-purple-500" />
                    <span>Save this style for future '{selectedPostType}' posts</span>
                </label>
                <button
                    onClick={handleRefineDraft}
                    disabled={!styleSample || isRefining}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full text-sm disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isRefining ? 'Refining...' : 'Refine Draft'}
                </button>
            </div>
          </div>
          
           <div className="w-full space-y-4 pt-6 border-t border-slate-700">
            <h4 className="text-lg font-bold text-white">SEO Suggestions</h4>
            {isFetchingSeo ? (
                <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating recommendations...</span>
                </div>
            ) : (
                <div className="space-y-3 text-sm">
                    {draft.metaDescription && (
                        <div>
                            <label className="font-semibold text-purple-300">Meta Description</label>
                            <p className="p-2 bg-slate-900/50 rounded-md mt-1 text-slate-300 italic">"{draft.metaDescription}"</p>
                        </div>
                    )}
                    {draft.seoKeywords && draft.seoKeywords.length > 0 && (
                        <div>
                            <label className="font-semibold text-purple-300">Keywords</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {draft.seoKeywords.map(keyword => (
                                    <span key={keyword} className="bg-slate-600 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full">{keyword}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {(!draft.metaDescription && !draft.seoKeywords) && <p className="text-slate-500 text-xs italic">Could not generate SEO suggestions for this topic.</p>}
                </div>
            )}
        </div>

          <div>
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-white">Sources Found</h4>
              <button
                onClick={handleCopySources}
                className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-1 px-3 rounded-full text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">{copyStatus === 'Copied!' ? 'check' : 'content_copy'}</span>
                {copyStatus}
              </button>
            </div>
            <ul className="mt-2 space-y-2 text-sm max-h-32 overflow-y-auto pr-2">
                {sources.length > 0 ? sources.map((chunk, index) => (
                  chunk.web?.uri && <li key={index} className="bg-slate-900/50 p-2 rounded-lg">
                    <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline truncate block">
                        {chunk.web.title || chunk.web.uri}
                    </a>
                  </li>
                )) : <p className="text-slate-400 italic text-xs">No web sources were cited for this response.</p>}
              </ul>
          </div>
          <div className="flex justify-center pt-4 border-t border-slate-700">
              <button onClick={handleUseDraft} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
                  Use This Draft
              </button>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Content Co-Pilot</h2>
        <p className="text-slate-400 mt-1">Automate news gathering and post creation with this guided tool.</p>
      </div>

      {step === 'select_type' && renderTypeSelection()}
      {step === 'select_topic' && renderTopicSelection()}
      {(step === 'generating' || step === 'error' || step === 'draft_ready') && (
        <div className="bg-slate-700/50 p-5 rounded-lg min-h-[300px] flex items-center justify-center">
            {renderStatus()}
        </div>
      )}
      
      <div className="text-center text-xs text-slate-500 bg-slate-700/30 p-3 rounded-lg">
        <span className="font-bold">Disclaimer:</span> AI Co-Pilot uses Google Search to gather information. Always review the generated content and verify the sources provided to ensure accuracy and originality before publishing.
      </div>
    </div>
  );
};

export default AIPostGenerator;