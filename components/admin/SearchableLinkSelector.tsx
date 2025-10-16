import React, { useState, useMemo, useRef, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
}

interface SearchableLinkSelectorProps {
  title: string;
  items: Item[];
  selectedIds: string[];
  onSelectionChange: (newIds: string[]) => void;
}

const SearchableLinkSelector: React.FC<SearchableLinkSelectorProps> = ({ title, items, selectedIds, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedItems = useMemo(() => {
    return items.filter(item => selectedIds.includes(item.id));
  }, [items, selectedIds]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return [];
    return items.filter(item => 
      !selectedIds.includes(item.id) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, selectedIds, searchTerm]);

  const handleSelect = (id: string) => {
    onSelectionChange([...selectedIds, id]);
    setSearchTerm('');
  };

  const handleRemove = (id: string) => {
    onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
  };
  
  // Handle clicks outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);


  return (
    <div ref={wrapperRef}>
      <h3 className="text-lg font-semibold text-purple-300 mb-2">{title}</h3>
      <div className="relative bg-slate-700/50 p-2 rounded-lg border border-slate-600 focus-within:ring-2 focus-within:ring-purple-500">
        <div className="flex flex-wrap gap-2">
          {selectedItems.map(item => (
            <div key={item.id} className="bg-purple-600 text-white text-sm font-medium px-2 py-1 rounded-md flex items-center gap-2">
              <span>{item.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="text-purple-200 hover:text-white"
                aria-label={`Remove ${item.name}`}
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          ))}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={`Search to add ${title.toLowerCase().includes('movie') ? 'movies' : 'celebrities'}...`}
            className="flex-1 bg-transparent p-1 focus:outline-none min-w-[200px]"
          />
        </div>
        {isFocused && filteredOptions.length > 0 && (
          <ul className="absolute z-10 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.map(option => (
              <li
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className="px-4 py-2 text-sm text-slate-200 hover:bg-purple-600 cursor-pointer"
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchableLinkSelector;