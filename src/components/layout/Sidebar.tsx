import React from 'react';
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
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/permissions';

const getNavigationItems = (role: string) => [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Appointments', icon: Calendar, path: '/appointments' },
  { 
    name: 'Wellness', 
    icon: Heart, 
    path: '/wellness',
    children: [
      { name: 'Mood Tracker', icon: Smile, path: '/wellness/mood' },
      { name: 'Journal', icon: BookOpen, path: '/wellness/journal' },
      { name: 'Breathing', icon: Wind, path: '/wellness/breathing' },
    ]
  },
  { 
    name: 'Support', 
    icon: Headphones, 
    path: '/support',
    children: [
      { name: 'Crisis Support', icon: AlertTriangle, path: '/crisis-support' },
      { name: 'Chat Support', icon: MessageCircle, path: '/chat' },
      { name: 'Voice Support', icon: PhoneCall, path: '/voice-support' },
      { name: 'Community Forum', icon: Users, path: '/forum' },
    ]
  },
  { 
    name: 'Assessments', 
    icon: ClipboardList, 
    path: '/assessments',
    children: [
      { name: 'Take Assessment', icon: FileText, path: '/assessments' },
      { name: 'Assessment History', icon: History, path: '/assessments/history' }
    ]
  },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { state: { user } } = useAuth();
  const navigation = getNavigationItems(user?.role || 'adult');

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isActiveChild = (parentPath: string, childPath: string) => {
    return location.pathname === childPath && location.pathname.startsWith(parentPath);
  };

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-indigo-700 pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <div className={`group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-white hover:bg-indigo-600 w-full ${
                      isActiveRoute(item.path) ? 'bg-indigo-800' : ''
                    }`}>
                      <item.icon className="mr-4 flex-shrink-0 h-6 w-6" />
                      {item.name}
                    </div>

                    {isActiveRoute(item.path) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.path}
                            className={`group flex items-center px-2 py-1.5 text-sm leading-5 font-medium rounded-md text-indigo-100 hover:bg-indigo-600 w-full ${
                              isActiveChild(item.path, child.path) ? 'bg-indigo-800' : ''
                            }`}
                          >
                            <child.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-white hover:bg-indigo-600 w-full ${
                      isActiveRoute(item.path) ? 'bg-indigo-800' : ''
                    }`}
                  >
                    <item.icon className="mr-4 flex-shrink-0 h-6 w-6" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}