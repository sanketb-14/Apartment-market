import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Loading from "../components/Loading";

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      //get reference
      const listingRef = collection(db, "listings");

      // create a query

      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(10) 
      );

      //Execute query
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
      try {
      } catch (error) {
        toast.error("could not load Data");
      }
    };
    fetchListings();
  });
  return (
    <div className="card bg-base-100">
      <div className="card-body flex justify-center items-center">
        <header className="card-title text-secondary w-full">Offers</header>
        {loading ? (
          <Loading />
        ) : listings && listings.length > 0 ? (
          <>
            <main className="card bg-base-100 w-11/12">
              <ul className="mx-auto grid grid-cols-1 lg:gap-x-20 lg:grid-cols-2">
                {listings.map((listing) => (
                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                  />
                ))}
              </ul>
            </main>
          </>
        ) : (
          <p className="font-semibold p-4 text-2xl">
            There are no current offers
          </p>
        )}
      </div>
    </div>
  );
}

export default Offers;
