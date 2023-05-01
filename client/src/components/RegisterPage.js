import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  // state variables are created here to handle the registration process. 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // this function is executed when the form for registering is submitted. 
  async function registerUser(ev) {
    ev.preventDefault();
    // this block is executed. If an error emerges, then the catch block is 
    // executed. 
    try {
      // a post request is made to the "/register" endpoint. The second argument
      // which is an object containing the user's data, will be accessible from 
      // the request's body. 
      await axios.post("http://localhost:3000/register", {
      name, 
      email, 
      password
      },
      {
        withCredentials: true
      });
      alert('Registration successfull. Now you can log in.');
    } catch(e) {
      alert('Registration failed. Please try again later.')
    }
  }
  return (
    <div className="mt-4 grow flex items-center justify-around"> 
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input type="text" 
                 placeholder="John Doe" 
                 value={name} onChange={(e)=>{setName(e.target.value)}}/>
          <input type="email" 
                 placeholder="your@email.com" 
                 value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
          <input type="password" 
                 placeholder="password" 
                 value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">          
            Already a member? <Link className="underline text-black" to={"/login"}>Login now</Link>
          </div>
        </form>
      </div>
    </div>
  )
}