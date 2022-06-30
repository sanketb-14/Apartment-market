import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";

import { FaShareAlt, FaParking, FaBed, FaBath, FaHome } from "react-icons/fa";

import Loading from "../components/Loading";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setSharedLinkCopied] = useState(null);

 

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="card w-full flex flex-row">
      <div className="card-body w-full m-auto lg:w-3/4 md:w-4/5  p-2">
        <div className="card-title text-bold text-secondary">
          {listing.name} -{" "}
          <span className="font-bold text-2xl  text-primary border-b-4 border-secondary p-2 mt-2">
            ₹ {listing.offer ? listing.discountedPrice : listing.regularPrice}
          </span>
          <div className="navbar w-1/3 flex justify-end">
            {auth.currentUser?.uid !== listing.userRef && (
              <Link
                to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                className="btn btn-secondary mt-8 w-full lg:w-1/2 md:w-1/2"
              >
                Contact Owner
              </Link>
            )}
          </div>
        </div>
        <p className="text-base">{listing.location}</p>
        <div className=" flex flex-row w-1/2 m-2">
          <p className="btn btn-sm  w-16 mr-8 ">
            For {listing.type === "rent" ? "Rent" : "Sale"}
          </p>
          {listing.offer && (
            <p className="font-semibold  w-1/2 text-accent text-xl">
              - ₹{listing.regularPrice - listing.discountedPrice} discount
            </p>
          )}
          <div
            className="share-icon  w-full h-16 flex justify-start items-start "
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setSharedLinkCopied(true);
              setTimeout(() => {
                setSharedLinkCopied(false);
              }, 2000);
            }}
          >
            <span className="w-8 h-8 bg-base-200 rounded-full items-center justify-center flex">
              <FaShareAlt className=" text-xl w-8 text-accent  p-1 rounded-full" />
            </span>
          </div>
          {shareLinkCopied && <p className="text-base-300"> Link copied successfully !!</p>}
        </div>
        <ul className="flex-flex-col justify-evenly mt-2">
          <li className="font-semibold text-xl flex flex-row text-primary">
            <FaBed className="text-2xl mr-4 mt-0.6" />
            {listing.bedrooms > 1 ? `${listing.bedrooms}Bedrooms` : "1 Bedroom"}
          </li>
          <li className="font-semibold text-xl flex flex-row text-primary">
            <FaBath className="text-2xl mr-4 mt-0.6" />
            {listing.bathrooms > 1
              ? `${listing.bathrooms}Bathrooms`
              : "1 Bathroom"}
          </li>
          <li className="font-semibold text-xl flex flex-row text-primary">
            <FaParking className="text-2xl mr-4 mt-0.6" />
            {listing.parking && "Parking Spot"}
          </li>
          <li className="font-semibold text-xl flex flex-row text-primary">
            <FaHome className="text-2xl mr-4 mt-0.6" />
            {listing.furnished && "Furnished"}
          </li>
        </ul>
        <div className="card w-full grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-2">
          {listing.imageUrls.map((url, index) => {
            return (
              <div
                key={index}
                style={{
                  background: `url(${listing.imageUrls[index]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="w-full h-96 relative "
              ></div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Listing;


