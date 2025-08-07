import { Flex, Card, Typography, Image } from "antd"
import useAuth from "../../hooks/useAuth"
import styles from "../Dashboard/dashboard.module.css"
import dashboard1 from "../../assets/meeting1.png"
import dashboard2 from "../../assets/meeting2.png"
import { useNavigate } from "react-router-dom"
import HeaderComp from '../../components/header/HeaderComp';

const { Title, Paragraph } = Typography;

function CreateMeetings() {
  useAuth()
  const navigate = useNavigate();
  return (
    <>
      <HeaderComp/>
      <div className={styles.dashboardContainer}>
        <div className={styles.cardWrapper}>
          <Card  className={`${styles.card} ${styles.cardMeetings}`} onClick={() => navigate("/create/create1on1meeting")}>
            <Flex vertical align="center">
              <Image width={60} src={dashboard1} preview={false} />
              <Title level={4} style={{ fontWeight: 700, marginTop: '1rem' }}>
                Create 1 on 1 Meeting
              </Title>
              <Paragraph
                type="secondary"
                style={{ fontSize: '1rem', textAlign: 'center', margin: 0 }}
              >
                Create a personal single porson meeting.
              </Paragraph>
            </Flex>
          </Card>

          <Card  className={`${styles.card} ${styles.cardMeetings}`} onClick={() => navigate("/create/createVideoConference")}>
            <Flex vertical align="center">
              <Image width={60} src={dashboard2} preview={false} />
              <Title level={4} style={{ fontWeight: 700, marginTop: '1rem' }}>
                Create Video Conference
              </Title>
              <Paragraph
                type="secondary"
                style={{ fontSize: '1rem', textAlign: 'center', margin: 0 }}
              >
                Invite multiple persons to the meeting.
              </Paragraph>
            </Flex>
          </Card>
        </div>
      </div>
    </>
  );
}

export default CreateMeetings;
