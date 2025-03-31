import { Box, TextField } from '@mui/material';

const CreatingTextField = ({ Icon, value, setValue, placeholder  }) =>{
    return(
        <Box sx={{
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            borderRadius: "40px",
            width: "100%", height: "3rem",
            display: "flex", alignItems: "center", gap: "9px",
            backgroundColor:"white"
        }}>
            <Icon sx={{ color: "#1976d2", ml: "10px" }} />
            <TextField
                placeholder={placeholder}
                variant="standard"
                type='text'
                fullWidth
                InputProps={{
                    disableUnderline: !value,
                }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                sx={{
                    mr: "16px",
                    "&::before": {
                        borderBottom: value
                            ? "1px solid rgba(0, 0, 0, 0.42)"
                            : "none",
                    },
                    "&::after": {
                        borderBottom: "2px solid rgba(0, 0, 0, 0.87)",
                    },
                }}
            />
        </Box>
    )
}
export default CreatingTextField;