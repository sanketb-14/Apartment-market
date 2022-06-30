import React from "react";
import Logo from "../assets/jpg/logo.jpg";
import { FaAlignJustify } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathMatchRoute=(route)=> {
    if(route === location.pathname){
      return true
    }

  }
  return (
    <header className="navbar bg-base-100">
      <div className="navbar-center">
        <Link to="/">
          <div className="avatar">
            <div className="w-12 rounded-xl">
              <img src={Logo} alt="logo" />
            </div>
          </div>
        </Link>
        <Link to="/">
          <div className="text-primary lg:text-2xl sm:text-xl font-semibold">
            Apartment-
            <span className="text-secondary lg:text-3xl font-semibold sm:text-xl ">
              Market
            </span>
          </div>
        </Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost lg:hidden ">
            <FaAlignJustify className="w-4 h-4 text-secondary" />
          </button>
          <ul className="menu menu-compact dropdown-content mt-2 p-2 shadow bg-base-100 rounded-box w-48 text-primary-content justify-start">
            <Link
              to="/"
              className={
                pathMatchRoute("/")
                  ? "font-semibold p-4 bg-accent-focus hover:bg-neutral-content active:bg-accent focus:outline-none focus:accent-focus"
                  : "font-semibold p-4 hover:bg-neutral-content active:bg-accent focus:outline-none focus:accent-focus"
              }
              onClick={() => navigate("/")}
            >
              <span>
                <ExploreIcon className="w-8 h-8 text-secondary-content" />

                <p>Explore</p>
              </span>
            </Link>
            <Link
              to="/offers"
              className={
                pathMatchRoute("/offers")
                  ? "font-semibold p-4 bg-accent-focus hover:bg-neutral-content active:bg-accent focus:outline-none focus:accent-focus"
                  : "font-semibold p-4 hover:bg-neutral-content active:bg-accent focus:outline-none focus:accent-focus"
              }
              onClick={() => navigate("/offers")}
            >
              <span>
                <OfferIcon className="w-8 h-8 text-secondary" />

                <p>Offers</p>
              </span>
            </Link>
            <Link
              to="/profile"
              className={
                pathMatchRoute("/profile")
                  ? "font-semibold p-4 bg-accent-focus hover:bg-neutral-content active:bg-accent focus:outline-none focus:accent-focus"
                  : "font-semibold p-4 hover:bg-neutral-content active:bg-accent focus:outline-none focus:accent-focus"
              }
              onClick={() => navigate("/profile")}
            >
              <span>
                <PersonOutlineIcon className="w-8 h-8 text-secondary" />

                <p>Profile</p>
              </span>
            </Link>
          </ul>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0 m-auto flex text-l text-secondary">
          <li
            className={
              pathMatchRoute("/")
                ? "font-semibold p-4 text-primary-focus border-b-2 border-primary"
                : "font-semibold p-4"
            }
            onClick={() => navigate("/")}
          >
            <span>
              <ExploreIcon className="w-8 h-8 text-secondary" />

              <p>Explore</p>
            </span>
          </li>
          <li
            className={
              pathMatchRoute("/offers")
                ? "font-semibold p-4 text-primary-focus border-b-2 border-primary"
                : "font-semibold p-4"
            }
            onClick={() => navigate("/offers")}
          >
            <span>
              <OfferIcon className="w-8 h-8 text-secondary" />

              <p>Offers</p>
            </span>
          </li>
          <li
            className={
              pathMatchRoute("/profile")
                ? "font-semibold p-4 text-primary-focus border-b-2 border-primary"
                : "font-semibold p-4"
            }
            onClick={() => navigate("/profile")}
          >
            <span>
              <PersonOutlineIcon className="w-8 h-8 text-secondary" />

              <p>Profile</p>
            </span>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
