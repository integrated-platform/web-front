import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

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
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator  , setLayout} from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

import { publicApiRequest  , privateApiRequest} from './utils/api'; // 경로에 맞게 수정하세요
import * as format from './utils/hook/format'

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


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const fetchMenus = async () => {
        try {
          const response = await privateApiRequest('/menus', 'GET'); // API 호출
          const menus = response.data;
          // 메뉴를 라우트 형식으로 변환
          const transformedRoutes = format.transformMenusToRoutes(menus);
          console.log("transformedRoutes",transformedRoutes)
          setMenusData({ routes: transformedRoutes, loading: false, error: null });
        } catch (error) {
          console.error("메뉴 로딩 실패:", error);
          setMenusData({ routes: [], loading: false, error });
        }
      };
      fetchMenus(); // 비동기 함수 호출
    }else{
      setMenusData({ routes: [], loading: false, error: null });
    }
    console.log("layout",layout)
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


    const getRoutes = (allRoutes) => {
      console.log("allRoutes", allRoutes);
      return allRoutes.map((route) => {
        // 하위 메뉴가 있을 경우
        if (route.collapse && route.collapse.length > 0) {
          return (
            <Route key={route.key} path={route.route} element={route.component}>
              {getRoutes(route.collapse)} {/* 하위 메뉴의 라우트 추가 */}
            </Route>
          );
        }
        // 일반 메뉴 라우트 처리
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
