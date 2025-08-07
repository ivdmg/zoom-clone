import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, Typography, Space, message, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../App/hooks';
import { createMeeting } from '../../services/meetingService';
import type { CreateConferenceFormData } from '../../types/meeting';
import HeaderComponent from "../../components/header/HeaderComp";
import useAuth from "../../hooks/useAuth";
import dayjs from 'dayjs';
import styles from '../Create1on1Meeting/create1on1meeting.module.css';
import MeetingMaximumUsers from './MeetingMaximumUsers';

const { Title } = Typography;
const { Option } = Select;

function CreateVideoConference() {
  useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(1)
  const [anyoneCanJoin, setAnyoneCanJoin] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  
  const userInfo = useAppSelector(store => store.auth.userInfo);

  const [users, setUsers] = useState<Array<{uid: string, name: string, email: string}>>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const { getAllUsers } = await import('../../services/userService');
        const fetchedUsers = await getAllUsers();
        const filteredUsers = fetchedUsers.filter(user => user.uid !== userInfo?.uid);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        messageApi.error('Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };

    if (userInfo) {
      fetchUsers();
    }
  }, [userInfo, messageApi]);

  const onFinish = async (values: CreateConferenceFormData) => {
    if (!userInfo) {
      messageApi.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const meetingDate = values.meetingDate ? dayjs(values.meetingDate).format('YYYY-MM-DD HH:mm:ss') : '';
      
      const meetingData = {
        meetingName: values.meetingName,
        meetingType: anyoneCanJoin ? 'anyone can join' : 'video conference',
        createdBy: userInfo.uid,
        invitedUsers: anyoneCanJoin ? [] : values.invitedUser,
        maxUsers: anyoneCanJoin ? size : Math.max(values.invitedUser.length, 10),
        meetingDate,
        status: true,
      };

      await createMeeting(meetingData);
      
      sessionStorage.setItem('showMeetingSuccess', 'true');
      navigate('/');
      
    } catch (error) {
      console.error('Error creating meeting:', error);
      messageApi.error('Failed to create meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <HeaderComponent />
      <div className={styles.container}>
        <Card className={styles.formCard}>
          <Title level={2} className={styles.title}>
            Create Video Conference
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              meetingDate: dayjs(),
            }}
          >
            
            <Form.Item label="Anyone can join" valuePropName="checked">
              <Switch 
                checked={anyoneCanJoin} 
                onChange={setAnyoneCanJoin} 
              />
            </Form.Item>
            <Form.Item
              label="Meeting Name"
              name="meetingName"
              className={styles.formItem}
              rules={[
                { required: true, message: 'Please enter meeting name' },
                { min: 3, message: 'Meeting name must be at least 3 characters' }
              ]}
            >
              <Input placeholder="Enter meeting name" />
            </Form.Item>

            {anyoneCanJoin ? 
            <MeetingMaximumUsers value={size} setValue={setSize}/>
            :
            <Form.Item
              label="Invite Users"
              name="invitedUser"
              className={styles.formItem}
              rules={[
                { required: true, message: 'Please select a user to invite' }
              ]}
            >
                          <Select 
              placeholder="Select a user to invite" 
              mode="multiple"
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
            }

            <Form.Item
              label="Meeting Date & Time"
              name="meetingDate"
              className={styles.formItem}
              rules={[
                { required: true, message: 'Please select meeting date and time' }
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder="Select date and time"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item>
              <Space className={styles.buttonGroup}>
                <Button 
                  type="default" 
                  onClick={onReset} 
                  size="large"
                  className={styles.resetButton}
                >
                  Reset
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  size="large"
                  className={styles.submitButton}
                >
                  Create Meeting
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default CreateVideoConference;