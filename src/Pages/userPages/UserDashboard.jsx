import React, { useEffect, useState } from "react";
import { Box, } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import UserHeaderComponent from "../../components/mainComponents/UserHeaderComponent";

const UserDashboard = () => {
    const [user, setUser] = useState({});

    const userProfileData = JSON.parse(localStorage.getItem("user"));

    const fetchUserData = async () => {
        if (userProfileData) {
            const userDoc = doc(db, "users", userProfileData.uid);
            const userData = await getDoc(userDoc);

            if (userData.exists()) {
                const data = userData.data();
                // console.log(data);
                setUser(data);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);


    return (
        <Box sx={{
            width: { md: "98.93vw", xs: "100vw" },
        }}>
            <UserHeaderComponent />
            <Box
                sx={{ height: "10vh" }}
            ></Box>
            
        </Box >
    );
};

export default UserDashboard;