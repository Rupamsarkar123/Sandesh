import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Drawer,
  Input,
  Layout,
  Menu,
  message,
  Space,
  Tooltip,
  Typography,
  Spin,
} from "antd";
import {
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";

const { Header } = Layout;
const { Text } = Typography;

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      message.warning("Please enter something in search");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to load the search results");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setDrawerVisible(false);
    } catch (error) {
      message.error("Error fetching the chat");
      setLoadingChat(false);
    }
  };
  return (
    <>
      <Header
        style={{
          background: "#2e2e2e",
          padding: "5px 10px",
          borderBottom: "1px solid #555",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tooltip title="Search Users to chat">
          <Button
            type="text"
            icon={<SearchOutlined style={{ color: "white" }} />}
            onClick={() => setDrawerVisible(true)}
            style={{ color: "white" }}
          >
            <Text
              style={{ marginLeft: 8, display: "inline-block", color: "white" }}
            >
              Search Contacts
            </Text>
          </Button>
        </Tooltip>

        <Text
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            fontFamily: "Work Sans",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "white",
          }}
        >
          <img
            src="/cht.svg"
            alt="VIT Logo"
            style={{ width: "30px", height: "30px", filter: "invert(1)" }}
          />
          Sandesh
        </Text>

        <Space size="large">
          <Badge count={notification.length} overflowCount={99}>
            <BellOutlined
              style={{ fontSize: "1.5rem", cursor: "pointer", color: "white" }}
            />
          </Badge>
          <Menu
            mode="horizontal"
            theme="dark"
            items={[
              {
                key: "submenu",
                label: (
                  <Avatar
                    src={user.pic}
                    size="small"
                    style={{ cursor: "pointer", border: "2px solid white" }}
                  />
                ),
                icon: <DownOutlined style={{ color: "white" }} />,
                children: [
                  {
                    key: "profile",
                    label: (
                      <ProfileModal user={user}>
                        <Text style={{ color: "white" }}>My Profile</Text>
                      </ProfileModal>
                    ),
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "logout",
                    label: <span style={{ color: "white" }}>Logout</span>,
                    icon: <LogoutOutlined style={{ color: "white" }} />,
                    onClick: logoutHandler,
                  },
                ],
              },
            ]}
          />
        </Space>
      </Header>

      <Drawer
        title={<span style={{ color: "white" }}>Search contacts to chat</span>}
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        style={{ background: "#2e2e2e", color: "white" }} // Use style instead of bodyStyle
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input.Search
            placeholder="Search  by name or email to chat"
            enterButton="Go"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ background: "#444", color: "white", borderColor: "#888" }}
            allowClear
          />
        </Space>

        {loading ? (
          <ChatLoading />
        ) : (
          searchResult?.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
              style={{ color: "white" }}
            />
          ))
        )}
        {loadingChat && (
          <Spin style={{ display: "block", margin: "20px auto" }} />
        )}
      </Drawer>
    </>
  );
}

export default SideDrawer;
