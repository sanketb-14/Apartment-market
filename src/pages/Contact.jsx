import {useState, useEffect} from 'react'
import {useParams , useSearchParams} from 'react-router-dom'
import {doc , getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'

function Contact() {
    const [message , setMessage] = useState('')
    const [owner , setOwner] = useState(null)
    const [searchParams , setSearchParams] = useSearchParams()
    const params = useParams()
   useEffect(() => {
    const getOwner= async()=> {
         const docRef = doc(db, "users", params.ownerId);
         const docSnap = await getDoc(docRef);

         if(docSnap.exists()){
            setOwner(docSnap.data())

         }else{
            toast.error('Unable to get Owner details')
         }

    }
    getOwner()
   },[params.ownerId])

   const onChange = e => setMessage(e.target.value)


  return (
    <main className="card w-full flex justify-center items-center">
      <div className="card-body "></div>
      <h1 className="w-full md:w-1/4 lg:w-1/5  text-2xl font-bold text-primary border-b-2 border-secondary pb-1">
        Contact Owner
      </h1>
      {owner !== null && (
        <div className="card-body w-full md:w-4/5 lg:w-1/2 ">
          <div className="card-title">
            Contact to :-<span className="text-secondary">{owner?.name}</span>
          </div>
          <form>
            <label htmlFor="message" className="label flex flex-col w-full   p-2 mt-4">
              <p className="text-start w-full text-semibold text-accent text-xl">
                Message
              </p>
              <textarea
                name="message"
                id="message"
                className="input-group rounded-xl shadow-2xl w-full outline-none mt-4 h-56 my-16 border-primary border-2 p-4"
                value={message}
                onChange={onChange}
                placeholder="Write your Message here"
              ></textarea>
            </label>
            <a href={`mailto:${owner.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
              <button type='button' className="btn btn-primary w-full">Send Message</button>
            </a>

          </form>
        </div>
      )}
    </main>
  );
}

export default Contact
