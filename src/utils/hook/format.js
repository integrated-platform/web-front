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
  "/coding-test": Dashboard, // 여기에 적절한 컴포넌트를 넣으세요
  "/tables": "Tables",
  "/billing": "Billing",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/authentication/sign-in": SignIn,
  "/authentication/sign-up": SignUp,
  // 추가할 컴포넌트...
};

// 메뉴 데이터를 라우트 형식으로 변환하는 함수
export const transformMenusToRoutes = (menus) => {
  return menus.map(menu => ({
    type: menu.type,
    name: menu.name, // 메뉴 이름
    key: menu.menuCode, // 고유 키
    icon: <Icon fontSize="small">{menu.icon}</Icon>, // 아이콘
    route: menu.route, // 라우트 경로
    component: menuComponentMap[menu.route], // 매핑된 컴포넌트
    collapse: menu.children ? transformMenusToRoutes(menu.children) : [] // 하위 메뉴 처리
  }));
};