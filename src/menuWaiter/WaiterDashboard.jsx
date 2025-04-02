import { Box, Card, Typography } from "@mui/material";
import WaiterHeaderComponent from "../components/mainComponents/WaiterHeaderComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import waiterIcon from "../data/images/waiterIcon.png";
import tableIcon from "../data/images/tableIcon.png";
import menuIcon from "../data/images/menuIcon.png";
import { fontStyleB } from "../data/contents/QRStyles";

const WaiterDashboard = () => {
    const [tablesCount, setTablesCount] = useState(0);
    const [orderCount, setOrderCount] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        fetchTablesData();
    }, []);

    const fetchTablesData = async () => {
        try {
            const tablesCollection = collection(db, "table");
            const t = query(tablesCollection);
            const querySnapshot = await getDocs(t);
            setTablesCount(querySnapshot.size);

            const fetchedtables = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Count tables with order_placed: true
            const orderPlacedCount = fetchedtables.reduce((count, table) => {
                // Check if order_placed exists and is true
                return count + (table.order_placed === true ? 1 : 0);
            }, 0);

            console.log(orderPlacedCount);
            setOrderCount(orderPlacedCount)
        } catch (error) {
            console.error("Error fetching tables list:", error);
        }
    };

    return (
        <Box sx={{
            width: "100vw",
            height: "100vh",
            background: "black",
            color: "white"
        }}>
            <WaiterHeaderComponent />
            <Box sx={{ height: "10vh" }} ></Box>
            <Box p={1} />

            <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: 'center',
                alignItems: "center",
                gap: "1rem"
            }}>
                <Card sx={{ p: 3.5, cursor: "pointer" }} onClick={() => navigate("/manage-orders")}>
                    <Typography sx={{ ...fontStyleB }}>
                        Total Tables
                    </Typography>
                    <Box sx={{ display: "flex", gap: "2rem", mx: "1rem" }}>
                        <Box component="img"
                            alt="icon"
                            src={tableIcon}
                            sx={{
                                width: "80px",
                                ml: 3,
                            }}
                        />
                        <Typography sx={{ fontWeight: "bold", fontSize: "3rem" }}>{tablesCount}</Typography>
                    </Box>
                </Card>
                <Card sx={{ p: 3, cursor: "pointer" }} onClick={() => navigate("/manage-orders")}>
                    <Typography sx={{ ...fontStyleB }}>
                        Order Received
                    </Typography>
                    <Box sx={{ display: "flex", gap: "2rem", mx: "1rem" }}>
                        <Box component="img"
                            alt="icon"
                            src={menuIcon}
                            sx={{
                                width: "70px",
                                ml: 3,
                            }}
                        />
                        <Typography sx={{ fontWeight: "bold", fontSize: "3rem" }}>{orderCount}</Typography>
                    </Box>
                </Card>
            </Box>
        </Box>
    )
}
export default WaiterDashboard;