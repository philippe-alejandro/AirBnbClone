import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AddressLink from "./AddressLink.js";
import axios from "axios";
import PlaceGallery from "./PlaceGallery";
import BookingDates from "./BookingDates.js";

export default function BookingPage() {
  // "useParams" accesses the "params" property of the "Route" component.
  // The only parameter used is "id" which is selected below. 
  const { id } = useParams();
  // state variable is initiated
  const [booking, setBooking] = useState(null);
  // callback in the "useEffect" hook is executed every time the id changes and 
  // on the initial render as well. 
  useEffect(() => {
    // if id has a value the next code block executes. 
    if (id) {
      // get request is used to select all bookings. 
      axios.get("/bookings").then(response => {
        // after all bookings have been retrieved, they are filtered to only
        // select one booking. 
        const foundBooking = response.data.find(({_id}) => _id === id);
        // if a booking is found with the given id, the booking state variable
        // is updated.
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);
  // if no booking was found, an empty string is returned. 
  if (!booking) {
    return "";
  }

  return (
    <div className="my-8">
      {/*
        AddressLink, BookingDates, and PlaceGallery are imported to keep a clean
        and maintainable codebase. 
      */}
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">      
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking}/>
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total Price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place}/>
    </div>
  );
}