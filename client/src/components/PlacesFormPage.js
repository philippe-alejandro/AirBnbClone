import { useEffect, useState } from "react";
import Perks from "./Perks";
import PhotoUploader from "./PhotoUploader";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import AccountNavigation from "./AccountNavigation";

export default function PlacesFormPage () {
  // these are all the state variables used to store the value of each input
  // in the form. 
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);
  // the callback inside the useEffect hook will execute every time the "id" 
  // variable changes and on the first render as well. 
  useEffect(() => {
    if (!id) {
      return;
    }
    // if the "id" state variable does have a value
    axios.get("/places/" + id).then(response => {
      // the "data" property in the response object is selected. 
      const {data} = response;
      // the value of all input values is changed using these "set" functions. 
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    })
  }, [id]);
  // the "inputHeader" and "inputDescription" are used to avoid a redundance of
  // the same element over and over again in the form. 
  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    )
  }

  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    )
  }
  // "preInput" takes the two previous function definitions and uses them inside
  // the same function. 
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    )
  }

  // this function is executed when the "Save" button is clicked. 
  async function savePlace(ev) {
    // this prevents the form to have its default behavior when submitted. 
    ev.preventDefault();
    // all state variables alongside their current values are stored in this object. 
    const placeData = { title, address, addedPhotos, description, perks, 
      extraInfo, checkIn, checkOut, maxGuests, price
    };
    // a put request is performed if the accomodation in the form already exists
    // in the collection. The syntax "{id, ...placeData}" is used to put the 
    // all data of the "placeData" object into another object to be stored in the 
    // collection. This helps avoid writing all variables individually. 
    if (id) {
      await axios.put("/places", {id, ...placeData});
      setRedirect(true);
    } else {
      // this block is run if the "id" variable has no value. In other words,
      // if the accomodation does not exist yet in the collection. 
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  // if the "redirect" variable is set to true in the "savePlace" function, 
  // the block below will be executed. After execution, this will take the user
  // to the endpoint "/account/places"
  if (redirect) {
    console.log('redirect');
    return <Navigate to={"/account/places"}/>
  }

  return (
    <div>
      {/* 
        "AccountNavigation" serves to reuse code by making the codebase smaller
        and more maintainable. 
      */}
      <AccountNavigation/>
      {/*
        the "onChange" attribute is used pretty much in every input element in order
        to update the value of every state variable. The "value" attribute is used to 
        display the current value of the variable whether it's null or it's not. 
      */}
      <form onSubmit={savePlace}>  
        {preInput("Title", "Title for your place. Should be catchy and short as an advertisemen")}     
        <input type="text" value={title} onChange={(ev)=>{setTitle(ev.target.value)}} placeholder="title"/>
        {preInput("Address", "Address to the place.")}
        <input type="text" value={address} onChange={(ev)=>{setAddress(ev.target.value)}} placeholder="address"/>
        {preInput("Photos", "more = better")}
        <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
        {preInput("Description","Description of the place.")}
        <textarea value={description} onChange={(ev)=>{setDescription(ev.target.value)}}/>
        <Perks selected={perks} onChange={setPerks}/>
        {preInput("Extra info","house rules, etc.")}
        <textarea value={extraInfo} onChange={(ev)=>{setExtraInfo(ev.target.value)}}/>
        {preInput("Check In/Out times, max # of guests","Add check in/out times.")}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div className="mt-1">
            <h3 className="mt-2 -mb-1">Check In Date</h3>
            <input type="date" value={checkIn} onChange={(ev)=>{setCheckIn(ev.target.value)}}/>
          </div>
          <div className="mt-1">
            <h3 className="mt-2 -mb-1">Check Out Date</h3>
            <input type="date" value={checkOut} onChange={(ev)=>{setCheckOut(ev.target.value)}}/>
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max Number Of Guests</h3>
            <input type="number" value={maxGuests} onChange={(ev)=>{setMaxGuests(ev.target.value)}}/>
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price Per Night</h3>
            <input type="number" value={price} 
                   onChange={(ev)=>{setPrice(ev.target.value)}}/>
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  )
}