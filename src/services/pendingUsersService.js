import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

const PENDING_USERS_COLLECTION = 'pendingUsers';
const MAX_PENDING_USERS = 10;

export const pendingUsersService = {
    // Check if pending pool is full
    isPendingPoolFull: async () => {
        const querySnapshot = await getDocs(collection(db, PENDING_USERS_COLLECTION));
        return querySnapshot.size >= MAX_PENDING_USERS;
    },

    // Add user to pending pool
    addPendingUser: async (userData) => {
        const isFull = await pendingUsersService.isPendingPoolFull();
        if (isFull) {
            throw new Error('Registration pool is full. Please try again later.');
        }

        const docRef = await addDoc(collection(db, PENDING_USERS_COLLECTION), {
            ...userData,
            requestedAt: new Date().toISOString(),
            status: 'pending'
        });
        return docRef.id;
    },

    // Get all pending users
    getAllPendingUsers: async () => {
        const querySnapshot = await getDocs(collection(db, PENDING_USERS_COLLECTION));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    // Remove user from pending pool
    removePendingUser: async (userId) => {
        await deleteDoc(doc(db, PENDING_USERS_COLLECTION, userId));
    },

    // Get pending user by email
    getPendingUserByEmail: async (email) => {
        const querySnapshot = await getDocs(collection(db, PENDING_USERS_COLLECTION));
        const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return users.find(user => user.email === email);
    }
};
