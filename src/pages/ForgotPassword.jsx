import {useState} from 'react'
import {Link} from 'react-router-dom'
import {FaHouseUser} from 'react-icons/fa'
import { MdMarkEmailUnread } from "react-icons/md";
import {getAuth,sendPasswordResetEmail} from 'firebase/auth'
import {toast} from 'react-toastify'

function ForgotPassword() {
  const [email,setEmail] = useState('')
  const onChange = (e) => {
    setEmail(e.target.value)

  }
  const onSubmit=async(e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth,email)
      toast.success('Email was sent')
      
    } catch (error) {
      toast.error('Could not send Reset Email')
      
    }

  }
  return (
    <div className="card h-screen w-full bg-base-200">
      <h1 className="text-3xl ml-8 font-bold">Forgot Password</h1>
      <form onSubmit={onSubmit}>
        <div className="card-body w-2/3">
          <div className="form-control">
            <label className="input input-bordered flex flex-col card-body h-full">
              <span className="label-text text-secondary font-semibold">
                User Email{" "}
              </span>
              <div className="flex flex-row border-b-2 border-secondary ">
                <FaHouseUser className="mr-8 mt-2 w-5" />
                <input
                  type="email"
                  placeholder="Email"
                  className=" outline-none bg-base-100 w-full"
                  id="email"
                  value={email}
                  onChange={onChange}
                />
              </div>
            </label>
          </div>
          <Link
            to="/sign-in"
            className="link font-bold text-secondary text-end"
          >
            Sign-in
          </Link>
          <button className="btn btn-secondary w-96 ">
            Send Password Reset Link
            <MdMarkEmailUnread className="ml-8  text-xl" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword