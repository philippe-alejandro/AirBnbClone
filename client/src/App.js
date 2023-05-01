import "./App.css";
import { Routes, Route } from "react-router-dom";
import IndexPage from "./components/IndexPage.js";
import LoginPage from "./components/LoginPage.js";
import RegisterPage from "./components/RegisterPage.js";
import Layout from "./components/Layout.js";
import ProfilePage from "./components/ProfilePage.js";
import PlacesPage from "./components/PlacesPage.js";
import PlacePage from "./components/PlacePage.js";
import PlacesFormPage from "./components/PlacesFormPage.js";
import BookingsPage from "./components/BookingsPage.js";
import BookingPage from "./components/BookingPage.js";
import axios from "axios";
import { UserContextProvider } from "./UserContext";

axios.defaults.baseURL = "http://localhost:3000"; // http://192.168.18.5:3000
axios.defaults.withCredentials = true; 

function App() {

  return (
    // UserContextProvider
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}> {/*done*/}
          <Route index element={<IndexPage/>}/> {/*done*/}
          <Route path="/login" element={<LoginPage/>}/> {/*done*/}
          <Route path="/register" element={<RegisterPage/>}/> {/*done*/}
          <Route path="/account/" element={<ProfilePage/>}/> {/*done*/}
          <Route path="/account/places" element={<PlacesPage/>}/> {/*done*/}
          <Route path="/account/places/new" element={<PlacesFormPage/>}/> {/*done*/}
          <Route path="/account/places/:id" element={<PlacesFormPage/>}/> {/*done*/}
          <Route path="/place/:id" element={<PlacePage/>}/> {/*done*/}
          <Route path="/account/bookings" element={<BookingsPage/>}/> {/*done*/}
          <Route path="/account/bookings/:id" element={<BookingPage/>}/> {/*done*/}
        </Route>
      </Routes>  
    </UserContextProvider>
  );
}

export default App;