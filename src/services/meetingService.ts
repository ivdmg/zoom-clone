import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { firebaseDB } from '../utils/FirebaseConfig';
import type { Meeting } from '../types/meeting';
import { generateMeetingId } from '../utils/meetingIdGenerator';

export const createMeeting = async (meetingData: Omit<Meeting, 'meetingId' | 'createdAt'>): Promise<string> => {
  try {
    console.log('Starting createMeeting function');
    console.log('Input meetingData:', meetingData);
    
    const meetingId = generateMeetingId();
    console.log('Generated meetingId:', meetingId);
    
    const meeting = {
      ...meetingData,
      meetingId, 
      createdAt: new Date(),
    };

    console.log('Final meeting object:', meeting);
    console.log('Firebase DB instance:', firebaseDB);

    const docRef = await addDoc(collection(firebaseDB, 'meetings'), {
      ...meeting,
      createdAt: serverTimestamp(),
    });

    console.log('Document created with ID:', docRef.id);
    return docRef.id; 
  } catch (error) {
    console.error('Error in createMeeting:', error);
    throw error;
  }
};

export const updateMeeting = async (meetingId: string, meetingData: Partial<Meeting>): Promise<void> => {
  try {
    console.log('Starting updateMeeting function');
    console.log('Meeting ID (Firebase document ID):', meetingId);
    console.log('Update data:', meetingData);
    
    const meetingRef = doc(firebaseDB, 'meetings', meetingId);
    console.log('Meeting reference:', meetingRef);
    
    const updateData = {
      ...meetingData,
      updatedAt: serverTimestamp(),
    };
    console.log('Final update data:', updateData);
    
    await updateDoc(meetingRef, updateData);

    console.log('Meeting updated successfully');
  } catch (error) {
    console.error('Error in updateMeeting:', error);
    throw error;
  }
}; 