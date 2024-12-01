import React from 'react';
import { MapPin } from 'lucide-react';
import { EmergencyResource } from '../../types/emergency';
import { useNearbyResources } from '../../hooks/useNearbyResources';

export function ResourceMap() {
  const { resources, loading, error } = useNearbyResources();

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Unable to load nearby resources</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Nearby Support Resources</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {resources.map((resource: EmergencyResource) => (
          <div
            key={resource.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{resource.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{resource.address}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">{resource.phone}</p>
                  <p className="text-sm text-gray-600">{resource.distance} miles away</p>
                </div>
                <div className="mt-3">
                  <a
                    href={resource.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}