import React, {  useState , useEffect } from "react";
import {Link} from 'react-router-dom'
import { getAuth,updateProfile } from "firebase/auth";
import {updateDoc,doc , collection , getDocs , query , where, orderBy , deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {useNavigate} from "react-router-dom"
import {toast} from 'react-toastify'
import ListingItem from './../components/ListingItem'
import { FaUserCheck, FaUserTie, FaHome, FaArrowRight } from "react-icons/fa";


function Profile() {
  const auth = getAuth();
  const [listings , setListings] = useState(null)
  const [loading , setLoading] = useState(true)
  const [changeDetails,setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const {name, email} = formData
  const onLogout=()=> {
    auth.signOut()
    navigate('/')

  }
  const onSubmit=async()=> {
    try {
      if(auth.currentUser.displayName !== name){
        await updateProfile(auth.currentUser , {
          displayName: name
        })
        const userRef = doc(db,'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })

      }
      
    } catch (error) {
      toast.error('Unable to update Your Profile details')
    }
  }
  const onChange=(e)=> {
    setFormData((prevState)=> ({
      ...prevState,
      [e.target.id]:e.target.value

    }))

  }
  const onDelete = async(listingId) => {
    if(window.confirm('Are you Sure You want to delete this listing')){
      await deleteDoc(doc(db , 'listings' , listingId))
      const updatedListing = listings.filter((listing) => 
      listing.Id !== listingId)
      setListings(updatedListing)
      toast.success('Listing successfully Deleted')
    

    }


  }
  const  navigate = useNavigate()
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(db , 'listings')
      const q = query(
        listingRef ,
        where('userRef' , '==' , auth.currentUser.uid),
        orderBy('timestamp' , 'desc')
      )

      const querySnap = await getDocs(q)
      let listings = []
      querySnap.forEach((doc) => {
        return listings.push({
          id:doc.id ,
          data: doc.data()
        })
      })
      setListings(listings)
      setLoading(false)
    }
    fetchUserListings()

  },[auth.currentUser.uid])

 

  return (
    <div className="w-full h-full bg-base-200 min-h-screen flex flex-col justify-center items-center ">
      <div className="navbar w-full">
        <div className="flex-1">
          <h1 className="text-3xl w=1/4 flex font-bold text-accent-focus border-y-2 border-secondary py-2">
            My Profile <FaUserTie className="ml-2" />
          </h1>
        </div>
        <div className="flex-none">
          <button
            type="submit"
            onClick={onLogout}
            className="btn btn-accent text-base-100"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="card w-2/3 bg-base-100 m-4 min-h-full shadow-2xl ">
        <div className="card-body">
          <div className="navbar">
            <div className="flex-1">
              <h1 className="card-title text-secondary">Personal Details</h1>
            </div>
            <div className="flex-none">
              <p
                className="btn btn-sm bg-base-300 gap-2 text-info-content hover:bg-accent-focus"
                onClick={() => {
                  changeDetails && onSubmit();
                  setChangeDetails((prevState) => !prevState);
                }}
              >
                {changeDetails ? "Done" : "Change"}
                <FaUserCheck />
              </p>
            </div>
          </div>
          <form>
            <div className="form-control">
              <label className="input-group input-group-vertical font-semibold border-b-2 pb-1 border-secondary mb-4">
                <span>Name</span>
                <input
                  type="text"
                  id="name"
                  className={
                    !changeDetails
                      ? "border-none outline-none p-2 text-xl font-semi-bold pl-12 tracking-wider text-info-content "
                      : "input input-bordered p-2 text-xl font-bold  "
                  }
                  disabled={!changeDetails}
                  value={name}
                  onChange={onChange}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="input-group input-group-vertical font-semibold border-b-2 pb-1 border-secondary">
                <span>Email</span>
                <input
                  type="email"
                  id="email"
                  className={
                    !changeDetails
                      ? "border-none outline-none p-2 text-xl font-semi-bold pl-12 tracking-wider text-info-content "
                      : "input input-bordered p-2 text-xl font-bold  "
                  }
                  disabled={!changeDetails}
                  value={email}
                  onChange={onChange}
                />
              </label>
            </div>
          </form>
        </div>
      </div>
      <div className=" rounded-xl w-1/2 b m-4 min-h-full shadow-2xl hover:bg-accent-focus bg-accent text-base-100">
        <div className="body p-1 m-2 ">
          <Link
            to="/create-listing"
            className="flex justify-center items-center w-full"
          >
            <FaHome className="  text-base-100 text-2xl text-start " />
            <p className="font-semibold mt-0.4 mx-auto border-b-2 pb-1 border-secondary">
              Sell or Rent Your Appartment
            </p>
            <FaArrowRight className="text-2xl  text-base-100" />
          </Link>
        </div>
      </div>
      {!loading && listings?.length > 0 && (
        <>
          <div className="card-body">
            <div className="card-title">Your Listings</div>
          </div>
          <ul className="card-content">
            {listings.map((listing) => (
              <ListingItem 
              key={listing.id} listing={listing.data} id={listing.id} onDelete={()=> onDelete(listing.id)} 
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Profile;
