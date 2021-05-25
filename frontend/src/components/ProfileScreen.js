import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";

const ProfileScreen = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
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
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dispatch, image, state]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div className="profile-container">
      <div className="profile-subcontainer">
        <div className="profile-image-container">
          <img className="profile-image" src={state?.pic} alt="user-profile" />
          <div className="update-pic d-flex flex-column mb-2">
            <span className="update-btn"> Update photo</span>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
        </div>
        <div className="profile-info-container">
          <div className="profile-status-container">
            <h1 className="title_text"> {state?.name} </h1>
          </div>
          <div className="profile-info">
            <span className="profile-info-text"> {mypics.length} posts</span>
            <span className="profile-info-text">
              {" "}
              {state ? state.followers.length : "0"} followers
            </span>
            <span className="profile-info-text">
              {" "}
              {state ? state.following.length : "0"} following
            </span>
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
              key={item._id}
              className="item"
              src={item.photo}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProfileScreen;
