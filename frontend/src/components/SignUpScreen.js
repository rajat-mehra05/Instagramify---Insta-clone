import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const SignUpScreen = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagramify");
    data.append("cloud_name", "dxgo68vci");
    fetch("https://api.cloudinary.com/v1_1/dxgo68vci/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFields = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid email/password", classes: "error_Toast" });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "error_Toast" });
        } else {
          M.toast({ html: data.message, classes: "success_Toast" });
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <span className="logo-name">Instagramify</span>
        <span className="description-text">Capture and Share.</span>
        <input
          type="text"
          placeholder="Name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="file-field">
          <div className="upload-btn">
            <span> Upload profile photo </span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>
        <button className="authButton" onClick={() => PostData()}>
          Sign up
        </button>
        <span className="authText">
          Have an account ?{" "}
          <Link to="/signin" className="auth-nav-link">
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default SignUpScreen;
