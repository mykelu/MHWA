import React, { useState } from 'react';
import { Menu, Bell, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state: { user } } = useAuth();

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
              <Link to="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600 ml-2">MindWell</h1>
              </Link>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <Link 
                to="/crisis-support" 
                className="text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-md text-sm"
              >
                Crisis Support
              </Link>
              <Link 
                to="/chat" 
                className="text-indigo-600 hover:text-indigo-700 font-medium px-3 py-2 rounded-md text-sm"
              >
                Chat Support
              </Link>
              <Link 
                to="/forum" 
                className="text-indigo-600 hover:text-indigo-700 font-medium px-3 py-2 rounded-md text-sm"
              >
                Community
              </Link>
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
              <UserMenu />
            </div>
          )}
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}