import React, { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { Banner, BannerContent } from '../../types';

interface BannerManagementViewProps {
  banners: Banner[];
  onUpdateBanners: (newBanners: Banner[]) => void;
}

const BannerPreview: React.FC<{ content: Partial<BannerContent> }> = ({ content }) => {
  const { headline1, headline2, description } = content;
  return (
    <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 rounded-lg shadow-lg">
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {headline1 || "[Headline 1]"}
        </h2>
        <h1 className="text-5xl font-black text-white" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.2)' }}>
          {headline2 || "[Headline 2]"}
        </h1>
        <div className="mt-4 text-sm font-medium text-slate-800 max-w-lg">
          <p className="whitespace-pre-wrap">
            {description || "[Description]"}
          </p>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 z-30">
        <div className="w-20 h-20 rounded-full bg-slate-900/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-lg">🎉</div>
        <div className="w-20 h-20 rounded-full bg-slate-900/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-lg">🥳</div>
      </div>
    </div>
  );
};

const BannerManagementView: React.FC<BannerManagementViewProps> = ({ banners, onUpdateBanners }) => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [bannerToEdit, setBannerToEdit] = useState<Banner | Partial<Banner> | null>(null);
  const [formData, setFormData] = useState<Partial<Banner>>({});

  useEffect(() => {
    if (view === 'form') {
      setFormData(bannerToEdit || {
        name: 'New Banner',
        headline1: '',
        headline2: '',
        description: '',
        startDate: '',
        endDate: '',
        targeting: { device: 'all', loggedInStatus: 'all' },
      });
    }
  }, [view, bannerToEdit]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('targeting.')) {
      const key = name.split('.')[1] as keyof Banner['targeting'];
      setFormData(prev => ({
        ...prev,
        targeting: {
          ...prev.targeting,
          [key]: value,
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (bannerToEdit && 'id' in bannerToEdit) {
      // Editing existing
      onUpdateBanners(banners.map(b => b.id === bannerToEdit.id ? { ...b, ...formData } as Banner : b));
    } else {
      // Creating new
      const newBanner: Banner = {
        id: `banner-${Date.now()}`,
        name: formData.name || 'Untitled Banner',
        headline1: formData.headline1 || '',
        headline2: formData.headline2 || '',
        description: formData.description || '',
        isActive: false, // New banners are never active by default
        startDate: formData.startDate,
        endDate: formData.endDate,
        targeting: formData.targeting || { device: 'all', loggedInStatus: 'all' },
      };
      onUpdateBanners([...banners, newBanner]);
    }
    setView('list');
  };

  const handleSetActive = (bannerId: string, isActive: boolean) => {
    onUpdateBanners(banners.map(b => (b.id === bannerId ? { ...b, isActive } : b)));
  };

  const handleDelete = (bannerId: string) => {
    if (window.confirm("Are you sure you want to delete this banner? This action cannot be undone.")) {
      onUpdateBanners(banners.filter(b => b.id !== bannerId));
    }
  };
  
  const getBannerStatus = (banner: Banner): { text: string; color: string } => {
    const now = new Date();
    const startDate = banner.startDate ? new Date(banner.startDate) : null;
    const endDate = banner.endDate ? new Date(banner.endDate) : null;

    if (!banner.isActive) return { text: 'Inactive', color: 'bg-slate-600 text-slate-200' };
    if (endDate && now > endDate) return { text: 'Expired', color: 'bg-rose-500/20 text-rose-300' };
    if (startDate && now < startDate) return { text: 'Scheduled', color: 'bg-sky-500/20 text-sky-300' };
    
    return { text: 'Active', color: 'bg-green-500/20 text-green-300' };
  };

  // Helper to format date for input[type=datetime-local]
  const formatDateForInput = (isoDate?: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    // Adjust for timezone offset to display local time correctly
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  };

  if (view === 'form') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setView('list')} className="p-2 rounded-full hover:bg-slate-700" aria-label="Back to banner list">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-2xl font-bold text-white">
            {bannerToEdit && 'id' in bannerToEdit ? 'Edit Banner' : 'Create New Banner'}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Banner Name</label>
              <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleInputChange} required className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="headline1" className="block text-sm font-medium text-slate-300 mb-1">Main Slogan</label>
              <input type="text" id="headline1" name="headline1" value={formData.headline1 || ''} onChange={handleInputChange} required className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="headline2" className="block text-sm font-medium text-slate-300 mb-1">Celebration Word</label>
              <input type="text" id="headline2" name="headline2" value={formData.headline2 || ''} onChange={handleInputChange} required className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} required rows={5} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500" />
            </div>
            
            <fieldset className="space-y-4 pt-4 border-t border-slate-700">
               <legend className="text-lg font-semibold text-white -mb-2">Scheduling</legend>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                       <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-1">Start Date (Optional)</label>
                       <input type="datetime-local" id="startDate" name="startDate" value={formatDateForInput(formData.startDate)} onChange={handleInputChange} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500" />
                   </div>
                   <div>
                       <label htmlFor="endDate" className="block text-sm font-medium text-slate-300 mb-1">End Date (Optional)</label>
                       <input type="datetime-local" id="endDate" name="endDate" value={formatDateForInput(formData.endDate)} onChange={handleInputChange} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500" />
                   </div>
               </div>
            </fieldset>

            <fieldset className="space-y-4 pt-4 border-t border-slate-700">
               <legend className="text-lg font-semibold text-white -mb-2">Targeting</legend>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="targeting.device" className="block text-sm font-medium text-slate-300 mb-1">Target Device</label>
                    <select id="targeting.device" name="targeting.device" value={formData.targeting?.device || 'all'} onChange={handleInputChange} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500">
                      <option value="all">All Devices</option>
                      <option value="desktop">Desktop Only</option>
                      <option value="mobile">Mobile Only</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="targeting.loggedInStatus" className="block text-sm font-medium text-slate-300 mb-1">Target Audience</label>
                    <select id="targeting.loggedInStatus" name="targeting.loggedInStatus" value={formData.targeting?.loggedInStatus || 'all'} onChange={handleInputChange} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500">
                      <option value="all">All Visitors</option>
                      <option value="loggedIn">Logged-In Users</option>
                      <option value="loggedOut">Logged-Out Visitors</option>
                    </select>
                  </div>
               </div>
            </fieldset>

            <div className="flex justify-end pt-4">
              <button type="submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition duration-200">
                Save Banner
              </button>
            </div>
          </form>
          <div className="sticky top-20">
            <h3 className="text-xl font-semibold text-white mb-4">Live Preview</h3>
            <BannerPreview content={formData} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Manage Banners</h2>
        <button onClick={() => { setBannerToEdit(null); setView('form'); }} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center space-x-2">
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Create Banner</span>
        </button>
      </div>
      <div className="overflow-x-auto bg-slate-700/50 rounded-lg">
        <table className="min-w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">Banner Name</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Schedule</th>
              <th scope="col" className="px-6 py-3">Targeting</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(banner => {
              const status = getBannerStatus(banner);
              return (
                <tr key={banner.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-medium text-white">{banner.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>{status.text}</span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {banner.startDate ? new Date(banner.startDate).toLocaleString() : 'Always'} - {banner.endDate ? new Date(banner.endDate).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-xs capitalize">
                    {banner.targeting?.device || 'all'}, {banner.targeting?.loggedInStatus.replace('logged', 'Logged-') || 'all'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <label htmlFor={`toggle-${banner.id}`} className="inline-flex items-center cursor-pointer">
                        <span className="relative">
                            <input type="checkbox" id={`toggle-${banner.id}`} className="sr-only" checked={banner.isActive} onChange={(e) => handleSetActive(banner.id, e.target.checked)} />
                            <div className="w-10 h-6 bg-slate-600 rounded-full shadow-inner"></div>
                            <div className={`dot absolute w-4 h-4 bg-white rounded-full shadow -left-0 top-1 transition-transform ${banner.isActive ? 'translate-x-5 bg-purple-400' : 'translate-x-1'}`}></div>
                        </span>
                    </label>
                    <button onClick={() => { setBannerToEdit(banner); setView('form'); }} className="font-medium text-purple-400 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(banner.id)} className="font-medium text-rose-500 hover:underline">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannerManagementView;