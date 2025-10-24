

import React from 'react';

type ActiveView = 'feed' | 'profile' | 'admin' | 'favorites' | 'about' | 'terms' | 'contact' | 'disclaimer';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
}

const Footer: React.FC<FooterProps> = ({ setActiveView }) => {
  return (
    <footer className="bg-slate-800/50 border-t border-slate-700 mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-4">
          <button onClick={() => setActiveView('about')} className="hover:text-white transition-colors">About Us</button>
          <button onClick={() => setActiveView('terms')} className="hover:text-white transition-colors">Terms of Service</button>
          <button onClick={() => setActiveView('contact')} className="hover:text-white transition-colors">Contact Us</button>
          <button onClick={() => setActiveView('disclaimer')} className="hover:text-white transition-colors">Disclaimer</button>
        </div>
        <p>&copy; {new Date().getFullYear()} Fanz Adda. A platform for celebration.</p>
      </div>
    </footer>
  );
};

export default Footer;