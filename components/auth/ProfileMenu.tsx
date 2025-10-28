import React, { useState, useEffect, useRef } from 'react';

interface ProfileMenuProps {
    onLogout: () => void;
    onViewProfile: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout, onViewProfile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-full rounded-full"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="Open user menu"
            >
                <span className="sr-only">Open user menu</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 animate-fade-in-down">
                    <button
                        onClick={() => handleAction(onViewProfile)}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                    >
                        <span className="material-symbols-outlined text-base">person</span>
                        <span>My Profile</span>
                    </button>
                    <button
                        onClick={() => handleAction(onLogout)}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-rose-300 hover:bg-slate-700"
                    >
                         <span className="material-symbols-outlined text-base">logout</span>
                        <span>Log Out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
