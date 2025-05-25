import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

function Dashboard() {
  const [showFilters, setShowFilters] = useState(false);

  // Dummy data for demonstration
  const trips = [
    { id: 1, title: 'Summer in Paris', date: '2025-07-15', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34' },
    { id: 2, title: 'Tokyo Adventure', date: '2025-08-22', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc' },
    // Add more dummy trips as needed
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className={`md:w-64 bg-white rounded-lg shadow-sm p-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <h2 className="font-poppins font-semibold text-lg mb-4">Filters</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <input
              type="date"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="Search destinations"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trip Status
            </label>
            <select className="input w-full">
              <option value="">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <h1 className="text-2xl font-poppins font-bold text-gray-900">
            My Trips
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn bg-white border border-gray-200 hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
            <Link to="/trips/new" className="btn btn-primary inline-flex items-center">
              <PlusIcon className="h-5 w-5 mr-1" />
              New Trip
            </Link>
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              to={`/trips/${trip.id}`}
              className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-video w-full bg-gray-200">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-poppins font-semibold text-gray-900">
                  {trip.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(trip.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </Link>
          ))}

          {/* Add Trip Card */}
          <Link
            to="/trips/new"
            className="flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-6 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <PlusIcon className="h-8 w-8 text-gray-400" />
            <span className="mt-2 font-medium text-gray-600">
              Create New Trip
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
