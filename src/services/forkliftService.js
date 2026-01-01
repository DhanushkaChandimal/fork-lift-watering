import { addDoc, collection } from "firebase/firestore";
import { db } from '../lib/firebaseConfig';

const FORKLIFTS_COLLECTION = 'forklifts';

export const forkliftService = {
    createForklift: async (forkliftData) => {
        await addDoc(collection(db, FORKLIFTS_COLLECTION), forkliftData);
        return forkliftData;
    },
};