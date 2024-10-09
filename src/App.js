/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation , useNavigate  } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import 'regenerator-runtime/runtime';
// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
// Material Dashboard 2 React routes
//import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";


import useFetchMenus from './utils/hook/useFetchMenus.js'; // 훅 import


export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  const [user, setUser] = useState(null); // 사용자 정보를 관리할 상태
  const [menusData, setMenusData] = useState({ routes: [], loading: true, error: null });
  const navigate = useNavigate();

    // 사용자 인증 및 메뉴 로딩
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setUser({ role: 'user' }); // 실제 사용자 데이터를 가져오는 로직 추가
      }
    }, [navigate]);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);


  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);



    // 사용자 역할에 따라 메뉴를 로드
    useEffect(() => {
      if (user) {
        const { routes, loading, error } = useFetchMenus(user.role);
        setMenusData({ routes, loading, error });
      } else {
        // 사용자 정보가 없을 경우 로그인 및 회원가입 메뉴를 직접 설정
        const guestMenus = [
          {
            type: "collapse",
            name: "Sign In",
            key: "sign-in",
            icon: <Icon fontSize="small">login</Icon>,
            route: "/authentication/sign-in",
            component: <SignIn />,
          },
          {
            type: "collapse",
            name: "Sign Up",
            key: "sign-up",
            icon: <Icon fontSize="small">assignment</Icon>,
            route: "/authentication/sign-up",
            component: <SignUp />,
          },
        ];

        setMenusData({ routes: guestMenus, loading: false, error: null });
      }
    }, [user]);
      

    const getRoutes = (allRoutes) => {
      return allRoutes.map((route) => {
        if (route.collapse) {
          return getRoutes(route.collapse);
        }
        if (route.route) {
          return <Route exact path={route.route} element={route.component} key={route.key} />;
        }
        return null;
      });
    };
  




  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return <>

    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Material Dashboard 2"
            routes={menusData.routes} // 수정된 부분
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(menusData.routes)} {/* 사용자 정의 경로들 */}
        {/* 기본 경로("/")에서 로그인 페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/authentication/sign-in" />} />
        {/* 모든 정의되지 않은 경로에 대해 로그인 페이지로 리다이렉트, 그러나 로그인 및 회원가입 경로는 제외 */}
        <Route path="/authentication/sign-in" element={<SignIn />} />
        <Route path="/authentication/sign-up" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
    </ThemeProvider>
    </>
}
