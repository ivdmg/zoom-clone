import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';

const BreadcrumbsComp: React.FC = () => {
  const location = useLocation();
  
 
  const pathNameMap: { [key: string]: string } = {
    'create': 'Create',
    'create1on1meeting': 'Create 1-on-1 Meeting',
    'createVideoConference': 'Create Video Conference',
    'login': 'Login',
    'dashboard': 'Dashboard'
  };

  const pathSnippets = location.pathname.split('/').filter(i => i);

  const breadcrumbItems = [
    { title: <Link to="/">Home</Link> }, 
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const displayName = pathNameMap[snippet] || snippet;
      return {
        title: <Link to={url}>{displayName}</Link>,
      };
    }),
  ];

  return (
    <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
  );
};

export default BreadcrumbsComp;
