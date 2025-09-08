import React, { useState } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { ListingCard } from './ListingCard';
import { FilterPanel } from './FilterPanel';
import { listings } from '../data/mockData';
import { Listing, SearchFilters } from '../types';

interface HomePageProps {
  selectedCategory: string;
}

export function HomePage({ selectedCategory }: HomePageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: selectedCategory,
    priceMin: 0,
    priceMax: 0,
    distance: 25,
    sortBy: 'newest',
    condition: [],
  });

  // Filter and sort listings
  const filteredListings = listings
    .filter((listing) => {
      if (selectedCategory && listing.category !== selectedCategory) return false;
      if (filters.priceMin > 0 && listing.price < filters.priceMin) return false;
      if (filters.priceMax > 0 && listing.price > filters.priceMax) return false;
      if (filters.condition.length > 0 && !filters.condition.includes(listing.condition)) return false;
      if (listing.location.distance && listing.location.distance > filters.distance) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case 'nearest':
          return (a.location.distance || 0) - (b.location.distance || 0);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const handleSave = (listingId: string) => {
    // In a real app, this would update the backend
    console.log('Saved listing:', listingId);
  };

  const handleMessage = (listing: Listing) => {
    // In a real app, this would open the messaging interface
    console.log('Message seller for:', listing.title);
  };

  const handleListingClick = (listing: Listing) => {
    // In a real app, this would navigate to the listing detail page
    console.log('View listing:', listing.title);
  };

  return (
    <div className="flex-1 flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Items` : 'All Items'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredListings.length} items found
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>

            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded-l-lg`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded-r-lg border-l border-gray-300 dark:border-gray-600`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onSave={handleSave}
              onMessage={handleMessage}
              onClick={handleListingClick}
            />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No items found matching your criteria.</p>
            <button
              onClick={() => setFilters({ ...filters, priceMin: 0, priceMax: 0, condition: [] })}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
}
