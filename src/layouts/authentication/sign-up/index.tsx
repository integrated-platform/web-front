import { Link } from "react-router-dom";
import { Card, Checkbox } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { publicApiRequest } from '../../../utils/api'; // 경로에 맞게 수정하세요
import { ChangeEvent, FormEvent, useState } from "react";

// 회원가입 폼 데이터 타입 정의
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 에러 메시지 타입 정의
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Cover = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // 입력 변경 처리
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 폼 유효성 검사
  const validate = (): FormErrors => {
    let validationErrors: FormErrors = {};
    if (!formData.username) validationErrors.username = "사용자 이름은 필수입니다";
    if (!formData.email) validationErrors.email = "이메일은 필수입니다";
    if (!formData.password) validationErrors.password = "비밀번호는 필수입니다";
    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = "비밀번호가 일치하지 않습니다";

    return validationErrors;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("폼 제출:", formData);
  
      // 인증 서버에 회원가입 요청
      try {
        // Axios를 사용하여 API 요청
        const data = await publicApiRequest('/register', 'POST', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        
        alert("회원가입 성공!");
  
        // 폼 초기화
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        // 오류 메시지 처리
        const errorMessage = (error instanceof Error) ? error.message : '회원가입 요청 중 오류가 발생했습니다.';
        console.error("회원가입 요청 중 오류 발생:", errorMessage);
        alert(`회원가입 실패: ${errorMessage}`);
      }
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            회원가입
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            이메일과 비밀번호를 입력하여 등록하세요
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="이름"
                variant="standard"
                fullWidth
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="이메일"
                variant="standard"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="비밀번호"
                variant="standard"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="비밀번호 확인"
                variant="standard"
                fullWidth
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;동의하다&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                이용 약관
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                가입하기
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                이미 회원가입이 되어있나요?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  로그인
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
};

export default Cover;
