// useFetchMenus.js
import { useEffect, useState } from 'react';
import { Icon } from '@mui/material';

import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
// import CodingTestComponent from "layouts/codingTest"; // 가상의 컴포넌트 예시
// import CodingTestCheckComponent from "layouts/codingTestCheck"; // 가상의 컴포넌트 예시
// import CodingTestResultsComponent from "layouts/codingTestResults"; // 가상의 컴포넌트 예시
// import CodingTestAnalyzeComponent from "layouts/codingTestAnalyze"; // 가상의 컴포넌트 예시

const menuComponentMap = {
  "/coding-test": Dashboard,
  "/tables": Tables,
  "/billing": Billing,
  "/notifications": Notifications,
  "/profile": Profile,
  "/authentication/sign-in": SignIn,
  "/authentication/sign-up": SignUp,
  // "/coding-test": CodingTestComponent, // 추가한 컴포넌트
  // "/coding-test/check": CodingTestCheckComponent, // 추가한 컴포넌트
  // "/coding-test/results": CodingTestResultsComponent, // 추가한 컴포넌트
  // "/coding-test/analyze": CodingTestAnalyzeComponent, // 추가한 컴포넌트
};

// 메뉴 데이터를 라우트 형식으로 변환하는 함수
const transformMenusToRoutes = (menus) => {
  const routes = menus.map(menu => ({
    type: "collapse",
    name: menu.MENU_CODE,  // 여기에서 이름을 설정
    key: menu.MENU_CODE,    // 고유 키를 설정
    icon: <Icon fontSize="small">{menu.ICON}</Icon>, // 아이콘 설정
    route: menu.ROUTE,      // 라우트 경로 설정
    component: menuComponentMap[menu.ROUTE], // 매핑된 컴포넌트를 사용
  }));

  return routes;
};

const useFetchMenus = (role) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      if (!role) {
        // 로그인하지 않은 경우 기본 경로로 리다이렉트
        setRoutes([
          {
            path: "/authentication/sign-in",
            component: SignIn,
          },
          {
            path: "/authentication/sign-up",
            component: SignUp,
          },
        ]);
        setLoading(false);
        return;
      }

      try {
        const response = await privateApiRequest('/menus', 'GET');
        const menus = response.data;

        // 사용자 역할에 따른 메뉴 필터링
        const filteredMenus = menus.filter(menu => menu.MENU_ROLE === role);
        
        // 메뉴를 라우트 형식으로 변환
        const transformedRoutes = transformMenusToRoutes(filteredMenus);
        setRoutes(transformedRoutes);
      } catch (error) {
        console.error("메뉴를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [role]);

  return { routes, loading };
};

export default useFetchMenus;
