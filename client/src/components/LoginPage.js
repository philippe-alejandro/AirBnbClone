import { Link, Navigate } from "react-router-dom";
import { useState, useContext } from 'react';
import axios from "axios";
import { UserContext } from "../UserContext.js";
import LoginModal from "./LoginModal.js";

export default function LoginPage() {
  // state variables are defined to determine how the 'Login' page will function
  // and help authenticate the user. 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false); // Add state for showing/hiding the modal


  // this function is executed when the submit button of the form is clicked after all the fields have been
  // filled. Then a post request is sent to the server for the user to login. 
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      // a post request is used in this case instead of a get request because the login
      // credentials would be shown in the URL as query parameters and that would make it
      // easier for an attacker to steal the credentials. The object as the second argument,
      // is placed in the body of the request. 
      const { data } = await axios.post("/login", {email, password});
      // the "user" variable is updated. 
      if (data === "not found") {
        console.log("no user if statement: " ,data);
        setShowModal(true);
        return;
      }
      setUser(data);
      // message shown when login is succesful. 
      alert("Login Successful");
      // "redirect" value is updated. 
      setRedirect(true);

    } catch (e) {
      alert("Login Failed");
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  // if "redirect" is true, then the user is taken to the index page. 
  if (redirect) {
    // the "Navigate" component from "react-router-dom" is used to navigate
    // to another page or component from any component. 
    return <Navigate to={'/'}/>
  }

  return (
    <div className="mt-4 grow flex items-center justify-around"> 
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input type="email" 
                 placeholder="your@email.com" 
                 value={email} 
                 onChange={(e)=>{setEmail(e.target.value)}}/>
          <input type="password" 
                 placeholder="password" 
                 value={password} 
                 onChange={(e)=>{setPassword(e.target.value)}}/>
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">          
            Don't have an account yet? <Link className="underline text-black" to={"/register"}>Register now</Link>
          </div>
        </form>
        {/* Conditionally render the LoginModal */}
        {showModal && <LoginModal handleCloseModal={handleCloseModal} />}
      </div>
    </div>
  )
}