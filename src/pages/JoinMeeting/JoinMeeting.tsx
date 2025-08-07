import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firebaseAuth, firebaseDB } from "../../utils/FirebaseConfig";
import { generateMeetingId } from "../../utils/meetingIdGenerator";
import { message, Button } from 'antd';
import useAuth from "../../hooks/useAuth";
import { useAppSelector } from "../../App/hooks";

export default function JoinMeeting() {
  const params = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isAllowed, setIsAllowed] = useState(false);
  const [user, setUser] = useState<any>(undefined);
  const [userLoaded, setUserLoaded] = useState(false);
  const [meetingData, setMeetingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useAuth();
  useAppSelector(store => store.auth.userInfo);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
      setUserLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getMeetingData = async () => {
      if (params.id && userLoaded) {
        try {
          setLoading(true);
          const meetingRef = doc(firebaseDB, 'meetings', params.id);
          const meetingDoc = await getDoc(meetingRef);
          if (meetingDoc.exists()) {
            const meeting = meetingDoc.data();
            setMeetingData(meeting);
            const isCreator = meeting.createdBy === user?.uid;
            const currentTime = moment();
            const meetingTime = moment(meeting.meetingDate);
            const meetingEndTime = meetingTime.clone().add(60, 'minutes');
            if (meeting.meetingType === "1-on-1") {
              if (meeting.invitedUsers && meeting.invitedUsers.length > 0) {
                const isInvited = meeting.invitedUsers.includes(user?.uid);
                if (isInvited || isCreator) {
                  if (currentTime.isBetween(meetingTime, meetingEndTime)) {
                    setIsAllowed(true);
                  } else if (currentTime.isBefore(meetingTime)) {
                    messageApi.warning(`Meeting starts at ${meetingTime.format('DD.MM.YYYY HH:mm')}`);
                    navigate(user ? "/" : "/login");
                  } else if (currentTime.isAfter(meetingEndTime)) {
                    messageApi.error("Meeting has ended");
                    navigate(user ? "/" : "/login");
                  }
                } else {
                  messageApi.error("You are not invited to this meeting");
                  navigate(user ? "/" : "/login");
                }
              } else {
                if (isCreator) {
                  if (currentTime.isBetween(meetingTime, meetingEndTime)) {
                    setIsAllowed(true);
                  } else if (currentTime.isBefore(meetingTime)) {
                    messageApi.warning(`Meeting starts at ${meetingTime.format('DD.MM.YYYY HH:mm')}`);
                    navigate(user ? "/" : "/login");
                  } else if (currentTime.isAfter(meetingEndTime)) {
                    messageApi.error("Meeting has ended");
                    navigate(user ? "/" : "/login");
                  }
                } else {
                  messageApi.error("You are not invited to this meeting");
                  navigate(user ? "/" : "/login");
                }
              }
            } else if (meeting.meetingType === "video conference" || meeting.meetingType === "anyone can join") {
              const isInvited = meeting.invitedUsers && meeting.invitedUsers.includes(user?.uid);
              if (isInvited || isCreator || meeting.meetingType === "anyone can join") {
                if (currentTime.isBetween(meetingTime, meetingEndTime)) {
                  setIsAllowed(true);
                } else if (currentTime.isBefore(meetingTime)) {
                  messageApi.warning(`Meeting starts at ${meetingTime.format('DD.MM.YYYY HH:mm')}`);
                  navigate(user ? "/" : "/login");
                } else if (currentTime.isAfter(meetingEndTime)) {
                  messageApi.error("Meeting has ended");
                  navigate(user ? "/" : "/login");
                }
              } else {
                messageApi.error("You are not invited to this meeting");
                navigate(user ? "/" : "/login");
              }
            } else {
              setIsAllowed(true);
            }
          } else {
            messageApi.error("Meeting not found");
            navigate(user ? "/" : "/login");
          }
        } catch (error) {
          messageApi.error("Failed to load meeting data");
          navigate(user ? "/" : "/login");
        } finally {
          setLoading(false);
        }
      }
    };
    getMeetingData();
  }, [params.id, user, userLoaded, messageApi, navigate]);

  useEffect(() => {
    if (isAllowed && meetingData && containerRef.current) {
      try {
        const appId = parseInt(import.meta.env.VITE_ZEGOCLOUD_APP_ID || '2030673546');
        const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET || 'd7fce3d419d7ecbb9968758ee254f534';
        
        let maxUsers = 3;
        if (meetingData.meetingType === '1-on-1') {
          maxUsers = 3;
        } else if (meetingData.meetingType === 'anyone can join') {
          maxUsers = meetingData.maxUsers && meetingData.maxUsers > 2 ? meetingData.maxUsers : 50;
        } else if (meetingData.meetingType === 'video conference') {
          maxUsers = meetingData.maxUsers && meetingData.maxUsers > 2 ? meetingData.maxUsers : 10;
        } else {
          maxUsers = meetingData.maxUsers || 2;
        }
        
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appId,
          serverSecret,
          params.id as string,
          user?.uid ? user.uid : generateMeetingId(),
          user?.displayName ? user.displayName : generateMeetingId()
        );
        
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp?.joinRoom({
          container: containerRef.current,
          maxUsers,
          sharedLinks: [
            {
              name: "Meeting link",
              url: window.location.origin + window.location.pathname,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          showPreJoinView: true,
          showLeavingView: true,
        });
      } catch (error) {
        messageApi.error("Failed to join meeting");
      }
    }
  }, [isAllowed, meetingData, user, params.id, messageApi]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        {contextHolder}
        <div>Loading meeting...</div>
      </div>
    );
  }

  return isAllowed ? (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column"
      }}
    >
      {contextHolder}
      <div
        className="myCallContainer"
        ref={containerRef}
        style={{ width: "100%", height: "100vh" }}
      ></div>
      <Button 
        type="primary" 
        onClick={() => window.location.reload()}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }}
      >
        Refresh Meeting
      </Button>
    </div>
  ) : (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      {contextHolder}
      <div>Access denied</div>
    </div>
  );
}