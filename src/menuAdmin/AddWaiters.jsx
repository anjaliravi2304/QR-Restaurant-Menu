import { Box, Typography, TextField, Button, CircularProgress, IconButton, InputAdornment, Paper } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from "react";
import { collection, query, where, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const AddWaiters = () => {
    const [waiterName, setWaiterName] = useState("");
    const [loginId, setLoginId] = useState("");
    const [passwordCreation, setPasswordCreation] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onCreateWaiter = async () => {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            // Check if a waiter with the same login_id already exists
            const q = query(collection(db, "admin"), where("login_id", "==", loginId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setErrorMsg("Login ID already exists.");
                setLoading(false);
                return;
            }

            // Add a new waiter document
            const waiterRef = await addDoc(collection(db, "admin"), {
                createdAt: new Date().toISOString().split('T')[0],
                name: waiterName,
                login_id: loginId,
                password: passwordCreation,
                type: "waiter",
                active: true,
            });

            // Update the same document with its UID
            await setDoc(doc(db, "admin", waiterRef.id), { uid: waiterRef.id }, { merge: true });
            setSuccessMsg("Waiter added successfully.");

        } catch (error) {
            console.error("Error creating waiter:", error);
            alert("An error occurred while creating the waiter.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            width: { xs: "95%", md: "25%" },
            display: "flex",
            justifyContent: "center",
            alignItems: { xs: "start", md: "center" },
        }}>
            <Box component={Paper} sx={{
                p:2,
            }}>
                <Typography sx={{
                    textAlign: "center", fontSize: { xs: "2rem", md: "3rem" }, fontWeight: "bold"
                }}>Add Waiter</Typography>

                {/* Form Inputs */}
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Waiter Name"
                    value={waiterName}
                    onChange={(e) => setWaiterName(e.target.value)}
                    sx={{ mt: 2, 
                    }}
                    inputProps={{
                        style: { textAlign: "center", fontWeight: "bold" },
                    }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Login ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    sx={{
                        mt: 2, 
                    }}
                    inputProps={{
                        maxLength: 15,
                        style: { textAlign: "center", fontWeight: "bold" },
                    }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={passwordCreation}
                    onChange={(e) => setPasswordCreation(e.target.value)}
                    sx={{ mt: 2, 
                    }}
                    inputProps={{
                        maxLength: 15,
                        style: { textAlign: "center", fontWeight: "bold" },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleTogglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Error Message */}
                {errorMsg && <Typography color="error" sx={{ textAlign: "center", mt: 1, mb: 1 }}>{errorMsg}</Typography>}
                {!errorMsg && <Box p={2.5} />}

                {/* Submit Button */}
                <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={()=> onCreateWaiter()}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create Waiter"}
                </Button>

                {/* success Message */}
                {successMsg && <Typography sx={{ textAlign: "center", mt: 1, mb: 1, color: "green" }}>{successMsg}</Typography>}
                {!successMsg && <Box p={2.5} />}
            </Box>
        </Box>
    )
}
export default AddWaiters;