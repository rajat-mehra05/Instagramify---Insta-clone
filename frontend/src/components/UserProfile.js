import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)

        setUserProfile(result);
      });
  }, [userid]);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setUserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div className="profile-container">
          <div className="profile-subcontainer">
            <div className="profile-image-container">
              <img
                className="profile-image"
                src={userProfile.user.pic}
                alt="user-profile"
              />
            </div>
            <div className="profile-info-container">
              <div className="profile-status-container">
                <h1 className="title_text"> {userProfile.user.name} </h1>
              </div>
              <div className="profile-info">
                {showfollow ? (
                  <button
                    className="follow_button"
                    onClick={() => followUser()}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="unfollow_button"
                    onClick={() => unfollowUser()}
                  >
                    Unfollow
                  </button>
                )}

                <span className="profile-info-text">
                  {" "}
                  {userProfile.posts.length} posts
                </span>
                <span className="profile-info-text">
                  {" "}
                  {userProfile.user.followers.length} followers
                </span>
                <span className="profile-info-text">
                  {" "}
                  {userProfile.user.following.length} following
                </span>
              </div>
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
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
      ) : (
        <h2> loading... </h2>
      )}
    </>
  );
};

export default UserProfile;
