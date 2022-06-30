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
import ListingItem  from "../components/ListingItem";
import Loading from '../components/Loading'

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      //get reference
      const listingRef = collection(db, "listings");

      // create a query

      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
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
  }, [params.categoryName]);
  return (
    <div className="card bg-base-100 w-full">
      <div className="card-body ">
        <header className="card-title text-secondary w-full">
          {params.categoryName === "rent"
            ? "Places for Rent"
            : "Places for sale"}
        </header>
        {loading ? (
          <Loading />
        ) : listings && listings.length > 0 ? (
          <>
            <main className="card bg-base-100 w-full">
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
          <p className="font-semibold p-4">
            No listings for {params.categoryName}
          </p>
        )}
      </div>
    </div>
  );
}

export default Category;
