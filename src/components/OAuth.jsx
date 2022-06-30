import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // checking user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      //if user not found here we create new user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error(`failed to sign-${location.pathname ==='/sign-up' ? 'up' : 'in'} with Google`);
    }
  };
  return (
    <div className="card">
      <div className="card-body items-center text-center text-accent-focus font-bold">
        <p> sign-{location.pathname === "/sign-up" ? "up" : "in"} with</p>
        <button className="w-8 " onClick={onGoogleClick}>
          <img src={googleIcon} alt="google" />
        </button>
      </div>
    </div>
  );
}

export default OAuth;
