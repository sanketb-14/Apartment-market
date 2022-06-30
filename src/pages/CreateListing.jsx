import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    location: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    location,
    offer,
    regularPrice,
    discountedPrice,
    images,
  } = formData;
  const auth = getAuth();
  const isMounted = useRef(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);
  if (loading) {
    return <Loading />;
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }
    //store images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    // delete formDataCopy.address
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);

    setLoading(false);
    toast.success("Listing saved");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };
  const onMutate = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    //file
    if (e.target.files) {
      setFormData((prevState) => ({ ...prevState, images: e.target.files }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  return (
    <div className="card w-full flex justify-center items-center">
      <p className="font-bold text-3xl p-2 m-2 border-b-2 border-accent">
        Create a Listing
      </p>
      <main className="card-body w-full md:w-11/12 lg:w-10/12  rounded-xl shadow-2xl">
        <form onSubmit={onSubmit} className="w-11/12">
          <div className="form-control">
            <label className="input-group font-semibold text ">
              Sell / Rent
            </label>
            <div className="button-group mt-1 w-full">
              <button
                type="button"
                className={
                  type === "sale"
                    ? "btn btn-accent w-1/4 text-base-100"
                    : " btn btn-ghost w-1/4"
                }
                id="type"
                value="sale"
                onClick={onMutate}
              >
                Sell
              </button>
              <button
                type="button"
                className={
                  type === "rent"
                    ? "btn btn-accent w-1/4 text-base-100"
                    : " btn btn-ghost w-1/4"
                }
                id="type"
                value="rent"
                onClick={onMutate}
              >
                Rent
              </button>
            </div>
            <div className="form-control w-full mt-2">
              <label className="label">
                <span className="label-text font-semibold">Your Name</span>
              </label>
              <label className="input-group  lg:w-1/2 border-b-2 border-accent">
                <span className="p-2 mb-1 rounded bg-accent text-base-100 font-semibold">
                  Name
                </span>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={onMutate}
                  maxLength="40"
                  minLength="6"
                  required
                  placeholder="Name"
                  className="m-1 p-1 bg-transparent border-none lg:w-1/2 sm:w-full border-b-2 border-accent outline-none"
                />
              </label>
            </div>
            <div className="card flex w-full flex-row justify-start ">
              <div className="form-control w-2/5 mr-4 mt-2">
                <label className="label">
                  <span className="label-text font-semibold">Bedrooms</span>
                </label>
                <label className="input-group  lg:w-1/2 border-b-2 border-accent">
                  <input
                    type="number"
                    id="bedrooms"
                    value={bedrooms}
                    onChange={onMutate}
                    max="50"
                    min="1"
                    required
                    className="m-1 p-1  bg-transparent border-none lg:w-1/2 sm:w-full border-b-2 border-accent outline-none text-center"
                  />
                </label>
              </div>
              <div className="form-control w-2/5 mr-4 mt-2">
                <label className="label">
                  <span className="label-text font-semibold">Bathrooms</span>
                </label>
                <label className="input-group  lg:w-1/2 border-b-2 border-accent">
                  <input
                    type="number"
                    id="bathrooms"
                    value={bathrooms}
                    onChange={onMutate}
                    max="50"
                    min="1"
                    required
                    className="m-1 p-1 bg-transparent border-none lg:w-1/2 sm:w-full border-b-2 border-accent outline-none text-center"
                  />
                </label>
              </div>
            </div>
            <div className="form-control w-2/3 mr-4 mt-2">
              <label className="label">
                <span className="label-text font-semibold border-b-2 border-accent pb-1">
                  Parking
                </span>
              </label>
              <div className="button-group mt-1 w-full">
                <button
                  type="button"
                  className={
                    parking
                      ? "btn btn-accent w-1/4 text-base-100"
                      : " btn btn-ghost w-1/4"
                  }
                  id="parking"
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={
                    !parking && parking !== null
                      ? "btn btn-accent w-1/4 text-base-100"
                      : " btn btn-ghost w-1/4"
                  }
                  id="type"
                  value={false}
                  onClick={onMutate}
                >
                  No
                </button>
              </div>
            </div>
            <div className="form-control w-2/3 mr-4 mt-2">
              <label className="label">
                <span className="label-text font-semibold border-b-2 border-accent pb-1">
                  Furnished
                </span>
              </label>
              <div className="button-group mt-1 w-full">
                <button
                  type="button"
                  className={
                    furnished
                      ? "btn btn-accent w-1/4 text-base-100"
                      : " btn btn-ghost w-1/4"
                  }
                  id="furnished"
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={
                    !furnished && furnished !== null
                      ? "btn btn-accent w-1/4 text-base-100"
                      : " btn btn-ghost w-1/4"
                  }
                  id="type"
                  value={false}
                  onClick={onMutate}
                >
                  No
                </button>
              </div>
            </div>
            <div className="form-control">
              <label className="label lg:w-1/2">
                <span className="label-text font-semibold border-b-2 border-accent pb-1">
                  Address
                </span>
              </label>
              <textarea
                className="textarea textarea-accent lg:w-1/2"
                type="text"
                id="location"
                value={location}
                onChange={onMutate}
                required
                placeholder="Address"
              />
            </div>
            <div className="form-control w-2/3 mr-4 mt-2">
              <label className="label">
                <span className="label-text font-semibold border-b-2 border-accent pb-1">
                  Offer
                </span>
              </label>
              <div className="button-group mt-1 w-full">
                <button
                  type="button"
                  className={
                    offer
                      ? "btn btn-accent w-1/4 text-base-100"
                      : " btn btn-ghost w-1/4"
                  }
                  id="offer"
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={
                    !offer && offer !== null
                      ? "btn btn-accent w-1/4 text-base-100"
                      : " btn btn-ghost w-1/4"
                  }
                  id="offer"
                  value={false}
                  onClick={onMutate}
                >
                  No
                </button>
              </div>
            </div>
            <div className="form-control w-full mt-2">
              <label className="label">
                <span className="label-text font-semibold border-b-2 border-accent pb-1">
                  Regular Price
                </span>
              </label>
              <label className="input-group w-full  lg:w-1/2 border-b-2 border-accent">
                <span className="p-2 mb-1 rounded bg-accent text-base-100 font-semibold w-1/4 justify-center">
                  Price
                </span>
                <div className="flex w-full">
                  <input
                    type="number"
                    id="regularPrice"
                    value={regularPrice}
                    onChange={onMutate}
                    min="50"
                    max="100000000"
                    required
                    className="m-1 p-1 bg-transparent border-none w-full md:w-2/3 lg:w-1/2  border-b-2 border-accent outline-none text-center "
                  />
                  {type === "rent" && (
                    <p className="w-full text-center font-semibold p-2">
                      $ / Month
                    </p>
                  )}
                </div>
              </label>
            </div>
            {offer && (
              <>
                <div className="form-control w-full mt-2">
                  <label className="label">
                    <span className="label-text font-semibold border-b-2 border-accent pb-1">
                      Discounted Price
                    </span>
                  </label>
                  <label className="input-group w-full  lg:w-1/2 border-b-2 border-accent">
                    <span className="p-2 mb-1 rounded bg-accent text-base-100 font-semibold w-1/4 justify-center">
                      Price
                    </span>
                    <div className="flex w-full">
                      <input
                        type="number"
                        id="discountedPrice"
                        value={discountedPrice}
                        onChange={onMutate}
                        max="100000000"
                        required={offer}
                        className="m-1 p-1 bg-transparent border-none w-full md:w-2/3 lg:w-1/2  border-b-2 border-accent outline-none text-center "
                      />
                      {type === "rent" && (
                        <p className="w-full text-center font-semibold p-2">
                          $ / Month
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </>
            )}
            <div className="form-control w-full lg:1/2 mt-4">
              <label className="label">
                <span className="label-text font-semibold border-b-2 border-accent pb-1">
                  Images
                </span>
                <p className="m-2 ml-5 text-base-300">
                  {" "}
                  The first image will be the cover image (max-6)
                </p>
              </label>
              <label className="input-group w-full  lg:w-1/2 border-b-2 border-accent">
                <input
                  type="file"
                  id="images"
                  onChange={onMutate}
                  max="6"
                  accept=".jpg,.png,.jpeg"
                  multiple
                  required
                  className="block w-full text-sm text-base-300
                                      file:mx-4 file:py-2 file:px-4
                           file:rounded-xl file:border-0
                                    file:text-sm file:font-semibold
                                      file:bg-accent file:text-base-100
                                    hover:file:bg-accent-focus mb-1
                                    "
                />
              </label>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center mt-16">
            <button className="btn btn-accent w-full capitalize text-base-100 font-semibold text-xl">
              Create Listing
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
