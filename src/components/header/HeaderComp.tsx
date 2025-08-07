import React from 'react';
import { Layout, Typography, Image } from 'antd';
import { UnlockOutlined } from '@ant-design/icons';
import logo from '../../assets/logo.png';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../../utils/FirebaseConfig';
import { useAppSelector } from '../../App/hooks';
import styles from './header.module.css'
import BreadcrumbsComp from '../BreadCrumb/BreadCrumbComp';

const { Header } = Layout;
const { Text } = Typography;

const HeaderComp: React.FC = () => {
  const userName = useAppSelector(store => store.auth.userInfo?.name);

  const logout = () => {
    signOut(firebaseAuth);
  };

  return (
    <Layout className={styles.fixedLayout}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 50px' }}>
        <Image src={logo} alt="Logo" preview={false} width={120} />
        <Text style={{ fontSize: '30px', fontWeight: 700 }}>
          <span style={{ color: 'white' }}>Hello, </span>
          <span style={{ color: '#1890ff' }}>{userName}</span>
        </Text>
        <UnlockOutlined
          style={{ color: 'white', fontSize: '30px', cursor: 'pointer' }}
          onClick={logout}
        />
      </Header>

      <div className={styles.breadcrumbWrapper}>
        <BreadcrumbsComp/>
      </div>
    </Layout>
  );
};

export default HeaderComp;
