import { useEffect, useState, useContext } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext.js";
import LoginModalBooking from "./LoginModalBooking";

export default function BookingWidget({place}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const {user} = useContext(UserContext);
  const [bookingShowModal, setBookingShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user])

  let numberOfDays = 0;
  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }
  
  async function bookThisPlace() {
    if (!user) {
      setBookingShowModal(true);
      return;
    }

    const data = {checkIn, checkOut, numberOfGuests, 
      name, phone, place: place, price: numberOfDays * place.price
    }; 
    // console.log("data: ", data);           
    const response = await axios.post("/bookings", data);
    // console.log("response: ", response);  
    const bookingId = response.data._id;
    // console.log("booking Id: ", response.data._id);
    setRedirect(`/account/bookings/${bookingId}`);
  }

  function handleCloseModal() {
    setRedirect('/login');
    setBookingShowModal(false);
  }

  if (redirect) {
    return <Navigate to={redirect}/>
  }

  return (
    <div className="bg-white shadow p-1 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border mt-4 rounded-2xl">
        <div className="flex">
          <div className="py-4 px-2 border-r w-1/2">
            <label>Check In:</label>
            <input value={checkIn} 
                   onChange={(ev) => {setCheckIn(ev.target.value)}} 
                   type="date"/>
          </div>
          <div className="py-4 px-2 border-l w-1/2">
            <label>Check Out:</label>
            <input value={checkOut} 
                   onChange={(ev) => {setCheckOut(ev.target.value)}} 
                   type="date"/>
          </div>
        </div>
        <div className="py-3 px-2 border-t">
          <label>Number of guests:</label>
          <input value={numberOfGuests} 
                 onChange={(ev) => {setNumberOfGuests(ev.target.value)}} 
                 type="number"/>
        </div>

        {numberOfDays > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text" 
                   value={name} 
                   onChange={ev => setName(ev.target.value)}/>
            <label>Phone Number:</label>
            <input type="tel" 
                   value={phone}
                   onChange={ev => setPhone(ev.target.value)}/>
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfDays > 0 && (
          <span> ${numberOfDays * place.price}</span>
        )}
      </button>
      {/* Conditionally render the LoginModal */}
      {bookingShowModal && <LoginModalBooking handleCloseModal={handleCloseModal} />}
    </div>
  )
}