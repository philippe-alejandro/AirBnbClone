import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNavigation from "./AccountNavigation";
import PlaceImg from "./PlaceImg.js"

// this component is used to create all the accomodations a user can offer
// for other people to rent from them. 
export default function PlacesPage() {
  // the "places" state variables is initiated. This array will store any 
  // accomodations a user creates for renting to other people. 
  const [places, setPlaces] = useState([]);
  // a get request is done to the "/user-places" endpoint. This will take all
  // accommodations a specific user has created. 
  useEffect(() => {
    // {data} is a property taken from the response object returned by the 
    // route in the backend code. 
    axios.get("/user-places").then(({data}) => {
      // the "places" state variable is modified. 
      setPlaces(data);
    });
  }, []);
  return (
  <div>
    {/*
      the "AccountNavigation" component is imported to reduce the size of the 
      codebase and improve maintenance. 
    */}
    <AccountNavigation/>
      <div className="text-center">    
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 mt-10 rounded-full" to={"/account/places/new"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new place
        </Link>
      </div>
      {/*
        if the "places" array is not empty, each of the accomodations created
        will be put inside a "Link" component that when clicked takes the user
        to the property's individual page. Other data is included in this "Link"
        component such as the title and description. 
      */}
      <div className="mt-4">
        {places.length > 0 && places.map(place => (
          <Link to={"/account/places/" + place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mt-2" key={place._id}>
            <div className="flex w-32 h-32 bg-gray-300 shrink-0">
              <PlaceImg place={place}/>
            </div>
            <div>
              <h2 className="text-xl">{place.title}</h2>
              <p className="text-sm mt-2">{place.description}</p>
            </div>
          </Link>
        ))}
      </div>
  </div>
  );
}