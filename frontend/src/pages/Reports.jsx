import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";

import {
  CheckCircleOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  PrinterOutlined,
  ReloadOutlined,
  StopOutlined,
  ToolOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

import api from "../api/api";

const { Title, Text } = Typography;

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/reports/assets-summary"
      );

      setReport(response.data.report);
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Unable to generate asset report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialReport = async () => {
      try {
        const response = await api.get(
          "/reports/assets-summary"
        );

        if (!cancelled) {
          setReport(response.data.report);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError(
            error?.response?.data?.message ||
              "Unable to generate asset report."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialReport();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const summary = report?.summary || {};

  const columns = [
    {
      title: "Category",
      dataIndex: "CategoryName",
      key: "CategoryName",
      render: (value) => (
        <Text strong>{value}</Text>
      ),
    },
    {
      title: "Total Assets",
      dataIndex: "TotalAssets",
      key: "TotalAssets",
      align: "center",
    },
    {
      title: "Available",
      dataIndex: "Available",
      key: "Available",
      align: "center",
      render: (value) => (
        <Tag color="green">{value || 0}</Tag>
      ),
    },
    {
      title: "Assigned",
      dataIndex: "Assigned",
      key: "Assigned",
      align: "center",
      render: (value) => (
        <Tag color="blue">{value || 0}</Tag>
      ),
    },
    {
      title: "Maintenance",
      dataIndex: "Maintenance",
      key: "Maintenance",
      align: "center",
      render: (value) => (
        <Tag color="orange">{value || 0}</Tag>
      ),
    },
    {
      title: "Retired",
      dataIndex: "Retired",
      key: "Retired",
      align: "center",
      render: (value) => (
        <Tag>{value || 0}</Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="report-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="page-heading reports-heading">
        <div>
          <Title level={2}>
            Asset Summary Report
          </Title>

          <Text type="secondary">
            Consolidated overview of office assets
            and inventory status.
          </Text>
        </div>

        <div className="report-actions">
          <Button
            icon={<ReloadOutlined />}
            onClick={loadReport}
          >
            Refresh
          </Button>

          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            className="primary-action-button"
          >
            Print Report
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginBottom: 24 }}
        />
      )}

      <Card
        className="report-header-card"
        bordered={false}
      >
        <div className="report-document-header">
          <div className="report-brand">
            <img
              src="/images/logo.png"
              alt="AssetTrack"
              className="report-logo"
            />

            <div>
              <Title level={4}>
                AssetTrack
              </Title>

              <Text type="secondary">
                Office Asset and Inventory
                Management System
              </Text>
            </div>
          </div>

          <div className="report-meta">
            <Text type="secondary">
              Report Generated
            </Text>

            <Text strong>
              {report?.generatedAt
                ? new Date(
                    report.generatedAt
                  ).toLocaleString()
                : "—"}
            </Text>
          </div>
        </div>
      </Card>

      <Row
        gutter={[16, 16]}
        className="report-summary-grid"
      >
        <Col xs={24} sm={12} xl={8}>
          <Card className="report-stat-card report-total-card">
            <Statistic
              title="Total Assets"
              value={summary.TotalAssets ?? 0}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={8}>
          <Card className="report-stat-card">
            <Statistic
              title="Available"
              value={summary.Available ?? 0}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={8}>
          <Card className="report-stat-card">
            <Statistic
              title="Assigned"
              value={summary.Assigned ?? 0}
              prefix={<UserSwitchOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={8}>
          <Card className="report-stat-card">
            <Statistic
              title="Maintenance"
              value={summary.Maintenance ?? 0}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={8}>
          <Card className="report-stat-card">
            <Statistic
              title="Retired"
              value={summary.Retired ?? 0}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        className="report-table-card"
        bordered={false}
        title={
          <div className="report-section-title">
            <FileTextOutlined />

            <span>
              Asset Breakdown by Category
            </span>
          </div>
        }
      >
       <Table
            rowKey="CategoryId"
            columns={columns}
            dataSource={report?.byCategory || []}
            pagination={false}
        />
      </Card>

      <div className="report-footer">
        <Text type="secondary">
          Generated through the AssetTrack
          Office Asset and Inventory Management
          System.
        </Text>
      </div>
    </div>
  );
}

export default Reports;