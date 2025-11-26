import React, { useEffect, useState } from 'react';
import { Users, MessageSquare, Layers, TrendingUp } from 'lucide-react';
import chatService from '../../services/chatService';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const AdminDashboard = () => {
  const [conversations, setConversations] = useState(null);
  const [categoriesCount, setCategoriesCount] = useState(null);
  const [usersCount, setUsersCount] = useState(null);

  useEffect(() => {
    let mounted = true;

    // fetch categories
    chatService
      .getCategories()
      .then((cats) => {
        if (!mounted) return;
        setCategoriesCount(Array.isArray(cats) ? cats.length : 0);
      })
      .catch(() => mounted && setCategoriesCount(0));

    // fetch chat history (messages) and derive unique sessions
    chatService
      .getChatHistory()
      .then((msgs) => {
        if (!mounted) return;
        if (!Array.isArray(msgs)) return setConversations(0);
        const sessionIds = new Set();
        msgs.forEach((m) => {
          // message.session may be nested
          if (m && m.session && (m.session.sessionId || m.session.sessionId === 0)) {
            sessionIds.add(m.session.sessionId);
          } else if (m && m.sessionId) {
            sessionIds.add(m.sessionId);
          }
        });
        setConversations(sessionIds.size);
      })
      .catch(() => mounted && setConversations(0));

    // fetch users
    axios
      .get(`${API_BASE_URL}/users`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data;
        setUsersCount(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => mounted && setUsersCount(0));

    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    {
      title: 'Total Conversations',
      value: conversations === null ? '…' : conversations,
      change: '+0%',
      icon: MessageSquare,
      color: 'bg-red-100',
      textColor: 'text-red-700',
    },
    {
      title: 'Categories',
      value: categoriesCount === null ? '…' : categoriesCount,
      change: '+0%',
      icon: Layers,
      color: 'bg-amber-100',
      textColor: 'text-amber-700',
    },
    {
      title: 'Active Users',
      value: usersCount === null ? '…' : usersCount,
      change: '+0%',
      icon: Users,
      color: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Performance',
      value: '100%',
      change: 'Optimal',
      icon: TrendingUp,
      color: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon size={24} className={stat.textColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                📝
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">System started</p>
                <p className="text-sm text-gray-500">Just now</p>
              </div>
            </div>
            <div className="text-center py-8 text-gray-500">
              <p>No activities yet</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-gray-600">Version</span>
              <span className="text-gray-900 font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-gray-600">Uptime</span>
              <span className="text-gray-900 font-medium">24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
