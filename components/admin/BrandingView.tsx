import React, { useState, useEffect, ChangeEvent } from 'react';
import { SiteSettings } from '../../types';

interface BrandingViewProps {
  siteSettings: SiteSettings;
  onUpdate: (newSettings: SiteSettings) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const BrandingView: React.FC<BrandingViewProps> = ({ siteSettings, onUpdate }) => {
  const [formData, setFormData] = useState<SiteSettings>(siteSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    // If props change from outside, update the form
    setFormData(siteSettings);
  }, [siteSettings]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData({ ...formData, [field]: base64 });
      } catch (error) {
        console.error("Error converting file to base64", error);
        alert("There was an error uploading the file. Please try again.");
      }
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    onUpdate(formData);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Site Branding</h2>
        <p className="text-slate-400 mt-1">Customize your site's name, logo, and browser icon.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Site Name */}
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <label htmlFor="siteName" className="block text-lg font-medium text-white mb-2">Site Name</label>
          <input
            type="text"
            id="siteName"
            name="siteName"
            value={formData.siteName}
            onChange={handleInputChange}
            className="w-full bg-slate-800 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Site Logo */}
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-2">Site Logo</h3>
          <p className="text-sm text-slate-400 mb-4">Displayed in the header. Recommended size: 160x40 pixels.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-2">Preview</p>
              <div className="h-16 flex items-center justify-center bg-slate-900 rounded-md p-2">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo Preview" className="max-h-full max-w-full" />
                ) : (
                  <span className="text-xl font-bold text-white">{formData.siteName}</span>
                )}
              </div>
            </div>
            <div className="space-y-3">
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                />
                <label htmlFor="logo-upload" className="w-full text-center cursor-pointer bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-full transition duration-300 block">
                  Upload New Logo
                </label>
                {formData.logo && (
                   <button type="button" onClick={handleRemoveLogo} className="w-full text-center bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300">
                      Remove Logo
                    </button>
                )}
            </div>
          </div>
        </div>
        
        {/* Favicon */}
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-2">Favicon</h3>
          <p className="text-sm text-slate-400 mb-4">The icon displayed in the browser tab. Recommended size: 32x32 pixels.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-2">Preview</p>
              <div className="h-16 flex items-center justify-center bg-slate-900 rounded-md p-2">
                {formData.favicon ? (
                  <img src={formData.favicon} alt="Favicon Preview" className="w-8 h-8" />
                ) : (
                  <span className="text-slate-500 text-xs">No Favicon</span>
                )}
              </div>
            </div>
            <div>
                 <input
                  type="file"
                  id="favicon-upload"
                  className="hidden"
                  accept="image/png, image/x-icon, image/svg+xml"
                  onChange={(e) => handleFileUpload(e, 'favicon')}
                />
                 <label htmlFor="favicon-upload" className="w-full text-center cursor-pointer bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-full transition duration-300 block">
                  Upload Favicon
                </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-slate-700">
           <button type="submit" disabled={saveStatus === 'saving'} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 disabled:bg-slate-500">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Changes Saved!'}
            {saveStatus === 'idle' && 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandingView;
