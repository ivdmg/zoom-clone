import { Drawer, message } from 'antd';
import React, { useState } from 'react';
import type { Meeting } from '../../types/meeting';
import EditMeetingForm from './EditMeetingForm';
import { updateMeeting } from '../../services/meetingService';

interface EditFlayOutProps {
  open: boolean;
  onClose: () => void;
  meetingData?: Meeting;
}

const EditFlayOut: React.FC<EditFlayOutProps> = ({ open, onClose, meetingData }) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleEditSubmit = async (formData: any) => {
    setLoading(true);
    try {
      console.log('EditFlayOut: Starting form submission');
      console.log('Form data:', formData);
      console.log('Meeting data:', meetingData);
      
      const updatePayload = {
        meetingName: formData.meetingName,
        meetingDate: formData.meetingDate,
        invitedUsers: formData.invitedUsers,
        maxUsers: formData.maxUsers,
      };

      console.log('Update payload:', updatePayload);

      if (meetingData?.meetingId) {
        console.log('Using meeting ID:', meetingData.meetingId);
        await updateMeeting(meetingData.meetingId, updatePayload);
        messageApi.success('Meeting updated successfully');
        onClose();
      } else {
        console.error('Meeting ID not found in meetingData:', meetingData);
        throw new Error('Meeting ID not found');
      }
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      messageApi.error('Failed to update meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title={`Edit Meeting: ${meetingData?.meetingName ?? ''}`}
        open={open}
        onClose={onClose}
        width={480}
        destroyOnClose
      >
        {meetingData && (
          <EditMeetingForm
            initialData={meetingData}
            onSubmit={handleEditSubmit}
            onCancel={onClose}
            loading={loading}
          />
        )}
      </Drawer>
    </>
  );
};

export default EditFlayOut;
