import React, { useState, useEffect } from 'react';
import { Person } from '../../types';

interface PeopleSectionProps {
  title: string;
  people: Person[];
}

const PeopleModal: React.FC<{ title: string, people: Person[], onClose: () => void }> = ({ title, people, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isClosing ? 'animate-modal-bg-exit' : 'animate-modal-bg-enter'}`}
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-slate-800 w-full max-w-lg shadow-2xl flex flex-col overflow-hidden relative rounded-xl h-[90vh] max-h-[700px] ${isClosing ? 'animate-modal-content-exit' : 'animate-modal-content-enter'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-shrink-0 p-4 flex items-center justify-between border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-700" aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-3">
            {people.map((member, index) => (
              <li key={index} className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-700/50">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="font-semibold text-white">{member.name}</p>
                  <p className="text-sm text-slate-400">{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};


const PeopleSection: React.FC<PeopleSectionProps> = ({ title, people }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewPeople = people.slice(0, 7);

  if (people.length === 0) {
    return null;
  }

  return (
    <>
      <section className="animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">{title}</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {previewPeople.map(person => (
            <div key={person.name} className="flex-shrink-0 w-32 text-center group">
              <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-slate-700 group-hover:border-purple-500 transition-colors duration-300">
                <img 
                  src={person.imageUrl} 
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-semibold text-white mt-2 truncate">{person.name}</h3>
              <p className="text-xs text-slate-400 truncate">{person.role}</p>
            </div>
          ))}
          {people.length > previewPeople.length && (
            <div className="flex-shrink-0 w-32 text-center flex flex-col items-center justify-center">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 hover:border-purple-500 hover:bg-slate-700 transition-colors duration-300 flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-3xl text-slate-400">arrow_forward</span>
                </button>
                <h3 className="text-sm font-semibold text-white mt-2">View Full {title}</h3>
            </div>
          )}
        </div>
      </section>

      {isModalOpen && <PeopleModal title={`Full ${title}`} people={people} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default PeopleSection;