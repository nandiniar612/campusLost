import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, MapPin, Tag, ChevronRight, Sparkles } from 'lucide-react';

interface GlobalSearchBarProps {
  variant?: 'header' | 'hero' | 'compact';
  compact?: boolean;
  className?: string;
  placeholder?: string;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  variant = 'header',
  compact = false,
  className = '',
  placeholder = 'Search by item name, category or location...'
}) => {
  const effectiveVariant = compact ? 'compact' : variant;
  const {
    items,
    searchQuery,
    setSearchQuery,
    setCurrentView,
    setBrowseTab,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState(searchQuery);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronize internal query with global query
  useEffect(() => {
    setInternalQuery(searchQuery);
  }, [searchQuery]);

  // Keyboard shortcut listener (Cmd+K or Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement !== inputRef.current && !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const queryTrimmed = internalQuery.trim().toLowerCase();

  // Instant multi-category results (searching both Lost and Found)
  const matchingLost = items
    .filter(i => i.type === 'lost')
    .filter(i =>
      !queryTrimmed ||
      i.title.toLowerCase().includes(queryTrimmed) ||
      i.category.toLowerCase().includes(queryTrimmed) ||
      i.location.toLowerCase().includes(queryTrimmed) ||
      i.description.toLowerCase().includes(queryTrimmed)
    )
    .slice(0, 3);

  const matchingFound = items
    .filter(i => i.type === 'found')
    .filter(i =>
      !queryTrimmed ||
      i.title.toLowerCase().includes(queryTrimmed) ||
      i.category.toLowerCase().includes(queryTrimmed) ||
      i.location.toLowerCase().includes(queryTrimmed) ||
      i.description.toLowerCase().includes(queryTrimmed)
    )
    .slice(0, 3);

  const hasResults = matchingLost.length > 0 || matchingFound.length > 0;

  const handleSelect = (itemId: string) => {
    setIsOpen(false);
    setCurrentView('item-details', itemId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(internalQuery);
    setIsOpen(false);
    setBrowseTab('all');
    setCurrentView('browse');
  };

  const handleClear = () => {
    setInternalQuery('');
    setSearchQuery('');
    inputRef.current?.focus();
  };

  // Styles based on variant
  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div
          className={`relative flex items-center transition-all ${
            isHero
              ? 'bg-white rounded-2xl shadow-xl border-2 border-indigo-100 hover:border-indigo-300 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100'
              : 'bg-stone-100/90 hover:bg-stone-100 focus-within:bg-white rounded-xl border border-stone-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100'
          }`}
        >
          <div className="pl-4 pr-2 text-stone-400 flex items-center">
            <Search className={isHero ? 'w-5 h-5 text-indigo-600' : 'w-4 h-4'} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={internalQuery}
            onChange={(e) => {
              setInternalQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`w-full bg-transparent focus:outline-none text-slate-800 placeholder-stone-400 font-medium ${
              isHero ? 'py-4 text-base' : 'py-2.5 text-sm'
            }`}
          />

          {internalQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 mr-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isHero ? (
            <button
              type="submit"
              className="mr-2 px-6 py-2.5 rounded-xl bg-[#1B2A4A] hover:bg-[#0B192C] text-white font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              Search
            </button>
          ) : (
            <div className="pr-3 hidden sm:flex items-center">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-200/60 rounded border border-stone-300/60">
                ⌘K
              </kbd>
            </div>
          )}
        </div>
      </form>

      {/* Suggestion Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3 border-b border-stone-100 flex items-center justify-between text-xs text-stone-500 bg-stone-50/70">
            <span className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Real-time Global Results across Lost & Found
            </span>
            <span className="text-[11px] text-stone-400">Press Enter to view all</span>
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
            {hasResults ? (
              <>
                {matchingLost.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-[11px] font-bold text-red-600 tracking-wider uppercase flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
                      Lost Items ({matchingLost.length})
                    </div>
                    {matchingLost.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className="w-full text-left p-2 rounded-xl hover:bg-stone-50 flex items-center gap-3 transition-colors group"
                      >
                        <img
                          src={item.photoUrl || item.image}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                              {item.title}
                            </h4>
                            <span className="text-[11px] text-stone-400">{item.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-stone-400" />
                              {item.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3 text-stone-400" />
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                )}

                {matchingFound.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-[11px] font-bold text-emerald-600 tracking-wider uppercase flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      Found Items ({matchingFound.length})
                    </div>
                    {matchingFound.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className="w-full text-left p-2 rounded-xl hover:bg-stone-50 flex items-center gap-3 transition-colors group"
                      >
                        <img
                          src={item.photoUrl || item.image}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                              {item.title}
                            </h4>
                            <span className="text-[11px] text-stone-400">{item.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-stone-400" />
                              {item.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3 text-stone-400" />
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-slate-700">No matching items found</p>
                <p className="text-xs text-stone-500 mt-1">
                  Try checking spelling or search using another keyword like "keys", "wallet", or "library".
                </p>
              </div>
            )}
          </div>

          <div className="p-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={handleSearchSubmit}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Open in full Browse catalog <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-stone-400">
              {items.length} total active campus records
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
