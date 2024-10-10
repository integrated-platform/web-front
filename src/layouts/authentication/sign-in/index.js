import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { publicApiRequest } from '../../../utils/api'; // 경로에 맞게 수정하세요

import 'regenerator-runtime/runtime';

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" }); // 로그인 입력 데이터 상태 관리
  const navigate = useNavigate(); // navigate 사용

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // 입력 데이터 업데이트
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
  
    try {
      const response = await publicApiRequest('/login', 'POST', {
        email: formData.email,
        password: formData.password,
      });
  
      // 실제 토큰을 저장
      const token = response.token; // 응답 객체에서 토큰 추출
      localStorage.setItem('authToken', token); // 토큰을 로컬 스토리지에 저장
      
      // 로그인 성공 시 처리 (예: 토큰 저장, 사용자 리다이렉트 등)
      console.log(token);
      navigate('/coding-test'); // 대시보드 페이지로 리다이렉트 (경로는 필요에 따라 변경)
    } catch (error) {
      console.error("로그인 실패:", error);
      // 에러 메시지를 사용자에게 알리는 로직 추가 가능
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Coding-Test
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInputChange} // 입력 변경 이벤트 핸들러
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleInputChange} // 입력 변경 이벤트 핸들러
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;기억하기
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                로그인
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                계정이 없으신가요?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  회원가입
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
