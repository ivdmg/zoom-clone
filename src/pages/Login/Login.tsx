import React from 'react';
import { Card, Row, Col, Typography, Button, Space } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import animation from '../../assets/animation.gif';
import logo from '../../assets/logo.png';
import styles from './login.module.css';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { firebaseAuth, userRef } from '../../utils/FirebaseConfig';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../App/hooks';
import { setUser } from '../../App/slices/AuthSlice';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  onAuthStateChanged(firebaseAuth, currentUser => {
    if(currentUser){
      navigate("/")
    }
  })

  const login = async() => {
    const provider = new GoogleAuthProvider();
    const {user: { displayName, email, uid }} = await signInWithPopup(firebaseAuth, provider);
    if(email){
      const firestoreQuery = query(userRef, where("uid", "==", uid))
      const fetchUsers = await getDocs(firestoreQuery)
      if(fetchUsers.docs.length === 0){
        await addDoc(userRef, {
          uid, 
          name:displayName, 
          email
        })
      }
      dispatch(setUser({uid, name: displayName, email}))
      navigate("/")
    }
  }

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <Row gutter={0} className={styles.row}>
          <Col xs={0} sm={10} className={styles.left}>
            <div className={styles.gifContainer}>
              <img
                src={animation}
                alt="animation"
                className={styles.animation}
              />
            </div>
          </Col>
          <Col xs={24} sm={14} className={styles.right}>
            <div className={styles.formWrapper}>
              <Space direction="vertical" size="large" className={styles.space}>
                <div>
                  <img src={logo} alt="logo" className={styles.logoSmall} />
                </div>
                <Title level={3} className={styles.title}>
                  One Platform to{' '}
                  <Text className={styles.connectHighlight}>Connect</Text>
                </Title>
                <Button
                  type="primary"
                  icon={<GoogleOutlined />}
                  size="large"
                  block
                  className={styles.button}

                  onClick={login}
                >
                  Login With Google
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Login;
