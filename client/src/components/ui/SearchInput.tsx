import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  delay?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value = '',
  onChange,
  placeholder = 'Search applications...',
  className,
  delay = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    onChange(debouncedTerm);
  }, [debouncedTerm]);

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 transition-colors"
      />
      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm('');
            onChange('');
          }}
          className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
