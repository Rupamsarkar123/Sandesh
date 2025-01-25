import { EyeOutlined } from "@ant-design/icons";
import { Modal, Button, Typography, Image } from "antd";
import { useState } from "react";

const { Text, Title } = Typography;

const ProfileModal = ({ user, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {children ? (
        <span onClick={showModal}>{children}</span>
      ) : (
        <Button
          type="text"
          icon={<EyeOutlined style={{ fontSize: "24px" }} />}
          onClick={showModal}
        />
      )}
      <Modal
        title={
          <Title level={2} style={{ textAlign: "center", marginBottom: 0 }}>
            {user.name}
          </Title>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center" }}>
          <Image
            src={user.pic}
            alt={user.name}
            width={150}
            height={150}
            style={{ borderRadius: "50%", marginBottom: "20px" }}
          />
          <Text style={{ fontSize: "20px", fontFamily: "Work Sans" }}>
            Email: {user.email}
          </Text>
        </div>
      </Modal>
    </>
  );
};

export default ProfileModal;
