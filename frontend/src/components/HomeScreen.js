import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        /* console.log(result); */
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <>
      {data.map((item) => {
        return (
          <div className="card-container">
            <div className="card-profile-info" key={item._id}>
              <div>
                <img
                  className="card-profile-img"
                  src={item.postedBy.pic}
                  alt="UserPic"
                />
              </div>
              <div className="card-delete">
                <p className="card-title">
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                  >
                    {item.postedBy.name}
                  </Link>
                  {item.postedBy._id === state._id && (
                    <i
                      className="fas fa-trash trash-icon"
                      onClick={() => deletePost(item._id)}
                    />
                  )}
                </p>
              </div>
            </div>
            <div>
              <img className="card-image" src={item.photo} alt="card-pic" />
            </div>

            <div className="card-content">
              <span>
                {item.likes.includes(state._id) ? (
                  <i
                    className="fas fa-heart"
                    onClick={() => {
                      unlikePost(item._id);
                    }}
                  />
                ) : (
                  <i
                    className="far fa-heart"
                    onClick={() => {
                      likePost(item._id);
                    }}
                  />
                )}
              </span>
              <p> {item.likes.length} likes </p>
              <p> {item.body} </p>
              {item.comments.map((record) => {
                return (
                  <>
                    <h6 key={record._id}>
                      <span
                        style={{
                          fontWeight: "500",
                          color: "#f55c47",
                          marginRight: "1.2rem",
                        }}
                      >
                        {record.postedBy.name}
                      </span>{" "}
                      {record.text}
                    </h6>
                  </>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                  setComment("");
                }}
              >
                <input
                  placeholder="add a comment"
                  className="input-comment"
                  value={comment}
                  onChange={(event) => {
                    setComment(event.target.value);
                  }}
                />
              </form>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default HomeScreen;
