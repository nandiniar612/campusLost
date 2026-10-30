import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  ItemReport,
  ItemMatch,
  NotificationItem,
  PageView,
  ItemCategory,
  ItemStatus
} from '../types';
import {
  initialUsers,
  initialItems,
  initialMatches,
  initialNotifications
} from '../data/initialData';
import { saveItemToFirestore } from '../firebase';

interface AppContextType {
  currentUser: User | null;
  items: ItemReport[];
  matches: ItemMatch[];
  notifications: NotificationItem[];
  currentView: PageView;
  selectedItemId: string | null;
  searchQuery: string;
  categoryFilter: string;
  locationFilter: string;
  browseTab: 'lost' | 'found' | 'all';
  unreadCount: number;
  aiLoadingMatchId: string | null;
  isAiMatching: boolean;
  sidebarMobileOpen: boolean;
  setSidebarMobileOpen: (open: boolean) => void;
  
  // Actions
  setCurrentView: (view: PageView, itemId?: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setLocationFilter: (location: string) => void;
  setBrowseTab: (tab: 'lost' | 'found' | 'all') => void;
  
  isFirebaseConnected: boolean;
  
  login: (emailOrReg: string, passwordOrRole?: string, role?: 'student' | 'admin') => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  signup: (userData: Omit<User, 'id' | 'joinedDate'>, password?: string) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  logout: () => void;
  switchDemoUser: (role: 'student' | 'admin') => void;
  
  addLostItem: (item: Omit<ItemReport, 'id' | 'type' | 'status' | 'reporterId' | 'reporterName' | 'reporterEmail' | 'reporterRegNo' | 'createdAt'> & { id?: string }) => string;
  addFoundItem: (item: Omit<ItemReport, 'id' | 'type' | 'status' | 'reporterId' | 'reporterName' | 'reporterEmail' | 'reporterRegNo' | 'createdAt'> & { id?: string }) => string;
  updateItemStatus: (id: string, status: ItemStatus) => void;
  flagSuspicious: (id: string, reason: string) => void;
  resolveItem: (id: string) => void;
  
  markMatchNotAMatch: (matchId: string) => void;
  verifyMatch: (matchId: string) => void;
  analyzeMatchWithGemini: (matchId: string) => Promise<void>;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Claim modal helper
  claimModalItem: ItemReport | null;
  setClaimModalItem: (item: ItemReport | null) => void;
  submitClaim: (itemId: string, details: string, proof: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_ITEMS = 'campuslost_items_v2';
const STORAGE_KEY_MATCHES = 'campuslost_matches_v2';
const STORAGE_KEY_NOTIFS = 'campuslost_notifs_v2';
const STORAGE_KEY_USER = 'campuslost_user_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user (defaults to student Kavana M L from mockup)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return initialUsers[0];
  });

