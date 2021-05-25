import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
  const history = useHistory();
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "error_Toast" });
          } else {
            M.toast({
              html: "Post successfully done 🌻",
              classes: "success_Toast",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [body, history, url]);

  const postDetails = () => {
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

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <span className="create-post-header">Create post</span>
        <input
          type="text"
          placeholder="Add a caption"
          className="input-caption"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="file-field">
          <span> Upload File </span>
          <div className="btn">
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>
        <button className="post-btn" onClick={() => postDetails()}>
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
