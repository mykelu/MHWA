import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Activity,
  Settings,
  Shield,
  DollarSign,
  UserCheck,
  FileText,
} from 'lucide-react';

export function AdminSidebar() {
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Therapist Verification', icon: UserCheck, path: '/admin/therapists' },
    { name: 'Content Approval', icon: FileCheck, path: '/admin/content' },
    { name: 'Analytics', icon: Activity, path: '/admin/analytics' },
    { name: 'Financial Reports', icon: DollarSign, path: '/admin/finance' },
    { name: 'Compliance Logs', icon: Shield, path: '/admin/compliance' },
    { name: 'Reports', icon: FileText, path: '/admin/reports' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-lg font-semibold text-white">Admin Portal</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-6 w-6"
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