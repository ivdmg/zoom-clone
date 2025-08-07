import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Select, Space, InputNumber } from 'antd';
import dayjs from 'dayjs';
import styles from '../../pages/Create1on1Meeting/create1on1meeting.module.css';
import type { Meeting } from '../../types/meeting';

const { Option } = Select;

const EditMeetingForm: React.FC<EditMeetingFormProps> = ({ initialData, onSubmit, onCancel, loading }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<Array<{uid: string, name: string, email: string}>>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const isOneOnOne = initialData.meetingType === '1-on-1';
  const isAnyCanJoin = initialData.meetingType === 'anyone can join';

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const { getAllUsers } = await import('../../services/userService');
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

interface EditMeetingFormProps {
  initialData: Meeting;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading: boolean;
}



  useEffect(() => {
    console.log('EditMeetingForm: Setting form values');
    console.log('Initial data:', initialData);
    console.log('initialData.invitedUsers:', initialData.invitedUsers);
    
    const formValues = {
      meetingName: initialData.meetingName,
      meetingDate: dayjs(initialData.meetingDate),
      invitedUser: initialData.invitedUsers?.[0] || undefined,
      invitedUsers: initialData.invitedUsers || [],
      maxUsers: initialData.maxUsers,
    };
    
    console.log('Form values to set:', formValues);
    form.setFieldsValue(formValues);
  }, [initialData, form]);

  const handleFinish = (values: any) => {
    console.log('EditMeetingForm: Form submitted with values:', values);
    console.log('Meeting type:', initialData.meetingType);
    console.log('Is one-on-one:', isOneOnOne);
    
    
    const processedValues = {
      ...values,
      meetingDate: dayjs(values.meetingDate).format('YYYY-MM-DD HH:mm:ss'),
      invitedUsers: isOneOnOne 
        ? (values.invitedUser ? [values.invitedUser] : [])
        : (values.invitedUsers || []),
      maxUsers: isOneOnOne ? 1 : (values.maxUsers || (isAnyCanJoin ? 50 : 10)),
    };
    
    console.log('Processed values:', processedValues);
    onSubmit(processedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="Meeting Name"
        name="meetingName"
        className={styles.formItem}
        rules={[
          { required: true, message: 'Please enter meeting name' },
          { min: 3, message: 'At least 3 characters' },
        ]}
      >
        <Input placeholder="Enter meeting name" />
      </Form.Item>

      <Form.Item
        label="Meeting Date & Time"
        name="meetingDate"
        className={styles.formItem}
        rules={[{ required: true, message: 'Please select meeting date and time' }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          placeholder="Select date and time"
          style={{ width: '100%' }}
        />
      </Form.Item>

      {isOneOnOne && (
        <Form.Item
          label="Invite User"
          name="invitedUser"
          className={styles.formItem}
          rules={[{ required: true, message: 'Please select a user' }]}
        >
          <Select 
            placeholder="Select a user"
            loading={loadingUsers}
            disabled={loadingUsers}
          >
            {users.map(user => (
              <Option key={user.uid} value={user.uid}>
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {!isOneOnOne && (
        <>
          {!isAnyCanJoin ?  
            <Form.Item
              label="Invite Users"
              name="invitedUsers"
              className={styles.formItem}
              rules={[{ required: true, message: 'Please select users' }]}
            >
                          <Select
              mode="multiple"
              placeholder="Select multiple users"
              allowClear
              loading={loadingUsers}
              disabled={loadingUsers}
            >
              {users.map(user => (
                <Option key={user.uid} value={user.uid}>
                  {user.name} ({user.email})
                </Option>
              ))}
            </Select>
            </Form.Item>
            :
            <Form.Item
              label="Maximum Users"
              name="maxUsers"
              className={styles.formItem}
              rules={[
                { required: true, message: 'Please enter max users' },
                { type: 'number', min: 1, max: 20, message: 'Value between 1 and 20' },
              ]}
            >
              <InputNumber min={1} max={20} />
            </Form.Item>
          }
        </>
      )}

      <Space>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Space>
    </Form>
  );
};

export default EditMeetingForm;
