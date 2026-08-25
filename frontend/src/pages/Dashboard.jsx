import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Spin,
  Alert,
} from "antd";

import {
  DatabaseOutlined,
  CheckCircleOutlined,
  UserSwitchOutlined,
  ToolOutlined,
  StopOutlined,
} from "@ant-design/icons";

import api from "../api/api";

const { Title, Text } = Typography;

function Dashboard() {
  const [summary, setSummary] = useState({
    TotalAssets: 0,
    Available: 0,
    Assigned: 0,
    Maintenance: 0,
    Retired: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/reports/assets-summary");

        setSummary(response.data.report.summary);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard information.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <Title level={2}>Dashboard</Title>
          <Text type="secondary">
            Overview of your office assets and inventory.
          </Text>
        </div>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[18, 18]}>
        <Col xs={24} sm={12} xl={8}>
          <Card className="stat-card stat-card-main">
            <Statistic
              title="Total Assets"
              value={summary.TotalAssets || 0}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={8}>
          <Card className="stat-card">
            <Statistic
              title="Available"
              value={summary.Available || 0}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={8}>
          <Card className="stat-card">
            <Statistic
              title="Assigned"
              value={summary.Assigned || 0}
              prefix={<UserSwitchOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={8}>
          <Card className="stat-card">
            <Statistic
              title="Maintenance"
              value={summary.Maintenance || 0}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={8}>
          <Card className="stat-card">
            <Statistic
              title="Retired"
              value={summary.Retired || 0}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;