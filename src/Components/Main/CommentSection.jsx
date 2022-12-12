import React, { useContext, useRef, useReducer, useEffect } from "react";
import { Avatar } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import { AuthContext } from "../AppContext/AppContext";
import {
  setDoc,
  collection,
  doc,
  serverTimestamp,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  PostsReducer,
  postActions,
  postsStates,
} from "../AppContext/PostReducer";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const comment = useRef("");
  const { user, userData } = useContext(AuthContext);
  const commentRef = doc(collection(db, "posts", postId, "comments"));
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const { ADD_COMMENT, HANDLE_ERROR } = postActions;

  const addComment = async (e) => {
    e.preventDefault();
    if (comment.current.value !== "") {
      try {
        await setDoc(commentRef, {
          id: commentRef.id,
          comment: comment.current.value,
          image: user?.photoURL,
          name:
            userData?.name?.charAt(0)?.toUpperCase() +
              userData?.name?.slice(1) || user?.displayName?.split(" ")[0],
          timestamp: serverTimestamp(),
        });
        comment.current.value = "";
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const collectionOfComments = collection(db, `posts/${postId}/comments`);
        const q = query(collectionOfComments, orderBy("timestamp", "desc"));
        await onSnapshot(q, (doc) => {
          dispatch({
            type: ADD_COMMENT,
            comments: doc.docs?.map((item) => item.data()),
          });
        });
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
        console.log(err.message);
      }
    };
    return () => getComments();
  }, [postId, ADD_COMMENT, HANDLE_ERROR]);

  return (
    <div className="flex flex-col bg-white w-full py-2 rounded-b-3xl">
      <div className="flex items-center">
        <div className="mx-2">
          <Avatar
            size="sm"
            variant="circular"
            src={user?.photoURL || avatar}
          ></Avatar>
        </div>
        <div className="w-full pr-2">
          <form className="flex items-center w-full" onSubmit={addComment}>
            <input
              name="comment"
              type="text"
              placeholder="Write a comment..."
              className="w-full rounded-2xl outline-none border-0 p-2 bg-gray-100"
              ref={comment}
            ></input>
            <button className="hidden" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
      {state?.comments?.map((comment, index) => {
        return (
          <Comment
            key={index}
            image={comment?.image}
            name={comment?.name}
            comment={comment?.comment}
          ></Comment>
        );
      })}
    </div>
  );
};

export default CommentSection;
