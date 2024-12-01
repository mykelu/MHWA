import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  MessageSquare,
  ClipboardList,
  Settings,
  History,
  FileText,
  Heart,
  BookOpen,
  Wind,
  Smile,
  Headphones,
  AlertTriangle,
  MessageCircle,
  PhoneCall,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { state: { user } } = useAuth();

  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Appointments', icon: Calendar, path: '/appointments' },
    { name: 'Mood Tracker', icon: Smile, path: '/wellness/mood' },
    { name: 'Journal', icon: BookOpen, path: '/wellness/journal' },
    { name: 'Breathing', icon: Wind, path: '/wellness/breathing' },
    { name: 'Crisis Support', icon: AlertTriangle, path: '/crisis-support' },
    { name: 'Chat Support', icon: MessageCircle, path: '/chat' },
    { name: 'Voice Support', icon: PhoneCall, path: '/voice-support' },
    { name: 'Community Forum', icon: Users, path: '/forum' },
    { name: 'Assessments', icon: ClipboardList, path: '/assessments' },
    { name: 'Assessment History', icon: History, path: '/assessments/history' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  if (!user) return null;

  return (
    <div
      className={`lg:hidden fixed inset-0 z-40 transform ease-in-out duration-300 ${
        isOpen
          ? 'translate-x-0 opacity-100 pointer-events-auto'
          : '-translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
      
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700">
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`
                }
                onClick={onClose}
              >
                <item.icon
                  className="mr-4 flex-shrink-0 h-6 w-6"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}