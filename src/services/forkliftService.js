import { addDoc, collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db } from '../lib/firebaseConfig';

const FORKLIFTS_COLLECTION = 'forklifts';

export const forkliftService = {
    getAllForklifts: async () => {
        const querySnapshot = await getDocs(collection(db, FORKLIFTS_COLLECTION));
        const forkliftList = querySnapshot.docs.map(doc => ({
            id: doc.data().id || doc.id,
            docId: doc.id,
            ...doc.data()
        }));
        return forkliftList;
    },

    createForklift: async (forkliftData) => {
        const existingForklift = await getDocs(
            query(collection(db, FORKLIFTS_COLLECTION), where('id', '==', forkliftData.id))
        );
        
        if (!existingForklift.empty) {
            throw new Error(`Forklift #${forkliftData.id} already exists`);
        }
        
        await addDoc(collection(db, FORKLIFTS_COLLECTION), forkliftData);
        return forkliftData;
    },

    updateForklift: async ({ docId, updates }) => {
        const querySnapshot = await getDocs(
            query(collection(db, FORKLIFTS_COLLECTION), where('__name__', '==', docId))
        );
        
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, updates);
        }
        
        return { docId, ...updates };
    },
};