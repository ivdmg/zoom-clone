import { collection, getDocs, query, where } from 'firebase/firestore';
import { firebaseDB } from '../utils/FirebaseConfig';

export interface User {
  uid: string;
  name: string;
  email: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    console.log('Fetching all users from database');
    const usersRef = collection(firebaseDB, 'users');
    const snapshot = await getDocs(usersRef);
    
    const users: User[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: data.uid,
        name: data.name || 'Unknown User',
        email: data.email || '',
      };
    });
    
    console.log('Found users:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (uid: string): Promise<User | null> => {
  try {
    console.log('Fetching user by ID:', uid);
    const usersRef = collection(firebaseDB, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    const snapshot = await getDocs(q);
    
    if (snapshot.docs.length > 0) {
      const data = snapshot.docs[0].data();
      const user: User = {
        uid: data.uid,
        name: data.name || 'Unknown User',
        email: data.email || '',
      };
      console.log('Found user:', user);
      return user;
    }
    
    console.log('User not found');
    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};
