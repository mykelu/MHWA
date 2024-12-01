import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ConsentRecord } from '../../types/consent';
import { getAllConsents, updateConsentStatus, consentEvents } from '../../services/api/consent';
import { CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

export function ConsentManagement() {
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    let mounted = true;

    const fetchConsents = async () => {
      try {
        const records = await getAllConsents({
          status: filters.status as any,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
        });
        if (mounted) {
          setConsents(records);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching consents:', error);
      }
    };

    fetchConsents();

    // Subscribe to real-time updates
    const unsubscribeSubmitted = consentEvents.on('consentSubmitted', (record) => {
      if (mounted) {
        setConsents(prev => [record, ...prev]);
      }
    });

    const unsubscribeUpdated = consentEvents.on('consentUpdated', (record) => {
      if (mounted) {
        setConsents(prev => prev.map(c => c.id === record.id ? record : c));
      }
    });

    return () => {
      mounted = false;
      unsubscribeSubmitted();
      unsubscribeUpdated();
    };
  }, [filters]);

  const handleStatusUpdate = async (consentId: string, status: 'approved' | 'rejected') => {
    try {
      await updateConsentStatus(consentId, status);
    } catch (error) {
      console.error('Error updating consent status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Consent Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor and manage guardian consent requests for minors
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />

          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Consent Records Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Minor Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Guardian
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Submitted
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {consents.map((consent) => (
                    <tr key={consent.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {consent.consentData.minorName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {consent.consentData.guardianName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getStatusBadge(consent.status)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(consent.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {consent.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(consent.id, 'approved')}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(consent.id, 'rejected')}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}