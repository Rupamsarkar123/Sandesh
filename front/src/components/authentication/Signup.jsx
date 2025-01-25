import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [picLoading, setPicLoading] = useState(false);
  const [pic, setPic] = useState();

  const handleFinish = async (values) => {
    const { name, email, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      message.warning("Passwords do not match");
      return;
    }

    setPicLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );

      message.success("Registration Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      message.error(
        error.response.data.message || "Error occurred during registration"
      );
      setPicLoading(false);
    }
  };

  const uploadImage = async (file) => {
    setPicLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app");
    formData.append("cloud_name", "deqzfkjo6");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/deqzfkjo6/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setPic(data.url.toString());
      message.success("Image uploaded successfully");
      setPicLoading(false);
    } catch (err) {
      message.error("Image upload failed");
      setPicLoading(false);
    }
  };

  const handleUpload = ({ file }) => {
    if (file.type === "image/jpeg" || file.type === "image/png") {
      uploadImage(file);
    } else {
      message.warning("Please upload a valid image (JPEG/PNG)");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "0.5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your password" }]}
        >
          <Input.Password
            placeholder="Confirm your password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item label="Upload Your Picture">
          <Upload
            beforeUpload={(file) => {
              handleUpload({ file });
              return false; // Prevent auto upload
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} loading={picLoading}>
              Upload Image
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={picLoading}
            style={{ marginTop: "1px", width: "100px" }}
          >
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;

// import { Button, Form, Input, message, Upload } from "antd";
// import axios from "axios";
// import { useState } from "react";
// import { useHistory } from "react-router";

// const Signup = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const history = useHistory();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     pic: null,
//   });
//   const [fileList, setFileList] = useState([]); // Manage fileList state
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handlePasswordToggle = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async () => {
//     const { name, email, password, confirmPassword, pic } = formData;
//     setLoading(true);

//     if (!name || !email || !password || !confirmPassword) {
//       message.warning("Please fill all the fields");
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       message.warning("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = {
//         headers: {
//           "Content-type": "application/json",
//         },
//       };
//       const { data } = await axios.post(
//         "/api/user",
//         { name, email, password, pic },
//         config
//       );
//       message.success("Registration Successful");
//       localStorage.setItem("userInfo", JSON.stringify(data));
//       history.push("/chats");
//     } catch (error) {
//       message.error(`Error Occurred: ${error.response.data.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = ({ file, fileList: updatedFileList }) => {
//     setFileList(updatedFileList); // Update fileList state
//     if (file.status === "done") {
//       const formData = new FormData();
//       formData.append("file", file.originFileObj);
//       formData.append("upload_preset", "sandesh");
//       formData.append("cloud_name", "deqzfkjo6");

//       fetch("https://api.cloudinary.com/v1_1/deqzfkj06/image/upload", {
//         method: "POST",
//         body: formData,
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           setFormData({ ...formData, pic: data.url.toString() });
//           message.success("Image uploaded successfully");
//         })
//         .catch((err) => {
//           message.error("Image upload failed");
//         });
//     }
//   };

//   return (
//     <Form
//       layout="vertical"
//       style={{ maxWidth: 400, margin: "auto" }}
//       onFinish={handleSubmit}
//     >
//       <Form.Item label="Name" name="name" required>
//         <Input
//           placeholder="Enter Your Name"
//           name="name"
//           onChange={handleChange}
//         />
//       </Form.Item>

//       <Form.Item label="Email Address" name="email" required>
//         <Input
//           type="email"
//           placeholder="Enter Your Email Address"
//           name="email"
//           onChange={handleChange}
//         />
//       </Form.Item>

//       <Form.Item label="Password" name="password" required>
//         <Input.Password
//           type={showPassword ? "text" : "password"}
//           placeholder="Enter Password"
//           name="password"
//           onChange={handleChange}
//           addonAfter={
//             <Button type="link" onClick={handlePasswordToggle}>
//               {showPassword ? "Hide" : "Show"}
//             </Button>
//           }
//         />
//       </Form.Item>

//       <Form.Item label="Confirm Password" name="confirmPassword" required>
//         <Input.Password
//           type={showPassword ? "text" : "password"}
//           placeholder="Confirm Password"
//           name="confirmPassword"
//           onChange={handleChange}
//         />
//       </Form.Item>

//       <Form.Item label="Upload your Picture" name="pic">
//         <Upload
//           name="pic"
//           listType="picture"
//           maxCount={1}
//           accept="image/*"
//           fileList={fileList} // Bind fileList
//           onChange={handleFileChange} // Update fileList on change
//         >
//           <Button>Click to Upload</Button>
//         </Upload>
//       </Form.Item>

//       <Form.Item>
//         <Button
//           type="primary"
//           htmlType="submit"
//           loading={loading}
//           block
//           style={{ width: "30%" }}
//         >
//           Sign Up
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default Signup;
