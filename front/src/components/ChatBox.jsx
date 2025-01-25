import { Card } from "antd";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";
import "./styles.css";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Card
      style={{
        display: selectedChat ? "flex" : "none",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        backgroundColor: "white",
        width: "100%",
        maxWidth: "68%",
        borderRadius: "10px",
        borderWidth: "1px",
      }}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
        },
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Card>
  );
};

export default Chatbox;
