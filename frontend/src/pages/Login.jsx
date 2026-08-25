import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  message,
  Space,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../api/api";

const { Title, Text } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        username: values.username,
        password: values.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

    message.success("Login successful!");

    navigate("/");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Login failed. Please try again.";

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Dark / purple overlay */}
      <div className="login-overlay" />

      {/* Ambient background glow */}
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      {/* Moving particles */}
      <div className="particle-layer" aria-hidden="true">
        <span className="particle particle-1" />
        <span className="particle particle-2" />
        <span className="particle particle-3" />
        <span className="particle particle-4" />
        <span className="particle particle-5" />
        <span className="particle particle-6" />
        <span className="particle particle-7" />
        <span className="particle particle-8" />
        <span className="particle particle-9" />
        <span className="particle particle-10" />
        <span className="particle particle-11" />
        <span className="particle particle-12" />
      </div>

      <div className="login-container">
        <div className="login-brand">
          {/* Logo with glass badge */}
          <div className="logo-shell">
            <div className="logo-glow" />

            <div className="logo-badge">
              <img
                src="/images/logo.png"
                alt="AssetTrack Logo"
                className="login-logo"
              />
            </div>
          </div>

          <Title level={2} className="brand-title">
            AssetTrack
          </Title>

          <Text className="brand-subtitle">
            Office Asset and Inventory Management System
          </Text>

          <Text className="brand-caption">
            Staff Access
          </Text>
        </div>

        <Card className="glass-card" bordered={false}>
          <Space
            direction="vertical"
            size={6}
            style={{ width: "100%" }}
          >
            <Title level={3} className="login-title">
              Sign In
            </Title>

            <Text className="login-description">
              Access the asset management portal for daily operations.
            </Text>
          </Space>

          <Form
            layout="vertical"
            onFinish={onFinish}
            style={{ marginTop: 24 }}
          >
            <Form.Item
              label={
                <span className="form-label">
                  Username
                </span>
              }
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please enter your username.",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Enter your username"
                className="glass-input"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="form-label">
                  Password
                </span>
              }
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password.",
                },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                className="glass-input"
              />
            </Form.Item>

            <Form.Item
              style={{
                marginTop: 12,
                marginBottom: 10,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="login-button"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <span>AssetTrack Admin Portal</span>
            <span>Secure Access</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;