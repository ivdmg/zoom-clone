import { Flex, Card, Typography, Image, message } from "antd";
import useAuth from "../../hooks/useAuth";
import styles from "./dashboard.module.css";
import dashboard1 from "../../assets/dashboard1.png";
import dashboard2 from "../../assets/dashboard2.png";
import dashboard3 from "../../assets/dashboard3.png";
import { useNavigate } from "react-router-dom";
import HeaderComp from '../../components/header/HeaderComp';
import { useEffect } from 'react';

const { Title, Paragraph } = Typography;

function Dashboard() {
  useAuth();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const shouldShowMessage = sessionStorage.getItem('showMeetingSuccess');
    if (shouldShowMessage) {
      messageApi.success('Meeting created successfully!');
      sessionStorage.removeItem('showMeetingSuccess');
    }
  }, [messageApi]);

  return (
    <>
      {contextHolder}
      <HeaderComp/>
      <div className={styles.dashboardContainer}>
        <div className={styles.cardWrapper}>
          <Card className={styles.card} onClick={() => navigate("/create")}>
            <Flex vertical align="center">
              <Image width={60} src={dashboard1} preview={false} />
              <Title level={4} style={{ fontWeight: 700, marginTop: '1rem' }}>
                Create Meeting
              </Title>
              <Paragraph
                type="secondary"
                style={{ fontSize: '1rem', textAlign: 'center', margin: 0 }}
              >
                Create a new meeting and invite people.
              </Paragraph>
            </Flex>
          </Card>

          <Card className={styles.card} onClick={() => navigate("/mymeetings")}>
            <Flex vertical align="center">
              <Image width={60} src={dashboard2} preview={false} />
              <Title level={4} style={{ fontWeight: 700, marginTop: '1rem' }}>
                My Meetings
              </Title>
              <Paragraph
                type="secondary"
                style={{ fontSize: '1rem', textAlign: 'center', margin: 0 }}
              >
                View your created meetings.
              </Paragraph>
            </Flex>
          </Card>

          <Card className={styles.card} onClick={() => navigate("/meetings")}>
            <Flex vertical align="center">
              <Image width={60} src={dashboard3} preview={false} />
              <Title level={4} style={{ fontWeight: 700, marginTop: '1rem' }}>
                Meetings
              </Title>
              <Paragraph
                type="secondary"
                style={{ fontSize: '1rem', textAlign: 'center', margin: 0 }}
              >
                View the meetings you are invited to.
              </Paragraph>
            </Flex>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Dashboard;