import { Menu, Bell, Sprout } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-x-2 sm:gap-x-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-md px-3 sm:px-4 shadow-sm lg:px-8 transition-all duration-300">
      <button
        type="button"
        className="-m-2 p-2 text-gray-700 lg:hidden hover:text-primary-600 transition-colors touch-target"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center gap-1.5 sm:gap-2">
          <div className="bg-primary-600 p-1 sm:p-1.5 rounded-lg shadow-sm">
            <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent tracking-tight truncate">
            Kisan Mitra
          </h1>
        </div>
        <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2 p-2 text-gray-500 hover:text-primary-600 transition-colors relative touch-target">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />
          <div className="flex items-center gap-x-2 sm:gap-x-4 lg:flex">
            <div className="flex items-center gap-x-2 sm:gap-x-3">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                <UserButton afterSignOutUrl="/login" />
                <span className="hidden lg:flex lg:items-center">
                  <span className="text-sm font-semibold leading-6 text-gray-700 truncate max-w-[120px]" aria-hidden="true">
                    {user?.firstName || 'Farmer'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
