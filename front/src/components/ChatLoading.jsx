import { Space } from "antd";
import { Skeleton } from "antd";

const ChatLoading = () => {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
      <Skeleton.Button active block style={{ height: "45px" }} />
    </Space>
  );
};

export default ChatLoading;
