import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import OAuth from "../components/OAuth";
import {getAuth,createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import {db} from '../firebase.config'
import {setDoc,doc,serverTimestamp} from 'firebase/firestore'

import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit=async(e)=> {
    e.preventDefault();
    try {
      const auth = getAuth()
      const userCredentials = await createUserWithEmailAndPassword(auth,email,password);
      const user = userCredentials.user
      updateProfile(auth.currentUser,{
        displayName:name
      })
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp =serverTimestamp()

      await setDoc(doc(db,'users',user.uid),formDataCopy)

      navigate('/')
    } catch (error) {
      toast.error('Something went Wrong here...')
      
    }

  }
  return (
    <>
      <div className="hero min-h-screen bg-neutral-content">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left m-4">
            <h1 className="text-5xl font-bold ">Helloo..!!</h1>
            <p className="py-6 text-2xl font-semibold text-secondary">
              Create Account!
            </p>
          </div>
          <div className="card flex-shrink w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={onSubmit}>
              <div className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="name"
                    placeholder="Name"
                    className="input input-bordered"
                    id="name"
                    value={name}
                    onChange={onChange}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered"
                    id="email"
                    value={email}
                    onChange={onChange}
                  />
                </div>
                <div className="form-control ">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={onChange}
                    className="input input-bordered "
                  />
                  <img
                    src={visibilityIcon}
                    className="w-5 justify-center ml-72 cursor-pointer"
                    alt="showPassword"
                    onClick={() => {
                      setShowPassword((prevState) => !prevState);
                    }}
                  />
                 
                </div>
                <div className="form-control ">
                  <button className="btn btn-secondary">Sign-Up</button>
                </div>
                <OAuth/>
                <Link
                  to="/sign-in"
                  className="label-text-alt link link-hover text-accent-focus font-bold text-center"
                >
                  Sign In Instead
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
