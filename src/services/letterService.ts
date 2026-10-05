import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { LetterRecord } from '../types';

export function subscribeToUserLetters(
  userId: string,
  onLettersChanged: (letters: LetterRecord[]) => void
): Unsubscribe {
  const lettersRef = collection(db, 'letters');
  const q = query(lettersRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: LetterRecord[] = [];
      snapshot.forEach((d) => {
        records.push(d.data() as LetterRecord);
      });
      // Sort client-side by createdAt descending
      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onLettersChanged(records);
    },
    (error: any) => {
      if (
        error?.code === 'unavailable' ||
        error?.message?.includes('unavailable') ||
        error?.message?.includes('offline') ||
        error?.message?.includes('Could not reach')
      ) {
        console.warn('Firestore real-time sync is currently in offline-first mode.');
        return;
      }
      handleFirestoreError(error, OperationType.GET, 'letters');
    }
  );
}

export async function saveLetterToFirestore(
  userId: string,
  letter: LetterRecord
): Promise<void> {
  const letterDocRef = doc(db, 'letters', letter.id);
  const dataToSave = {
    ...letter,
    userId,
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(letterDocRef, dataToSave, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `letters/${letter.id}`);
  }
}

export async function deleteLetterFromFirestore(letterId: string): Promise<void> {
  const letterDocRef = doc(db, 'letters', letterId);
  try {
    await deleteDoc(letterDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `letters/${letterId}`);
  }
}
