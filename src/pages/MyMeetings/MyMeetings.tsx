import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import useAuth from '../../hooks/useAuth';
import { fetcMyMeeting } from './MyMeetingSlice';
import { Table, Tag, Space } from 'antd';
import type { TableProps } from 'antd';
import moment from 'moment';
import HeaderComp from './../../components/header/HeaderComp';
import { CopyOutlined, EditOutlined } from '@ant-design/icons';
import styles from './mymeeting.module.css';
import { Link } from 'react-router-dom';
import EditFlayOut from '../EditFlayout/editFlayOut';
import type { TableDataType, Meeting } from '../../types/meeting';

const MyMeetings: React.FC = () => {
  useAuth();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(store => store.auth.userInfo);
  const { loading, error, myMeetings } = useAppSelector(store => store.mymeetings);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    if (userInfo) dispatch(fetcMyMeeting(userInfo));
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (!openEdit && userInfo) {
      dispatch(fetcMyMeeting(userInfo));
    }
  }, [openEdit, userInfo, dispatch]);

  if (error) return <div>{error}</div>;

  const tableData: TableDataType[] = myMeetings.map(m => ({
    key: m.meetingId,
    meetingName: m.meetingName,
    meetingType: m.meetingType,
    meetingDate: moment(m.meetingDate).format('DD.MM.YYYY HH:mm'),
    maxUsers: m.maxUsers,
    status: m.status,
    createdAt: moment(m.createdAt).format('DD.MM.YYYY HH:mm'),
  }));

  const columns: TableProps<TableDataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'meetingName',
      key: 'meetingName',
    },
    {
      title: 'Type',
      dataIndex: 'meetingType',
      key: 'meetingType',
    },
    {
      title: 'Date',
      dataIndex: 'meetingDate',
      key: 'meetingDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        const meetingStart = moment(record.meetingDate, 'DD.MM.YYYY HH:mm');
        const meetingDurationMinutes = 60;
        const meetingEnd = meetingStart.clone().add(meetingDurationMinutes, 'minutes');
        const now = moment();

        if (!record.status) {
          return <Tag color="red">Cancelled</Tag>;
        }

        if (now.isBetween(meetingStart, meetingEnd)) {
          return (
            <Link to={`/join/${record.key}`}>
              <Tag color="green" style={{ cursor: 'pointer' }}>Join Now</Tag>
            </Link>
          );
        }

        if (now.isAfter(meetingEnd)) {
          return <Tag color="gray">Ended</Tag>;
        }

        if (now.isBefore(meetingStart)) {
          return <Tag color="blue">Upcoming</Tag>;
        }

        return <Tag>Unknown</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const meetingStart = moment(record.meetingDate, 'DD.MM.YYYY HH:mm');
        const meetingDurationMinutes = 60;
        const meetingEnd = meetingStart.clone().add(meetingDurationMinutes, 'minutes');
        const now = moment();

        const handleCopy = async () => {
          const link = `${import.meta.env.VITE_REACT_APP_HOST}/join/${record.key}`;
          try {
            await navigator.clipboard.writeText(link);
            console.log('Ссылка скопирована:', link);
          } catch (err) {
            console.error('Ошибка копирования ссылки:', err);
          }
        };

        const handleEdit = (record: TableDataType) => {
          const meeting = myMeetings.find(m => m.meetingId === record.key);
          if (meeting) {
            setSelectedMeeting(meeting);
            setOpenEdit(true);
          }
        };

        const canEdit = record.status && now.isBefore(meetingEnd);

        return (
          <Space size="middle">
            <CopyOutlined
              onClick={handleCopy}
              className={styles['copy-icon']}
              style={{ cursor: 'pointer', fontSize: '20px' }}
            />
            {canEdit && (
              <EditOutlined
                onClick={() => handleEdit(record)}
                style={{ cursor: 'pointer', fontSize: '20px', color: '#1890ff' }}
              />
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <HeaderComp />
      {!userInfo && <div>Please log in to see your meetings.</div>}
      {loading ? (
        <div>Loading meetings...</div>
      ) : (
        <Table columns={columns} dataSource={tableData} pagination={false} style={{ paddingTop: '160px' }} />
      )}
      {openEdit && (
        <EditFlayOut
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          meetingData={selectedMeeting ?? undefined}
        />
      )}
    </>
  );
};

export default MyMeetings;
