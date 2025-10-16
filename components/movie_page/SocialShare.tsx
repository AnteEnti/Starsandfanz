import React from 'react';

const socialPlatforms = [
  { name: 'Facebook', icon: 'group', color: 'hover:text-blue-500' },
  { name: 'Twitter', icon: 'forum', color: 'hover:text-sky-400' },
  { name: 'WhatsApp', icon: 'sms', color: 'hover:text-green-500' },
  { name: 'Pinterest', icon: 'photo_camera', color: 'hover:text-red-600' },
  { name: 'LinkedIn', icon: 'work', color: 'hover:text-blue-700' },
  { name: 'Email', icon: 'mail', color: 'hover:text-gray-400' },
];

const SocialShare: React.FC = () => {
  return (
    <section className="animate-fade-in-up" style={{animationDelay: '300ms'}}>
      <div className="flex items-center gap-4">
        <h3 className="text-md font-semibold text-white">Share:</h3>
        <div className="flex items-center gap-2">
          {socialPlatforms.map(platform => (
            <a 
              key={platform.name}
              href="#" 
              aria-label={`Share on ${platform.name}`}
              className={`p-2 bg-slate-800 rounded-full text-slate-400 transition-colors duration-300 ${platform.color}`}
            >
              <span className="material-symbols-outlined">{platform.icon}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialShare;
