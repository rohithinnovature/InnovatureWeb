import React, { useContext, useRef, useState, useEffect} from "react";
import Topbar from "./Topbar.jsx";
import "./Profile.css"
import profileimage from './Innovature Wallpaper.png'
import { AuthContext } from "../AuthContext.jsx"; 
import { useCookies,Cookies } from "react-cookie";
import axios from "axios";

const Profile = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [profileData, setProfileData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        date_of_birth: ''
    });
    const [email, setEmail] = useState('')
    
    useEffect(() => {
        // Fetch the profile data from the backend
        async function fetchProfile(usernam) {
            try {
                const response = await axios.post(`http://127.0.0.1:8000/authentication/get_user_profile/`, {usernam: usernam});
                setProfileData(response.data); // Update profileData state with fetched data
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
        const usernamefromCookie = cookies.user
        fetchProfile(usernamefromCookie);
    }, []);
        // Function to handle input changes
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setProfileData({ ...profileData, [name]: value });
        };
    
        // Function to handle form submission
        const handleSubmit = async (e) => {
            e.preventDefault();
            console.log("Submitted:", profileData);
            const response =  await axios.post(`http://127.0.0.1:8000/authentication/save_profile/`, {usernam: profileData});
            if (response.data.message) {
                alert(response.data.message)
            }
            if (response.data.errorF) {
                alert(response.data.errorF)
            }
            if (response.data.errorL) {
                alert(response.data.errorL)
            }
            if (response.data.errorP) {
                alert(response.data.errorP)
            }
            if (response.data.errorD) {
                alert(response.data.errorD)
            }
        };
    return (
      <div>
        <Topbar logotext="Profile"/>
        <div className="p-container">
            <div className="img-cont">
                <img className="profile-image" src={profileimage} alt="Profile" />  
            </div> 
        <div className="profile-content">
                    <h2>Profile Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="input-box"
                                id="inputUsername"
                                name="username"
                                value={profileData.username}
                                onChange={handleInputChange}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                placeholder="First Name"
                                type="text"
                                className="input-box"
                                id="inputFirstName"
                                name="first_name"
                                value={profileData.first_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                placeholder="Last name"
                                type="text"
                                className="input-box"
                                id="inputLastName"
                                name="last_name"
                                value={profileData.last_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                placeholder="E-mail"
                                type="email"
                                className="input-box"
                                id="inputEmail"
                                name="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                                readOnly    
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                placeholder="Phone Number"
                                type="text"
                                className="input-box"
                                id="inputPhone"
                                name="phone_number"
                                value={profileData.phone_number}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                            placeholder="Date of Birth"
                                type="date"
                                className="input-box"
                                id="inputBirthday"
                                name="date_of_birth"
                                value={profileData.date_of_birth}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;