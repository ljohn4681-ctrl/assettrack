import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import api from "../api/api";

const { Title, Text } = Typography;

const statusOptions = [
  {
    label: "Available",
    value: "Available",
  },
  {
    label: "Assigned",
    value: "Assigned",
  },
  {
    label: "Maintenance",
    value: "Maintenance",
  },
  {
    label: "Retired",
    value: "Retired",
  },
];

function Assets() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [form] = Form.useForm();

const loadAssets = async () => {
  try {
    setLoading(true);

    const response = await api.get("/assets");

    setAssets(response.data.data || []);
  } catch (error) {
    console.error(error);

    message.error(
      error?.response?.data?.message ||
        "Unable to load assets."
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  let cancelled = false;

  const loadInitialData = async () => {
    try {
      const [assetsResponse, categoriesResponse] =
        await Promise.all([
          api.get("/assets"),
          api.get("/categories"),
        ]);

      if (cancelled) {
        return;
      }

      setAssets(
        assetsResponse.data.data || []
      );

      setCategories(
        categoriesResponse.data.data || []
      );
    } catch (error) {
      console.error(error);

      if (!cancelled) {
        message.error(
          error?.response?.data?.message ||
            "Unable to load asset information."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  loadInitialData();

  return () => {
    cancelled = true;
  };
}, []);

  const filteredAssets = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return assets;
    }

    return assets.filter((asset) => {
      return [
        asset.AssetCode,
        asset.AssetName,
        asset.CategoryName,
        asset.SerialNumber,
        asset.Status,
        asset.AssignedTo,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(keyword)
        );
    });
  }, [assets, searchText]);

  const openAddModal = () => {
    setEditingAsset(null);

    form.resetFields();

    form.setFieldsValue({
      status: "Available",
    });

    setModalOpen(true);
  };

  const openEditModal = (asset) => {
    setEditingAsset(asset);

    form.setFieldsValue({
      assetCode: asset.AssetCode,
      assetName: asset.AssetName,
      categoryId: asset.CategoryId,
      serialNumber: asset.SerialNumber || "",
      purchaseDate: asset.PurchaseDate
        ? String(asset.PurchaseDate).slice(0, 10)
        : "",
      status: asset.Status,
      assignedTo: asset.AssignedTo || "",
      remarks: asset.Remarks || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAsset(null);
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      setSaving(true);

      const payload = {
        assetCode: values.assetCode,
        assetName: values.assetName,
        categoryId: values.categoryId,
        serialNumber: values.serialNumber || null,
        purchaseDate: values.purchaseDate || null,
        status: values.status,
        assignedTo: values.assignedTo || null,
        remarks: values.remarks || null,
      };

      if (editingAsset) {
        await api.put(
          `/assets/${editingAsset.Id}`,
          payload
        );

        message.success(
          "Asset updated successfully."
        );
      } else {
        await api.post("/assets", payload);

        message.success(
          "Asset created successfully."
        );
      }

      closeModal();

      await loadAssets();
    } catch (error) {
      console.error(error);

      message.error(
        error?.response?.data?.message ||
          "Unable to save asset."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (assetId) => {
    try {
      await api.delete(`/assets/${assetId}`);

      message.success(
        "Asset deleted successfully."
      );

      await loadAssets();
    } catch (error) {
      console.error(error);

      message.error(
        error?.response?.data?.message ||
          "Unable to delete asset."
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "green";

      case "Assigned":
        return "blue";

      case "Maintenance":
        return "orange";

      case "Retired":
        return "default";

      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Asset Code",
      dataIndex: "AssetCode",
      key: "AssetCode",
      width: 130,
      render: (value) => (
        <Text strong>{value}</Text>
      ),
    },
    {
      title: "Asset Name",
      dataIndex: "AssetName",
      key: "AssetName",
      width: 210,
    },
    {
      title: "Category",
      dataIndex: "CategoryName",
      key: "CategoryName",
      width: 150,
    },
    {
      title: "Serial Number",
      dataIndex: "SerialNumber",
      key: "SerialNumber",
      width: 160,
      render: (value) => value || "—",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      width: 130,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "AssignedTo",
      key: "AssignedTo",
      width: 170,
      render: (value) => value || "—",
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      fixed: "right",
      render: (_, asset) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() =>
              openEditModal(asset)
            }
          />

          <Popconfirm
            title="Delete asset?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
            onConfirm={() =>
              handleDelete(asset.Id)
            }
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="assets-page">
      <div className="page-heading assets-heading">
        <div>
          <Title level={2}>
            Assets
          </Title>

          <Text type="secondary">
            Manage office assets and inventory
            records.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={openAddModal}
          className="primary-action-button"
        >
          Add Asset
        </Button>
      </div>

      <Card
        className="management-card"
        bordered={false}
      >
        <div className="asset-toolbar">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search asset code, name, category, serial number..."
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            className="asset-search"
          />

          <Text
            type="secondary"
            className="record-count"
          >
            {filteredAssets.length}{" "}
            {filteredAssets.length === 1
              ? "record"
              : "records"}
          </Text>
        </div>

        <Table
          rowKey="Id"
          loading={loading}
          columns={columns}
          dataSource={filteredAssets}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
          }}
          scroll={{
            x: 1100,
          }}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={
          editingAsset
            ? "Edit Asset"
            : "Add Asset"
        }
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
        width={650}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="asset-form"
        >
          <div className="form-grid">
            <Form.Item
              label="Asset Code"
              name="assetCode"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter the asset code.",
                },
              ]}
            >
              <Input placeholder="e.g. AST-0003" />
            </Form.Item>

            <Form.Item
              label="Asset Name"
              name="assetName"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter the asset name.",
                },
              ]}
            >
              <Input placeholder="e.g. Dell Latitude 5450" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message:
                    "Please select a category.",
                },
              ]}
            >
              <Select
                placeholder="Select category"
                options={categories.map(
                  (category) => ({
                    label:
                      category.CategoryName,
                    value: category.Id,
                  })
                )}
              />
            </Form.Item>

            <Form.Item
              label="Serial Number"
              name="serialNumber"
            >
              <Input placeholder="Optional" />
            </Form.Item>

            <Form.Item
              label="Purchase Date"
              name="purchaseDate"
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message:
                    "Please select a status.",
                },
              ]}
            >
              <Select
                options={statusOptions}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Assigned To"
            name="assignedTo"
          >
            <Input placeholder="Employee or department name" />
          </Form.Item>

          <Form.Item
            label="Remarks"
            name="remarks"
          >
            <Input.TextArea
              rows={3}
              placeholder="Additional information about this asset"
            />
          </Form.Item>

          <div className="modal-actions">
            <Button
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
            >
              {editingAsset
                ? "Save Changes"
                : "Create Asset"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default Assets;