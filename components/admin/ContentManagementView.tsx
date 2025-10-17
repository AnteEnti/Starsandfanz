import React, { useState, FormEvent, useMemo } from 'react';
import { BannerContent } from '../../App';

interface ContentManagementViewProps {
  bannerContent: BannerContent;
  onUpdateBannerContent: (newContent: BannerContent) => void;
}

const ContentManagementView: React.FC<ContentManagementViewProps> = ({ bannerContent, onUpdateBannerContent }) => {
  const [formData, setFormData] = useState<BannerContent>(bannerContent);

  const isFormChanged = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(bannerContent);
  }, [formData, bannerContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateBannerContent(formData);
    // Optionally show a success message
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Manage Content</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-700/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-3">Welcome Banner</h3>

        <div>
          <label htmlFor="headline1" className="block text-sm font-medium text-slate-300 mb-1">Main Slogan</label>
          <input
            type="text"
            id="headline1"
            name="headline1"
            value={formData.headline1}
            onChange={handleInputChange}
            className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label htmlFor="headline2" className="block text-sm font-medium text-slate-300 mb-1">Celebration Word</label>
          <input
            type="text"
            id="headline2"
            name="headline2"
            value={formData.headline2}
            onChange={handleInputChange}
            className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!isFormChanged}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-full transition duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentManagementView;