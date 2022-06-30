import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth  from "../components/OAuth";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredentials.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Wrong user Credentials");
    }
  };
  return (
    <>
      <div className="hero min-h-screen bg-neutral-content">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left m-4">
            <h1 className="text-5xl font-bold ">Welcome Back..!!</h1>
            <p className="py-6 text-2xl font-semibold text-secondary">
              Login Now!
            </p>
          </div>
          <div className="card flex-shrink w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={onSubmit}>
              <div className="card-body">
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
                  <Link
                    to="/forgot-password"
                    className="label-text-alt link link-hover text-accent-focus font-semibold"
                  >
                    Forgot password
                  </Link>
                </div>
                <div className="form-control mt-2">
                  <button className="btn btn-secondary">Login</button>
                </div>
                <OAuth/>
                <Link
                  to="/sign-up"
                  className="label-text-alt link link-hover text-accent-focus font-bold text-center"
                >
                  Sign Up Instead
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