  // Items
  const [items, setItems] = useState<ItemReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return initialItems;
  });

  // Matches
  const [matches, setMatches] = useState<ItemMatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MATCHES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return initialMatches;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return initialNotifications;
  });

  // Navigation & filtering state
  const [currentView, setCurrentViewState] = useState<PageView>('home');
  const [selectedItemId, setSelectedItemId] = useState<string | null>('item_lost_1');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [browseTab, setBrowseTab] = useState<'lost' | 'found' | 'all'>('lost');
  const [claimModalItem, setClaimModalItem] = useState<ItemReport | null>(null);
  const [aiLoadingMatchId, setAiLoadingMatchId] = useState<string | null>(null);
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.warn(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));
    } catch (e) {
      console.warn(e);
    }
  }, [matches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.warn(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.warn(e);
    }
  }, [currentUser]);

  const setCurrentView = (view: PageView, itemId?: string | null) => {
    if (itemId !== undefined) {
      setSelectedItemId(itemId);
    }
    setCurrentViewState(view);
    setSidebarMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Matching evaluation between a new item and existing opposite items
  const findMatchesForNewItem = (newItem: ItemReport, allItems: ItemReport[]) => {
    const opposites = allItems.filter(it => it.type !== newItem.type && it.status !== 'Resolved' && it.status !== 'Rejected');
    const newMatches: ItemMatch[] = [];

    for (const opp of opposites) {
      const lost = newItem.type === 'lost' ? newItem : opp;
      const found = newItem.type === 'found' ? newItem : opp;

      let score = 0;
      const reasons: string[] = [];

      // Category match
      if (lost.category === found.category) {
        score += 45;
        reasons.push(`Category match (${lost.category})`);
      }

      // Proximity
      const loc1 = lost.location.toLowerCase();
      const loc2 = found.location.toLowerCase();
      if ((loc1.includes('library') && loc2.includes('library')) ||
          (loc1.includes('cafeteria') && loc2.includes('cafeteria')) ||
          (loc1.includes('cse') && loc2.includes('cse')) ||
          (loc1.includes('block') && loc2.includes('block'))) {
        score += 25;
        reasons.push(`Close vicinity (${lost.location} / ${found.location})`);
      }

      // Keyword match
      const words = lost.title.toLowerCase().split(' ').filter(w => w.length > 3);
      for (const w of words) {
        if (found.title.toLowerCase().includes(w) || found.description.toLowerCase().includes(w)) {
          score += 15;
          reasons.push(`Keyword match on "${w}"`);
          break;
        }
      }

      if (score >= 60) {
        const matchId = `match_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        newMatches.push({
          id: matchId,
          lostItemId: lost.id,
          foundItemId: found.id,
          lostItem: lost,
          foundItem: found,
          confidence: Math.min(97, score + 10),
          matchReason: reasons.join(' · '),
          status: 'potential',
          createdAt: new Date().toISOString(),
        });
      }
    }

    return newMatches;
  };

  const addLostItem = (itemData: Omit<ItemReport, 'id' | 'type' | 'status' | 'reporterId' | 'reporterName' | 'reporterEmail' | 'reporterRegNo' | 'createdAt'> & { id?: string }) => {
    const id = itemData.id || `lost_${Date.now()}`;
    const user = currentUser || initialUsers[0];
    const newItem: ItemReport = {
      ...itemData,
      id,
      type: 'lost',
      status: 'Pending',
      reporterId: user.id,
      reporterName: user.name,
      reporterEmail: user.email,
      reporterRegNo: user.regNo,
      createdAt: new Date().toISOString(),
    };

    const updated = [newItem, ...items];
    setItems(updated);

    // Save directly to Firestore if not already assigned a firestore doc id
    if (!itemData.id) {
      saveItemToFirestore(newItem).catch((err) => {
        console.warn('Firestore write notice:', err);
      });
    }

    // Look for matches
    const detected = findMatchesForNewItem(newItem, updated);
    if (detected.length > 0) {
      setMatches(prev => [...detected, ...prev]);
      // Add notification
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: user.id,
        title: 'New Possible Match Identified!',
        message: `Your lost report "${newItem.title}" correlates with ${detected.length} existing found report(s).`,
        type: 'match',
        read: false,
        date: 'Just now',
        relatedItemId: newItem.id,
        matchId: detected[0].id,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    return id;
  };

  const addFoundItem = (itemData: Omit<ItemReport, 'id' | 'type' | 'status' | 'reporterId' | 'reporterName' | 'reporterEmail' | 'reporterRegNo' | 'createdAt'> & { id?: string }) => {
    const id = itemData.id || `found_${Date.now()}`;
    const user = currentUser || initialUsers[0];
    const newItem: ItemReport = {
      ...itemData,
      id,
      type: 'found',
      status: 'Pending',
      reporterId: user.id,
      reporterName: user.name,
      reporterEmail: user.email,
      reporterRegNo: user.regNo,
      createdAt: new Date().toISOString(),
    };

    const updated = [newItem, ...items];
    setItems(updated);

    // Save directly to Firestore if not already assigned a firestore doc id
    if (!itemData.id) {
      saveItemToFirestore(newItem).catch((err) => {
        console.warn('Firestore write notice:', err);
      });
    }

    const detected = findMatchesForNewItem(newItem, updated);
    if (detected.length > 0) {
      setMatches(prev => [...detected, ...prev]);
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: user.id,
        title: 'Potential Owner Located!',
        message: `The item you turned in ("${newItem.title}") may belong to a student with an active lost report.`,
        type: 'match',
        read: false,
        date: 'Just now',
        relatedItemId: newItem.id,
        matchId: detected[0].id,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    return id;
  };

  const updateItemStatus = (id: string, status: ItemStatus) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, status };
        saveItemToFirestore(updatedItem).catch(() => {});
        return updatedItem;
      }
      return item;
    }));
    // Also notify reporter
    const it = items.find(i => i.id === id);
    if (it) {
      const notif: NotificationItem = {
        id: `notif_st_${Date.now()}`,
        userId: it.reporterId,
        title: `Report Status: ${status}`,
        message: `Your ${it.type} report for "${it.title}" has been updated to "${status}".`,
        type: 'status_update',
        read: false,
        date: 'Just now',
        relatedItemId: id,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const flagSuspicious = (id: string, reason: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, suspiciousFlag: true, suspiciousReason: reason } : item));
    // Admin alert
    const notif: NotificationItem = {
      id: `notif_flag_${Date.now()}`,
      userId: 'user_admin',
      title: 'Listing Flagged as Suspicious',
      message: `Item report #${id} was flagged by a student: "${reason}"`,
      type: 'admin_alert',
      read: false,
      date: 'Just now',
      relatedItemId: id,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const resolveItem = (id: string) => {
    updateItemStatus(id, 'Resolved');
    // Fire celebration confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#8B5CF6', '#10B981', '#F59E0B']
      });
    } catch {
      // ignore
    }
  };

  const markMatchNotAMatch = (matchId: string) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const verifyMatch = (matchId: string) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'verified' } : m));
  };

  const analyzeMatchWithGemini = async (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    setAiLoadingMatchId(matchId);
    setIsAiMatching(true);

    try {
      const res = await fetch('/api/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lostItem: match.lostItem,
          foundItem: match.foundItem,
        }),
      });

      if (!res.ok) throw new Error('AI analysis service error');
      const data = await res.json();

      setMatches(prev => prev.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            confidence: data.confidence || m.confidence,
            matchReason: data.matchReason || m.matchReason,
            aiAnalysis: data.aiAnalysis,
            verificationQuestions: data.verificationQuestions,
          };
        }
        return m;
      }));
    } catch (err) {
      console.warn('Fallback to local intelligence:', err);
      setMatches(prev => prev.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            aiAnalysis: `Heuristic AI Assessment: High correlation across category (${match.lostItem.category}), matching color schemes, and geographical proximity between ${match.lostItem.location} and ${match.foundItem.location}.`,
            verificationQuestions: [
              'Can you state any serial number or identification card name inside?',
              'What specific marks, scuffs, or charms are attached to this item?',
              'On what exact hour did you lose contact with the item?'
            ],
          };
        }
        return m;
      }));
    } finally {
      setAiLoadingMatchId(null);
      setIsAiMatching(false);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const login = async (
    emailOrReg: string,
    passwordOrRole?: string,
    roleParam?: 'student' | 'admin'
  ): Promise<{ success: boolean; error?: string }> => {
    const role = (roleParam || (passwordOrRole === 'admin' ? 'admin' : 'student')) as 'student' | 'admin';
    const found = initialUsers.find(
      u => u.email.toLowerCase() === emailOrReg.toLowerCase() ||
           u.regNo.toLowerCase() === emailOrReg.toLowerCase() ||
           u.role === role
    );
    if (found) {
      setCurrentUser(found);
      return { success: true };
    }
    // Generic fallback user
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: emailOrReg.split('@')[0] || 'Campus Student',
      email: emailOrReg.includes('@') ? emailOrReg : `${emailOrReg}@campus.edu`,
      regNo: emailOrReg.includes('@') ? 'CSE24001' : emailOrReg.toUpperCase(),
      role: role,
      department: 'Computer Science & Engineering',
      joinedDate: 'October 2026',
    };
    setCurrentUser(newUser);
    return { success: true };
  };

  const signup = async (
    userData: Omit<User, 'id' | 'joinedDate'>,
    _password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      joinedDate: 'October 2026',
    };
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const switchDemoUser = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(initialUsers[1]); // Officer Sharma
      setCurrentView('admin-dashboard');
    } else {
      setCurrentUser(initialUsers[0]); // Kavana M L
      setCurrentView('student-dashboard');
    }
  };

  const submitClaim = (itemId: string, details: string, proof: string) => {
    // Notify admin
    const targetItem = items.find(i => i.id === itemId);
    const notif: NotificationItem = {
      id: `claim_${Date.now()}`,
      userId: 'user_admin',
      title: `Ownership Claim Submitted for ${targetItem?.title || 'Item'}`,
      message: `${currentUser?.name} (${currentUser?.regNo}) submitted a claim: "${details}". Proof provided: "${proof}".`,
      type: 'admin_alert',
      read: false,
      date: 'Just now',
      relatedItemId: itemId,
    };
    setNotifications(prev => [notif, ...prev]);
    setClaimModalItem(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        items,
        matches,
        notifications,
        currentView,
        selectedItemId,
        searchQuery,
        categoryFilter,
        locationFilter,
        browseTab,
        unreadCount,
        aiLoadingMatchId,
        isAiMatching,
        sidebarMobileOpen,
        setSidebarMobileOpen,
        setCurrentView,
        setSearchQuery,
        setCategoryFilter,
        setLocationFilter,
        setBrowseTab,
        isFirebaseConnected: true,
        login,
        signup,
        logout,
        switchDemoUser,
        addLostItem,
        addFoundItem,
        updateItemStatus,
        flagSuspicious,
        resolveItem,
        markMatchNotAMatch,
        verifyMatch,
        analyzeMatchWithGemini,
        markNotificationRead,
        markAllNotificationsRead,
        claimModalItem,
        setClaimModalItem,
        submitClaim,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
