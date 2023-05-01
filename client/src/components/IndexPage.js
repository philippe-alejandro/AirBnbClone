import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() { 
  // the initial value of the "places" state variable is an empty array. 
  // this variable will contain all available properties for rent in the app. 
  const [places, setPlaces] = useState([]);
  // on the initial render all properties are retrieved using a get request
  // and stored in the "places" array. 
  useEffect(() => {
    axios.get("/places").then(response => {
      setPlaces(response.data);
    });
  }, [])
  // console.log(places.length);
  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">    
      {/*
        If the places array is not empty, it will be iterated and for each property
        a "Link" component will be used. When the "Link" component is cliked it will
        redirect to the property's page. The first photo will be used for each of the 
        properties. Data such as the: address, title, and price are displayed.  
      */}
      {places.length > 0 && places.map(place => (
        <Link to={"/place/" + place._id} key={place._id}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {place.photos?.[0] && (
              <img className="rounded-2xl object-cover aspect-square" src={"http://localhost:3000/uploads/" + place.photos?.[0]} alt=""/>
            )}
          </div>
          <h2 className="font-bold">{place.address}</h2>          
          <h3 className="text-sm truncate text-gray-500">{place.title}</h3>
          <div className="mt-1">
            <span className="font-bold">${place.price} per night</span>
          </div>
        </Link>
      )
      )}
    </div>
  );
}