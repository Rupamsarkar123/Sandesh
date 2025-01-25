import { Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Tag
      color="purple"
      closable
      onClose={handleFunction}
      style={{
        marginBottom: "8px",
        fontSize: "12px",
        cursor: "pointer",
      }}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseOutlined style={{ paddingLeft: "5px" }} />
    </Tag>
  );
};

export default UserBadgeItem;
