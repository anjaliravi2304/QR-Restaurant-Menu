import { Box, TableContainer, Table, TableHead, TableRow, TableCell, Switch, TableBody, Paper, Button, Typography } from "@mui/material";
import WaiterHeaderComponent from "../components/mainComponents/WaiterHeaderComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LsService from "../services/localstorage";
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

const headCellStyle = {
    color: "white",
    fontWeight: 'bold',
}

const ManageOrders = () => {
    const [tablesList, setTablesList] = useState([]);
    const navigate = useNavigate();

    const user = LsService.getItem("user");

    useEffect(() => {
        // console.log(user);

        if (user.type !== "waiter") {
            console.log("not loggedin");
            LsService.removeItem("user");
            navigate("/");
        }
        fetchTablesData();
    }, []);

    const fetchTablesData = async () => {
        try {
            const tablesCollection = collection(db, "table");
            const q = query(tablesCollection);
            const querySnapshot = await getDocs(q);

            const fetchedtables = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setTablesList(fetchedtables);
        } catch (error) {
            console.error("Error fetching tables list:", error);
        }
    };

    return (
        <Box sx={{
            background: "black",
            minHeight: "100vh",
        }}>
            <WaiterHeaderComponent />
            <Box sx={{ height: "10vh" }} ></Box>
            <Box sx={{
                width: { xs: "100vw", md: "98.93vw" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: { md: "center", xs: "start" },
                color: "white",
                py: 2,
            }}
            >
                <TableContainer component={Paper} sx={{ maxWidth: { xs: "100%", md: "60%" } }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#3e8596" }}>
                            <TableRow>
                                <TableCell sx={headCellStyle}>Table Name</TableCell>
                                <TableCell sx={headCellStyle}>Order Placed</TableCell>
                                <TableCell sx={headCellStyle}>Waiter Confirmed</TableCell>
                                <TableCell sx={headCellStyle}>Order Confirmed</TableCell>
                                <TableCell sx={headCellStyle}>Verify Orders</TableCell>
                                <TableCell sx={headCellStyle}>Place New-Order</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tablesList.map((table, index) => (
                                <TableRow
                                    key={table.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "white" : "lightgrey",
                                        "&:hover td": {
                                            color: "green",
                                        },
                                    }}
                                >
                                    <TableCell>{table.table_name}</TableCell>
                                    <TableCell>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: table.order_placed ? "success.main" : "error.main",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {table.order_placed ? "Yes" : "No"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: table.waiter_confirm ? "success.main" : "error.main",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {table.waiter_confirm ? "Confirmed" : "Pending"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: table.order_confirmed ? "success.main" : "error.main",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {table.order_confirmed ? "Confirmed" : "Pending"}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            disabled={table.order_placed ? false : true}
                                            // onClick={() => onDisplay(table.table_id)}
                                        >Verify Order</Button>
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => window.open(`http://localhost:3000/customer-menu/${table.table_id}`)}
                                        >Place Order</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}
export default ManageOrders;