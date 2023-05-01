import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "./BookingWidget.js";
import PlaceGallery from "./PlaceGallery.js";

export default function PlacePage() {
  // the "useParams" hook provides access to the "params" object in the 
  // "Route" component and enables to destructure or select any property 
  // from the "params" object. 
  const {id} = useParams();
  // a state variable to store the place's data. 
  const [place, setPlace] = useState(null);
  // every time the "id" value changes the callback inside "useEffect" is
  // executed. A get request is made to get the data of a specific place. 
  // The "place" state variable is updated using the response's data property. 
  useEffect(() => {
    if (!id) {
      return
    }
    axios.get(`/places/${id}`).then(response => {
      setPlace(response.data);
    })
  }, [id]);
  // if no place data was returned with the given id, then an empty string is 
  // returned. 
  if (!place) return "";
  // the options parameter to set a specific format for dates. 
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-2xl">{place.title}</h1>
      <a className="flex gap-1 my-3 block font-semibold underline" target="_blank" href={"https://maps.google.com/?q=" + place.address}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        {place.address}
      </a>
      {/*
        the "PlaceGallery" component is imported to avoid to much code in the same
        file. This is know as modularization or separating an app's codebase into
        different files to improve maintenance. This component allows to select
        pictures of the property and scroll over them. 
      */}
      <PlaceGallery place={place}/>
      <div className="mt-8 mb-8 grid gap-8 grid-cols-2 grid-cols-2fr flex flex-col min-w-746px">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
          </div>
          Check-in: {new Date(place.checkIn).toLocaleDateString('en-US', options)}<br/>
          Check-out: {new Date(place.checkOut).toLocaleDateString('en-US', options)}<br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          {/*
            "BookingWidget" is also imported or its code is created in a separate file. This 
            component is used to book an accomodation. 
          */}
          <BookingWidget place={place}/>
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">
            Extra Info
          </h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-4">
          {place.extraInfo}
        </div>
      </div>
    </div>
  )
}