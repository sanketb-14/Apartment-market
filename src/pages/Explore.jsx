import React from "react";
import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";

function Explore() {
  return (
    <div className="w-full justify-center items-center">
      <div className="text-3xl font-bold w-full">
        <h1 className="text-start p-4 border-b-2 w-1/4 m-2 border-secondary text-primary">Explore</h1>
      </div>
      <div className="card w-full">
        <div className="card-title  text-secondary w-full justify-center">
          <h1>Categories</h1>
        </div>
        <div className="card-body flex flex-row justify-center items-center">
          <div className=" card w-5/12  mr-8">
            <Link to="/category/rent">
              <figure className="">
                <img
                  src={rentCategoryImage}
                  alt="rent-category"
                  className="rounded-xl"
                />
              </figure>
              <div className="card-body">
                <div className="card-title text-accent-focus">
                  Places for Rent
                </div>
              </div>
            </Link>
          </div>
          <div className=" card w-5/12 ">
            <Link to="/category/sale">
              <figure className="">
                <img
                  src={sellCategoryImage}
                  alt="sale-category"
                  className="rounded-xl"
                />
              </figure>
              <div className="card-body">
                <div className="card-title text-accent-focus">
                  Places for Sale
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
