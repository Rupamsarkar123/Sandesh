import { Avatar, Card, Typography } from "antd";
import { ChatState } from "../../Context/ChatProvider";

const { Text } = Typography;

const UserListItem = ({ user, handleFunction }) => {
  const { user: loggedInUser } = ChatState();

  return (
    <Card
      hoverable
      style={{
        width: "100%",
        backgroundColor: "#E8E8E8",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        padding: "10px",
      }}
      onClick={handleFunction}
      styles={{
        body: {
          display: "flex",
          alignItems: "center",
          padding: 0,
        },
      }}
    >
      <Avatar
        src={user.pic}
        alt={user.name}
        size="small"
        style={{ marginRight: "10px", cursor: "pointer" }}
      />
      <div>
        <Text strong>{user.name}</Text>
        <br />
        <Text type="secondary">
          <b>Email: </b>
          {user.email}
        </Text>
      </div>
    </Card>
  );
};

export default UserListItem;
