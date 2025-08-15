import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Menu, Bell, User, Settings, Home, BarChart3 } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigationItems = [
    { name: 'Dashboard', icon: Home, href: '/', active: true },
    { name: 'Tasks', icon: CheckSquare, href: '/tasks', active: false },
    { name: 'Analytics', icon: BarChart3, href: '/analytics', active: false },
    { name: 'Settings', icon: Settings, href: '/settings', active: false },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      display: 'block',
    },
    closed: {
      opacity: 0,
      transitionEnd: {
        display: 'none',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <motion.div
        variants={overlayVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <CheckSquare className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TaskPro</span>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* User profile */}
          <div className="border-t border-gray-200 p-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </motion.button>
              <h1 className="ml-4 lg:ml-0 text-2xl font-semibold text-gray-900">
                Task Management
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </motion.button>

              {/* User menu */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
              >
                <User className="h-5 w-5 text-blue-600" />
              </motion.div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="py-6 px-4 sm:px-6 lg:px-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;