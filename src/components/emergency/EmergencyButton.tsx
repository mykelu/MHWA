import React, { useState } from 'react';
import { AlertCircle, Phone, X } from 'lucide-react';
import { useEmergencyContacts } from '../../hooks/useEmergencyContacts';
import { EmergencyHotline } from '../../types/emergency';
import { sendEmergencyAlert } from '../../services/emergency';

export function EmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { contacts, hotlines } = useEmergencyContacts();

  const handleEmergencyAlert = async () => {
    try {
      setIsSending(true);
      await sendEmergencyAlert(contacts);
      // Show success message
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-105"
        aria-label="Emergency Help"
      >
        <AlertCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Emergency Support</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  If you're in immediate danger, please call emergency services (911) directly.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Crisis Hotlines</h3>
                {hotlines.map((hotline: EmergencyHotline) => (
                  <a
                    key={hotline.id}
                    href={`tel:${hotline.number}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{hotline.name}</p>
                      <p className="text-sm text-gray-500">{hotline.description}</p>
                    </div>
                    <Phone className="h-5 w-5 text-gray-400" />
                  </a>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleEmergencyAlert}
                  disabled={isSending}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isSending ? 'Sending Alert...' : 'Alert Emergency Contacts'}
                </button>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  This will notify your designated emergency contacts with your current location
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}