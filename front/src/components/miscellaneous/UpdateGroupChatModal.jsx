import { useState } from "react";
import { Modal, Button, Input, Spin, message } from "antd";
import { ViewOutlined } from "@ant-design/icons";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      message.error("Failed to Load the Search Results");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      message.error("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      message.error("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      message.error("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      message.error(error.response.data.message);
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <Button
        type="primary"
        icon={<ViewOutlined />}
        onClick={() => setSelectedChat(selectedChat)}
      >
        Update Group
      </Button>

      <Modal
        title={selectedChat.chatName}
        visible={selectedChat !== null}
        onCancel={() => setSelectedChat(null)}
        footer={null}
        width={400}
      >
        <div style={{ marginBottom: 20 }}>
          {selectedChat.users.map((u) => (
            <UserBadgeItem
              key={u._id}
              user={u}
              admin={selectedChat.groupAdmin}
              handleFunction={() => handleRemove(u)}
            />
          ))}
        </div>

        <Input
          placeholder="Chat Name"
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Button
          type="primary"
          onClick={handleRename}
          loading={renameloading}
          style={{ marginBottom: 20 }}
        >
          Update
        </Button>

        <Input
          placeholder="Add User to group"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        {loading ? (
          <Spin size="large" />
        ) : (
          searchResult?.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => handleAddUser(user)}
            />
          ))
        )}

        <Button
          danger
          onClick={() => handleRemove(user)}
          style={{ marginTop: 10 }}
        >
          Leave Group
        </Button>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
