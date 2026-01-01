import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

const REGISTERED_USERS_COLLECTION = 'registeredUsers';

export const userService = {
    // Check if email is already registered by querying Firestore
    isEmailRegistered: async (email) => {
        try {
            const q = query(
                collection(db, REGISTERED_USERS_COLLECTION),
                where('email', '==', email.toLowerCase().trim())
            );
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error('Error checking email registration:', error);
            return false;
        }
    },

    // Store registered user email in Firestore for tracking
    addRegisteredUser: async (email, displayName, uid) => {
        // This will be called from AdminPanel when approving users
        await addDoc(collection(db, REGISTERED_USERS_COLLECTION), {
            email: email.toLowerCase().trim(),
            displayName: displayName,
            uid: uid,
            registeredAt: new Date().toISOString()
        });
    }
};
