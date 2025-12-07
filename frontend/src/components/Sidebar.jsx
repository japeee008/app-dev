import React, { useState, useRef, useEffect } from "react";
import { X, Plus, MessageSquare, Settings, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  isOpen,
  onClose,
  onNewChat,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsRef = useRef(null);
  const navigate = useNavigate();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static md:translate-x-0 w-64 h-screen bg-primary text-white transition-transform duration-300 ease-in-out z-50 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center p-9 border-b border-primary">
          <img
            src="/wildcare.jpg"
            alt="WildCare Logo"
            className="h-15 w-15 object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => {
            onNewChat();
            onClose();
          }}
          className="m-5 flex items-center justify-center gap-2 bg-secondary hover:bg-gray-50 text-black rounded-lg px-3 py-3 font-medium transition-colors"
        >
          <Plus size={20} />
          New Chat
        </button>

        {/* Scrollable middle section */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
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
                      ? "bg-red-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <span className="text-sm">{category.categoryName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SETTINGS + POPUP */}
        <div className="border-t border-primary p-4 relative" ref={settingsRef}>
          {/* Settings Button */}
          <button
            onClick={() => setShowSettingsMenu((prev) => !prev)}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>

          {/* Popup Menu */}
          {showSettingsMenu && (
            <div className="absolute bottom-14 left-4 w-56 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 py-2 z-50 animate-fadeIn">
              <button
                onClick={() => {
                  setShowSettingsMenu(false);
                  navigate("/admin-login");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-sm text-left"
              >
                <UserCog size={16} className="text-white" />
                <span>Admin Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
