import React from "react";
import { Link } from "react-router-dom";
import { FaBed, FaBath } from "react-icons/fa";
import {AiTwotoneDelete} from 'react-icons/ai'

function ListingItem({ listing, id ,onDelete }) {
  return (
    <li>
      <Link
        to={`/category/${listing.type}/${id}`}
        className="flex flex-row justify-evenly my-2 md:my-4 lg:my-8"
      >
        <figure className="w-full md:w-1/2 lg:w-1/3 my-2 md:my-4 lg:my-8">
          <img
            className="shadow-xl rounded-xl"
            src={listing.imageUrls[0]}
            alt={listing.name}
          />
        </figure>
        <div className="ml-2 my-2 md:my-4 lg:my-8">
          <p className="text-neutral">{listing.location}</p>
          <div className="card-title text-secondary">
            <p>{listing.name}</p>
          </div>
          <p className=" font-bolder mt-2 font-bold text-primary-focus ">
            ₹ {listing.offer ? listing.discountedPrice : listing.regularPrice}
            {listing.type === "rent" && " / Month"}
          </p>
          <div className="mt-2 text-base-neutral w-full flex font-bold">
            <FaBed className="w-5 mt-1 mr-2" />
            <p>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </p>
            <FaBath className="w-5 mt-1 mr-2" />
            <p>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : "1 Bathroom"}
            </p>
            {onDelete && (
              <AiTwotoneDelete
                className="w-12 text-xl text-error-content  mt-1 mr-2"
                onClick={() => onDelete(listing.id, listing.name)}
              />
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default ListingItem;
