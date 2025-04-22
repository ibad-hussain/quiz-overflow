import { createContext, useState, useEffect } from "react";
import axios from 'axios';


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getUserData = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(`${backendUrl}/api/user/data`);

            if (data.success) {
                setUserData(data.userData);
                setIsLoggedin(true);
                return data.userData;
            } else {
                setIsLoggedin(false);
                setUserData(null);
                // return null;
                throw new Error("Error fetching profile");
            }

        } catch (error) {
            setIsLoggedin(false);
            setUserData(null);
            // return null;
            throw error;
        }
    };

    useEffect(() => {
        getUserData(); // Auto-fetch user data on load
    }, []);

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
