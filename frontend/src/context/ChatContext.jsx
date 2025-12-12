import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // Auth / user state
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // API base (use env var in prod)
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // ---- Auth: fetchUser / reloadUser / logout ----
  const fetchUser = useCallback(async () => {
    setLoadingUser(true);
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        credentials: 'include',
        headers: { Accept: 'application/json' }
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok) {
        const text = await res.text().catch(() => '[no body]');
        console.error('fetchUser: non-ok', res.status, text);
        setUser(null);
        setLoadingUser(false);
        return null;
      }

      if (contentType.includes('application/json')) {
        const json = await res.json();
        setUser(json.user || null);
        setLoadingUser(false);
        return json.user || null;
      } else {
        const txt = await res.text().catch(() => '[no body]');
        console.error('fetchUser: unexpected content-type', contentType, txt);
        setUser(null);
        setLoadingUser(false);
        return null;
      }
    } catch (err) {
      console.error('fetchUser error', err);
      setUser(null);
      setLoadingUser(false);
      return null;
    }
  }, [API]);

  const reloadUser = useCallback(() => fetchUser(), [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.warn('logout failed', e);
    } finally {
      setUser(null);
      setLoadingUser(false);
    }
  }, [API]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ---- Messages + Error helpers ----
  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // expose both names used across the codebase:
  const setErrorMessage = useCallback((errorMsg) => {
    setError(errorMsg);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // value exported to consumers
  const value = {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    selectedCategory,
    setSelectedCategory,
    categories,
    setCategories,
    error,
    setErrorMessage, // older name
    setError,        // direct setter if some components use it
    clearError,      // the missing function your chat component expects
    addMessage,
    clearMessages,

    // Auth / user API for components
    user,
    loadingUser,
    reloadUser,
    logout,
    setUser,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
