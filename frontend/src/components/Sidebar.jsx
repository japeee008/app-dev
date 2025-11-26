import React from 'react';
import { X, Plus, MessageSquare, Settings } from 'lucide-react';

const Sidebar = ({
  isOpen,
  onClose,
  onNewChat,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static md:translate-x-0 w-64 h-screen bg-gray-900 text-white transition-transform duration-300 ease-in-out z-50 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Chats</h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-gray-800 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => {
            onNewChat();
            onClose();
          }}
          className="m-4 flex items-center justify-center gap-2 w-auto bg-red-700 hover:bg-red-800 rounded-lg px-4 py-3 font-medium transition-colors"
        >
          <Plus size={20} />
          New Chat
        </button>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          <div className="py-2">
            <p className="text-xs font-semibold text-gray-400 mb-3">
              CHAT HISTORY
            </p>
            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-left">
              <MessageSquare size={18} />
              <span className="truncate text-sm">Today</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-left">
              <MessageSquare size={18} />
              <span className="truncate text-sm">Yesterday</span>
            </button>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="py-4 border-t border-gray-800">
              <p className="text-xs font-semibold text-gray-400 mb-3">
                CATEGORIES
              </p>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onSelectCategory(category);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory?.id === category.id
                      ? 'bg-red-700 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <span className="text-sm">{category.categoryName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="border-t border-gray-800 p-4">
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
