import { useState, useEffect, useMemo, useCallback } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator, setLayout } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { privateApiRequest } from './utils/api';
import * as format from './utils/hook/format';

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
  const [menusData, setMenusData] = useState({ routes: [], loading: true, error: null });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

 

  // 세션에서 토큰 확인
  useEffect(() => {

    const token = sessionStorage.getItem('accessToken');
    if (token) {
      fetchMenus();
      setIsAuthenticated(true);
    } else {
 
      setIsAuthenticated(false);
    }
  }, [navigate]);

  // 인증 상태에 따라 대시보드로 이동
  useEffect(() => {
    console.log('isAuthenticated',isAuthenticated)
    if (isAuthenticated) {
      setLayout(dispatch, "dashboard"); // layout을 "dashboard"로 설정
      navigate('/dashboard');
    }else{
      setLayout(dispatch, "page"); // layout을 "dashboard"로 설정
      navigate('/authentication/sign-in');
    }
  }, [isAuthenticated]);

  // 메뉴 데이터를 가져오는 함수
  const fetchMenus = useCallback(async () => {
    try {
      const response = await privateApiRequest('/menus', 'GET');
      const menus = response.data;
      const transformedRoutes = format.transformMenusToRoutes(menus);
      setMenusData({ routes: transformedRoutes, loading: false, error: null });
      
    } catch (error) {
      console.error("메뉴 로딩 실패:", error);
      setMenusData({ routes: [], loading: false, error });
    }
  }, []);


  // Cache 설정 최적화: useMemo 사용해 한 번만 설정
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  // 사이드 메뉴 이벤트 핸들러 최적화
  const handleOnMouseEnter = useCallback(() => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  }, [miniSidenav, onMouseEnter, dispatch]);

  const handleOnMouseLeave = useCallback(() => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  }, [onMouseEnter, dispatch]);

  // 환경설정 열기/닫기 핸들러 최적화
  const handleConfiguratorOpen = useCallback(() => {
    setOpenConfigurator(dispatch, !openConfigurator);
  }, [openConfigurator, dispatch]);

  // dir 속성 설정 최적화
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // 페이지 변경 시 스크롤 위치 초기화
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // 동적 경로 설정 최적화: useMemo 사용
  const getRoutes = useCallback((allRoutes) => {
    return allRoutes.map((route) => {
      if (route.collapse && route.collapse.length > 0) {
        return (
          <Route key={route.key} path={route.route} element={route.component}>
            {getRoutes(route.collapse)} {/* 하위 메뉴의 라우트 추가 */}
          </Route>
        );
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });
  }, []);

  // 구성 버튼 렌더링 최적화
  const configsButton = useMemo(() => (
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
  ), [handleConfiguratorOpen]);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="메뉴"
            routes={menusData.routes} 
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {isAuthenticated && getRoutes(menusData.routes)} {/* 인증된 사용자의 경우 */}
        <Route path="/" element={<Navigate to="/authentication/sign-in" />} />
        <Route path="/authentication/sign-in" element={<SignIn />} />
        <Route path="/authentication/sign-up" element={<SignUp />} />
        {/* <Route path="*" element={<Navigate to="/authentication/sign-in" />} /> */}
      </Routes>
    </ThemeProvider>
  );
}
