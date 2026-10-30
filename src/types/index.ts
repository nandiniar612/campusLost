export type ItemType = 'lost' | 'found';

export type ItemCategory =
  | 'Electronics'
  | 'Bags & Wallets'
  | 'Books & Stationery'
  | 'Clothing'
  | 'Accessories'
  | 'ID Cards'
  | 'Keys'
  | 'Others';

export type ItemStatus =
  | 'Pending'
  | 'Verified'
  | 'In Progress'
  | 'Matched'
  | 'Resolved'
  | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  regNo: string;
  role: 'student' | 'admin' | 'faculty' | 'staff';
  department: string;
  phone?: string;
  avatar?: string;
  hostelOrDay?: string;
  joinedDate: string;
}

export interface ItemReport {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  location: string;
  date: string; // e.g. "2025-09-12"
  displayDate?: string; // e.g. "12 Sep 2025"
  photoUrl?: string;
  image?: string;
  status: ItemStatus;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reporterRegNo: string;
  color?: string;
  brand?: string;
  additionalDetails?: string;
  turnedInLocation?: string;
  custodyLocation?: string;
  deskLocation?: string;
  suspiciousFlag?: boolean;
  suspiciousReason?: string;
  createdAt: string;
}

export interface ItemMatch {
  id: string;
  lostItemId: string;
  foundItemId: string;
  lostItem: ItemReport;
  foundItem: ItemReport;
  confidence: number; // 0 - 100
  matchReason: string;
  status: 'potential' | 'verified' | 'dismissed' | 'reunited';
  aiAnalysis?: string;
  verificationQuestions?: string[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'status_update' | 'admin_alert' | 'system';
  read: boolean;
  date: string;
  relatedItemId?: string;
  matchId?: string;
}

export interface ClaimRequest {
  id: string;
  itemId: string;
  claimantId: string;
  claimantName: string;
  claimantRegNo: string;
  claimantPhone: string;
  identifyingProof: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export type PageView =
  | 'home'
  | 'login'
  | 'signup'
  | 'student-dashboard'
  | 'report-lost'
  | 'report-found'
  | 'browse'
  | 'matches'
  | 'item-details'
  | 'about'
  | 'admin-dashboard'
  | 'profile';
