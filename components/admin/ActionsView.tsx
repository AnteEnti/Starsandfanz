import React, { useMemo } from 'react';
import { Post, PostType } from '../../types';

interface ActionsViewProps {
  posts: Post[];
  onCreatePost: (template: Partial<Post>) => void;
}

interface ActionableEvent {
  id: string;
  type: 'birthday' | 'release' | 'followup';
  title: string;
  date: Date;
  daysUntil: number;
  post: Post;
}

const formatDateStatus = (days: number): string => {
  if (days < -1) return `${Math.abs(days)} days ago`;
  if (days === -1) return 'Yesterday';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `in ${days} days`;
};

const ActionsView: React.FC<ActionsViewProps> = ({ posts, onCreatePost }) => {
  const events = useMemo<ActionableEvent[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    return posts.flatMap(post => {
      const oneDay = 24 * 60 * 60 * 1000;
      
      // Check for birthdays
      if (post.type === PostType.Celebrity && post.celebrityDetails?.birthDate) {
        const birthDate = new Date(post.celebrityDetails.birthDate);
        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        
        const daysUntil = Math.round((nextBirthday.getTime() - today.getTime()) / oneDay);
        
        return {
          id: `${post.id}-bday`,
          type: 'birthday',
          title: `${post.celebrityDetails.name}'s Birthday`,
          date: nextBirthday,
          daysUntil,
          post
        } as ActionableEvent;
      }
      
      // Check for countdown releases
      if (post.type === PostType.Countdown && post.countdownDetails?.targetDate) {
        const releaseDate = new Date(post.countdownDetails.targetDate);
        releaseDate.setHours(0,0,0,0);
        
        const daysUntil = Math.round((releaseDate.getTime() - today.getTime()) / oneDay);
        
        return {
          id: `${post.id}-release`,
          type: daysUntil < 0 ? 'followup' : 'release',
          title: `${post.eventDetails?.title || 'Release'}`,
          date: releaseDate,
          daysUntil,
          post
        } as ActionableEvent;
      }
      
      return [];
    });
  }, [posts]);

  const upcomingEvents = events
    .filter(e => e.daysUntil >= 0 && e.daysUntil <= 14)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const followUpEvents = events
    .filter(e => e.daysUntil < 0 && e.daysUntil >= -7)
    .sort((a, b) => b.daysUntil - a.daysUntil);
    
  const handleCreateClick = (event: ActionableEvent) => {
    let template: Partial<Post> = {};
    if (event.type === 'birthday') {
      template = {
        type: PostType.Birthday,
        content: `Wishing the happiest of birthdays to the one and only ${event.post.celebrityDetails?.name}! Your talent and dedication inspire us all every day. 🎂`,
        eventDetails: {
          title: `Happy Birthday, ${event.post.celebrityDetails?.name}!`,
        },
      };
    } else if (event.type === 'release' || event.type === 'followup') {
       template = {
        type: PostType.Announcement,
        content: `What are your thoughts on '${event.title}'? Share your reviews and favorite moments below!`,
        eventDetails: { title: `'${event.title}' is now released!` },
      };
    }
    onCreatePost(template);
  };
  
  const EventCard: React.FC<{event: ActionableEvent}> = ({ event }) => {
    const icons = {
      birthday: { icon: 'cake', color: 'text-pink-400' },
      release: { icon: 'schedule', color: 'text-indigo-400' },
      followup: { icon: 'movie', color: 'text-amber-400' },
    };
    
    return (
      <div className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className={`material-symbols-outlined text-3xl ${icons[event.type].color}`}>{icons[event.type].icon}</span>
          <div>
            <p className="font-semibold text-white">{event.title}</p>
            <p className="text-sm text-slate-400">
              {event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              <span className="font-bold text-purple-300 ml-2">({formatDateStatus(event.daysUntil)})</span>
            </p>
          </div>
        </div>
        <button 
          onClick={() => handleCreateClick(event)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-1.5 px-3 rounded-full transition-colors duration-200 flex-shrink-0"
        >
          Create Post
        </button>
      </div>
    );
  };
  
  const EventSection: React.FC<{title: string; events: ActionableEvent[]}> = ({ title, events }) => (
    <section>
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No events in this category.</p>
        )}
    </section>
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Actions & Alerts</h2>
      
      <EventSection title="Upcoming Events (Next 14 Days)" events={upcomingEvents} />
      
      <EventSection title="Follow-ups (Last 7 Days)" events={followUpEvents} />
      
    </div>
  );
};

export default ActionsView;