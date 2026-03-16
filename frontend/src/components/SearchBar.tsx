import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState('2');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Navigate to packages page with search query
    if (destination.trim()) {
      navigate(`/packages?search=${encodeURIComponent(destination.trim())}`);
    } else {
      navigate('/packages');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSearch} className="bg-white rounded-2xl md:rounded-full shadow-2xl p-3 md:p-2 md:pl-6 animate-fade-in flex flex-col md:flex-row items-center gap-0 border border-gray-100 divide-y md:divide-y-0 relative">

        {/* Destination Field */}
        <div className="flex-1 w-full relative group pb-3 md:pb-0 px-2 md:px-0">
          <div className="flex items-center">
            <div className="p-3 bg-gray-50 rounded-full text-secondary-400 group-focus-within:bg-primary-50 group-focus-within:text-primary-600 transition-colors">
              <MapPinIcon className="h-6 w-6" />
            </div>
            <div className="ml-4 flex-1">
              <label htmlFor="destination" className="block text-xs font-bold text-secondary-800 uppercase tracking-wider mb-0.5">
                Location
              </label>
              <input
                id="destination"
                type="text"
                placeholder="Where are you going?"
                className="w-full bg-transparent border-none p-0 text-secondary-900 placeholder-secondary-400 focus:ring-0 font-medium text-lg leading-tight truncate"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Divider Desktop */}
        <div className="hidden md:block w-px h-10 bg-gray-200 mx-4"></div>

        {/* Guests Field */}
        <div className="flex-1 w-full relative group pt-3 md:pt-0 px-2 md:px-0">
          <div className="flex items-center">
            <div className="p-3 bg-gray-50 rounded-full text-secondary-400 group-focus-within:bg-primary-50 group-focus-within:text-primary-600 transition-colors">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div className="ml-4 flex-1">
              <label htmlFor="guests" className="block text-xs font-bold text-secondary-800 uppercase tracking-wider mb-0.5">
                Guests
              </label>
              <select
                id="guests"
                className="w-full bg-transparent border-none p-0 text-secondary-900 focus:ring-0 font-medium text-lg leading-tight appearance-none cursor-pointer"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl md:rounded-full py-3.5 md:py-4 md:px-8 mt-3 md:mt-0 shadow-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-105 md:ml-2 font-bold md:font-normal"
        >
          <MagnifyingGlassIcon className="h-5 w-5 md:h-6 md:w-6 group-hover:rotate-90 transition-transform duration-300" />
          <span className="md:hidden">Search Packages</span>
        </button>
      </form>

      {/* Quick Search Options */}
      <div className="mt-5 md:mt-6 flex flex-wrap justify-center gap-2 md:gap-3 animate-fade-in animation-delay-200 px-2">
        <span className="text-white/80 text-sm font-medium py-1">Popular:</span>
        {['Bali', 'Paris', 'Tokyo', 'Swiss Alps', 'Dubai'].map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setDestination(city)}
            className="px-4 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full text-sm transition-all duration-300 hover:scale-105 hover:border-white/40"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
