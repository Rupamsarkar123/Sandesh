import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    const { email, password } = formData;
    setLoading(true);

    if (!email || !password) {
      message.warning("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      message.success("Login Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/chats");
    } catch (error) {
      message.error(`Error Occurred: ${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      style={{ maxWidth: 330, margin: "auto" }}
      onFinish={handleSubmit}
    >
      <Form.Item label="Email Address" name="email" required>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          name="email"
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item label="Password" name="password" required>
        <Input.Password
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          name="password"
          onChange={handleChange}
          addonAfter={
            <Button
              type="link"
              onClick={handlePasswordToggle}
              style={{
                width: "100%",
                marginBottom: "0px",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          }
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{ marginBottom: "20px", width: "30%" }}
        >
          Login
        </Button>
        <Button
          type="primary"
          style={{
            width: "71%",
            backgroundColor: "green",
            borderColor: "green",
          }}
          onClick={() => {
            setFormData({ email: "guest@example.com", password: "123456" });
          }}
        >
          Get Guest User Credentials
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
