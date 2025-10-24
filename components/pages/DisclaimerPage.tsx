

import React from 'react';

const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl animate-page-enter">
      <h1 className="text-4xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">Disclaimer</h1>
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          The information provided by Fanz Adda ("we," "us," or "our") on this platform is for general informational and entertainment purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
        </p>
        
        <h2 className="text-2xl font-semibold text-white pt-4">For Entertainment Purposes Only</h2>
        <p>
          Fanz Adda is a fan-run platform intended for entertainment. The content, including posts, images, and details about celebrities and movies, is not official and should be considered as such. We are not affiliated with, endorsed by, or in any way officially connected with any of the celebrities, movie studios, or production companies mentioned on this platform.
        </p>

        <h2 className="text-2xl font-semibold text-white pt-4">External Links Disclaimer</h2>
        <p>
          The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
        </p>

        <h2 className="text-2xl font-semibold text-white pt-4">No Professional Advice</h2>
        <p>
          The information provided on this platform does not constitute professional advice of any kind. It is for informational purposes only and should not be relied upon as a substitute for professional advice.
        </p>

        <p>
          By using our platform, you hereby consent to our disclaimer and agree to its terms.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerPage;