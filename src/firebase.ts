import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import appletConfig from '../firebase-applet-config.json';
import { ItemReport } from './types';

// User-provided configuration with project fallback
export const firebaseConfig = {
  apiKey: appletConfig.apiKey || "AIzaSyDxKImSaYLzyR8ymJqRmpQs3e1RLRZyVZ8",
  authDomain: appletConfig.authDomain || "campuslost-3602c.firebaseapp.com",
  projectId: appletConfig.projectId || "campuslost-3602c",
  storageBucket: appletConfig.storageBucket || "campuslost-3602c.firebasestorage.app",
  messagingSenderId: appletConfig.messagingSenderId || "1000046339771",
  appId: appletConfig.appId || "1:1000046339771:web:e780dd2782dd2c0f176b9e",
};

// Initialize Firebase App singleton
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (utilizing custom provisioned databaseId if provided or default)
export const db: Firestore = appletConfig.firestoreDatabaseId
  ? getFirestore(firebaseApp, appletConfig.firestoreDatabaseId)
  : getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

// Connection test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Client offline; Firestore persistence active in offline mode.");
    } else {
      console.info("Firestore connection test ping finished.");
    }
    return false;
  }
}

// Run connection test on init
testFirestoreConnection();

/**
 * Persists an item report directly to Firestore
 */
export async function saveItemToFirestore(item: ItemReport): Promise<{ success: boolean; id: string; error?: string }> {
  const path = `items/${item.id}`;
  try {
    const itemRef = doc(db, 'items', item.id);
    // Sanitize item payload ensuring non-undefined values
    const payload: Record<string, any> = {
      id: item.id,
      type: item.type,
      title: item.title,
      category: item.category,
      description: item.description,
      location: item.location,
      date: item.date,
      displayDate: item.displayDate || item.date,
      status: item.status,
      photoUrl: item.photoUrl || '',
      reporterId: item.reporterId || 'student_guest',
      reporterName: item.reporterName || 'Anonymous Student',
      reporterEmail: item.reporterEmail || '',
      reporterRegNo: item.reporterRegNo || '',
      color: item.color || '',
      brand: item.brand || '',
      additionalDetails: item.additionalDetails || '',
      custodyLocation: item.custodyLocation || '',
      turnedInLocation: item.turnedInLocation || '',
      createdAt: item.createdAt || new Date().toISOString(),
    };

    await setDoc(itemRef, payload);
    console.log(`[Firestore] Successfully saved ${item.type} report: ${item.id}`);
    return { success: true, id: item.id };
  } catch (error) {
    const handled = handleFirestoreError(error, OperationType.WRITE, path);
    return { success: false, id: item.id, error: handled.error };
  }
}

/**
 * Loads recent items from Firestore if available
 */
export async function loadItemsFromFirestore(): Promise<ItemReport[] | null> {
  try {
    const snapshot = await getDocs(collection(db, 'items'));
    if (!snapshot.empty) {
      const remoteItems: ItemReport[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        remoteItems.push(data as ItemReport);
      });
      return remoteItems;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'items');
    return null;
  }
}
