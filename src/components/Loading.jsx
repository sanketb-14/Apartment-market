import React from 'react'

function Loading() {
  return (
    <div className="card w-full bg-base-100 h-screen flex justify-center items-center">
        <button className="btn btn-ghost loading w-full h-full text-2xl  font-bold">
            <h1 className="text-base-content loading">Loading...</h1>
        </button>


    </div>

  )
}

export default Loading