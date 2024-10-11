import { useState, useEffect, useMemo, useCallback } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import 'regenerator-runtime/runtime';
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator, setLayout } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { publicApiRequest, privateApiRequest } from './utils/api';
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
  const navigate = useNavigate();

  // 메뉴 데이터 로딩 최적화: useCallback 사용해 불필요한 재생성 방지
  const fetchMenus = useCallback(async () => {
    try {
      const response = await privateApiRequest('/menus', 'GET'); // API 호출
      const menus = response.data;
      const transformedRoutes = format.transformMenusToRoutes(menus); // 메뉴를 라우트 형식으로 변환
      setMenusData({ routes: transformedRoutes, loading: false, error: null });
    } catch (error) {
      console.error("메뉴 로딩 실패:", error);
      setMenusData({ routes: [], loading: false, error });
    }
  }, []);

  // 메뉴 및 토큰 확인 로직 최적화
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchMenus(); // 토큰이 있을 때만 메뉴 데이터를 가져옴
    } else {
      setMenusData({ routes: [], loading: false, error: null });
    }
  }, [fetchMenus]);

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
        {localStorage.getItem('authToken') && getRoutes(menusData.routes)} {/* 사용자 정의 경로들, 토큰이 있을 때만 */}
        <Route path="/" element={<Navigate to="/authentication/sign-in" />} />
        <Route path="/authentication/sign-in" element={<SignIn />} />
        <Route path="/authentication/sign-up" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
    </ThemeProvider>
  );
}
