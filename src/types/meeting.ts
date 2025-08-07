import type { Dayjs } from 'dayjs';

export interface Meeting {
  meetingId: string;
  meetingName: string;
  meetingType: string;
  createdBy: string;
  invitedUsers: string[];
  maxUsers: number;
  meetingDate: string;
  status: boolean;
  createdAt: Date;
}

export interface CreateOneOnOneMeetingFormData  {
  meetingName: string;
  invitedUser: string;
  meetingDate: Dayjs;
} 

export interface CreateConferenceFormData {
  meetingName: string;
  invitedUser: string[];
  meetingDate: Dayjs;
}


export interface TableDataType {
  key: string;
  meetingName: string;
  meetingType: string;
  meetingDate: string;
  maxUsers: number;
  status: boolean;
  createdAt: string;
}