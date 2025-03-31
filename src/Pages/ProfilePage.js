import React from "react";
import { Box, Button, Typography } from "@mui/material";
// import profileImage from "../data/sir_Image.jpeg";
// import companyLogo from "../data/Inv_logo-Horizontal.png";
import fb from "../data/facebook.svg";
import envelope from "../data/envelope.png";
import phone from "../data/phone.png";
import insta from "../data/instagram.svg";
import link from "../data/linkedin.svg";
import twit from "../data/twitter.svg";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { contactInfosx, contactInneri, contactInnersx, getRupee, headingssx, socialIconStyle } from "../data/styles";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import vCard from "vcf";
import withRouter from "../components/withRouter";
import BaseComponent from "../components/BaseComponent";
import EnquiryModal from "../components/mainComponents/EnquiryModal";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
// import LightModeIcon from '@mui/icons-material/LightMode';
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import BedtimeIcon from '@mui/icons-material/Bedtime';

export const boxStyle = (theme) => ({
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius: "10px",
    m: 1,
    backgroundColor: theme ? '#333' : 'white',
    position: "relative",
    ml: 5
});

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpandedAbout: false,
            isExpandedProducts: {},
            theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
            openEnquiryModal: false,
        };
    }

    toggleTheme = () => {
        this.setState((prevState) => ({
            theme: !prevState.theme,
        }));
    };

    downloadVCard = (fn, mn, ln, em, pn, org, de) => {
        // Create a new VCard object using vcf
        const card = new vCard();
        // card.set('version', '4.0' );

        card.set('n', `${ln};${fn};${mn};;`);
        // card.set('n', 'panigrahi;kiran;babu;pkb;' ); --- fields
        // below are the field names ad display
        // card.set('n', 'last_name;first_name;middle_name;name_prefix;' ); --- example (pkb kiran babu panigrahi)

        card.set('org', org);
        card.set('title', de);
        card.set('email', em);
        // card.set('tel', { 'type': ['home', 'voice'], 'value': 'uri' }, { 'uri': `tel:${pn}` });
        // card.set('tel', { 'type': ['home'], 'value': 'uri' }, { 'uri': `tel:${pn}` });
        card.set('tel', pn);

        // card.set('photo', { 'mediatype':  'image/gif'}, "text", `https://img.freepik.com/free-photo/photorealistic-view-tree-nature-with-branches-trunk_23-2151478040.jpg`);

        const vcfText = card.toString();
        const element = document.createElement("a");
        const file = new Blob([vcfText], { type: "text/vcard" });
        element.href = URL.createObjectURL(file);
        element.download = `${fn}_${ln}.vcf`;
        document.body.appendChild(element);
        element.click();
    };

    handlePhoneClick = (ph) => {
        window.open(`tel:+91${ph}`, "_self");  // Opens phone dialer on mobile devices
    };

    handleEmailClick = (email) => {
        window.location.href = `mailto:${email}`;
    };

    handleWebsiteClick = (wu) => {
        window.open(wu, "_blank");  // Opens website in a new tab
    };

    handleWhatsappClick = (wph) => {
        window.open(`https://wa.me/${wph}`, "_blank"); // Opens WhatsApp chat
    };

    toggleText = () => {
        this.setState({ isExpandedAbout: !this.state.isExpandedAbout });
    };

    toggleProducts = (index) => {
        this.setState((prevState) => ({
            isExpandedProducts: {
                ...prevState.isExpandedProducts,
                [index]: !prevState.isExpandedProducts[index],
            },
        }));
    };

    handleShare = () => {
        const shareUrl = window.location.href; // Assuming the current URL is the one to be shared
        const message = `Check out this profile: ${shareUrl}`;

        if (navigator.share) {
            navigator.share({
                title: 'Profile',
                text: message,
                url: shareUrl,
            }).catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback for browsers that do not support the Web Share API
            const shareOptions = [
                { name: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(message)}` },
                { name: 'SMS', url: `sms:?body=${encodeURIComponent(message)}` },
                { name: 'Copy to Clipboard', action: () => navigator.clipboard.writeText(message) },
            ];

            // Display share options (this can be a modal or a simple alert for demonstration)
            const optionNames = shareOptions.map(option => option.name).join('\n');
            const selectedOption = prompt(`Choose an option:\n${optionNames}`);

            const selected = shareOptions.find(option => option.name === selectedOption);
            if (selected) {
                if (selected.url) {
                    window.open(selected.url, '_blank');
                } else if (selected.action) {
                    selected.action();
                }
            }
        }
    };

    handleOpenEnquiryModal = () => {
        // console.log("open enquiry modal");
        this.setState({ openEnquiryModal: true });
    };

    handleCloseEnquiryModal = () => {
        // console.log("close enquiry modal");
        this.setState({ openEnquiryModal: false });
    };

    renderProfile = (user) => {
        // console.log(user.email);

        return (
            <main className="profile-page" ref={this.mainRef}>
                <Box sx={{
                    display: "flex", justifyContent: "center",
                    // backgroundColor: this.state.theme ? '' : 'black',
                    backgroundColor: this.state.theme ? 'black' : 'white',
                    minHeight:"100vh",
                }}>
                    <Box sx={{
                        width: {
                            xs: "100vw",
                            md: "530px"
                        },
                        // backgroundColor: this.state.theme ? '' : '#111010',
                        backgroundColor: this.state.theme ? '#111010' : 'white',
                        // color: this.state.theme ? '' : 'white',
                        color: this.state.theme ? 'white' : 'black',
                        borderRadius: "5px"
                    }}>
                        <style>
                            {`
                                @keyframes blink {
                                    0%, 100% { color: white; }
                                    50% { color: gold; }
                                }
                                .blinking-text {
                                    animation: blink 1s infinite;
                                    font-size: 12px;
                                    font-weight: bold;
                                }
                            `}
                        </style>
                        <Box sx={{
                            position: "fixed", zIndex: "10",
                            top: { md: 444, xs: 345 },
                            right: { md: 500, xs: 1 },
                            width: { md: "5rem", xs: "4.5rem" },
                            height: { md: "5rem", xs: "4rem" },
                            border: "3px solid black",
                            borderRadius: { md: "50%" },
                            borderTopLeftRadius: { xs: "50%" },
                            borderBottomLeftRadius: { xs: "50%" },
                            backgroundColor: "#c12929",
                            display: "flex", flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                            onClick={() => this.props.navigate("/register-now")}>
                            <Typography sx={{ paddingLeft: { xs: "1px", md: "0px" } }} className="blinking-text">Register</Typography>
                            <Typography sx={{ paddingLeft: { xs: "1px", md: "0px" } }} className="blinking-text">Now</Typography>
                        </Box>

                        <Box
                            sx={{
                                background: "linear-gradient(180deg, rgba(2,4,42,1) 45%, rgba(255,255,255,1) 35%, rgba(255,255,255,1) 100%)",
                                width: "100%", height: { xs: "280px", md: "380px" },
                                display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"
                            }}
                        >
                            <Box color="white" sx={{ width: "80%", display: "flex", justifyContent: "end", alignItems: "center" }}>
                                <span>
                                    {this.state.theme ? (<LightModeOutlinedIcon style={{ color: "gray" }} />)
                                        : (<LightModeOutlinedIcon style={{ color: "white" }} />)}
                                </span>
                                <Button onClick={this.toggleTheme}>
                                    {this.state.theme ? (
                                        <i class="fa fa-toggle-on fa-2xl" aria-hidden="true" style={{ color: "green" }}></i>
                                    ) : (
                                        <i class="fa fa-toggle-off fa-2xl" aria-hidden="true" style={{ color: "white" }}></i>
                                    )}
                                </Button>
                                <span>
                                    {this.state.theme ? (<BedtimeIcon style={{ color: "white" }} />)
                                        : (<BedtimeIcon style={{ color: "gray" }} />)}
                                </span>
                            </Box>
                            <Box p={1} />
                            <Box
                                sx={{
                                    width: "90%", height: "80%",
                                    display: "flex",
                                    borderRadius: "16px",
                                    background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(56,56,48,1) 50%, rgba(0,0,0,1) 100%)",
                                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                                }}
                            >
                                {(user.profileImage && user.profileImage != "") ?
                                    (<Box
                                        component="img"
                                        alt="Profile Pic"
                                        src={user.profileImage}
                                        sx={{ width: "50%", height: "100%", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px" }}
                                    />) : (
                                        <Box
                                            sx={{
                                                width: "50%", height: "100%", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px",
                                            }} />
                                        // >Upload Profile Image</Box> 
                                    )
                                }
                                <Box
                                    sx={{
                                        width: "50%", height: "100%",
                                        display: "flex", flexDirection: "column", justifyContent: "end",
                                        padding: "10px",

                                    }}
                                >
                                    <Typography sx={{ color: "white", fontWeight: "bold", fontSize: { xs: "16px", md: "22px" } }}>{user.firstName}</Typography>
                                    <Typography sx={{ color: "white", fontWeight: "bold", fontSize: { xs: "16px", md: "22px" } }}>{user.middleName}</Typography>
                                    <Typography sx={{ color: "white", fontWeight: "bold", fontSize: { xs: "16px", md: "22px" } }}>{user.lastName}</Typography>
                                    <Typography sx={{ color: "white", fontSize: { xs: "14px", md: "20px" } }}>{user.designation}</Typography>
                                    {
                                        user.companyName && <Typography sx={{ color: "white", fontSize: { xs: "11px", md: "16px" } }}>@ {user.companyName}</Typography>
                                    }
                                    {user.companyLogo != null ?
                                        <Box p={1} /> :
                                        <Box p={5} />
                                    }
                                    {user.companyLogo != null &&
                                        <Box
                                            sx={{
                                                display: "flex", justifyContent: "end"
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                alt="Company Logo"
                                                src={user.companyLogo}
                                                sx={{
                                                    minWidth: { xs: "100px", md: "150px" },
                                                    maxWidth: "90%",
                                                    maxHeight: { xs: "75px", md: "100px" },
                                                }}
                                            />
                                        </Box>
                                    }
                                    <Box p={1} />
                                </Box>
                            </Box>
                        </Box>

                        <Box p={1} />
                        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                            {/* // variant={this.state.theme ? 'contained' : ''} */}
                            {/* // color= {this.state.theme ? 'info' : ''}  */}
                            <Button
                                variant='contained'
                                color='info'
                                onClick={() => this.downloadVCard(user.firstName, user.middleName, user.lastName, user.email, user.mobileNumber, user.companyName, user.designation)}
                                sx={{
                                    fontSize: { xs: '0.7rem', sm: '1rem' }, width: '45%',
                                    borderColor: "black", fontWeight: "bold",
                                    borderRadius: "20px",
                                    // background: "linear-gradient(90deg, rgba(37,170,224,1) 0%, rgba(255,198,52,1) 100%)",
                                    // '&:hover': {
                                    //     background: "linear-gradient(270deg, rgba(37,221,224,1) 0%, rgba(12,232,96,1) 100%)"
                                    // },
                                }}>Save Contact</Button>
                            <Button
                                variant='contained'
                                color='success'
                                onClick={() => this.handleShare()}
                                sx={{
                                    fontSize: { xs: '0.7rem', sm: '1rem' },
                                    width: '45%',
                                    borderColor: "black",
                                    fontWeight: "bold",
                                    borderRadius: "20px",
                                    // background: "linear-gradient(90deg, rgba(37,170,224,1) 0%, rgba(255,198,52,1) 100%)",
                                    // '&:hover': {
                                    //     background: "linear-gradient(270deg, rgba(37,221,224,1) 0%, rgba(12,232,96,1) 100%)"
                                    // },
                                }}
                            >Share</Button>
                        </Box>

                        <Box p={2} />
                        <Box sx={boxStyle(this.state.theme)}>
                            <Typography style={headingssx} >Contact info</Typography>
                            <Box p={2} />
                            {(user.mobileNumber != "" && user.mobileNumber) &&
                                <Box style={contactInfosx} onClick={() => this.handlePhoneClick(user.mobileNumber)} >
                                    <Box sx={{ ...contactInneri }}>
                                        {/* <i class="fa-2xl fas fa-mobile-alt fa-thin" aria-hidden="true" ></i> */}
                                        <Box component="img" alt="phone" src={phone} sx={{ width: "35px" }} />
                                    </Box>
                                    <Box sx={{ ...contactInnersx }}>
                                        <Typography sx={{ fontWeight: "bold" }}>+91{user.mobileNumber}</Typography>
                                        <ArrowForwardIosIcon sx={{ color: "lightgray" }} />
                                    </Box>
                                </Box>
                            }
                            {(user.email != "" && user.email) &&
                                <Box style={contactInfosx} onClick={() => this.handleEmailClick(user.email)} >
                                    <Box sx={{ ...contactInneri }}>
                                        {/* <i class="fa fa-envelope fa-2xl" aria-hidden="true" ></i> */}
                                        <Box component="img" alt="envelope" src={envelope} sx={{ width: "35px" }} />
                                    </Box>
                                    <Box sx={{ ...contactInnersx }}>
                                        <Typography sx={{ fontWeight: "bold", wordBreak: "break-word", overflowWrap: "break-word" }}>{user.email}</Typography>
                                        <ArrowForwardIosIcon sx={{ color: "lightgray" }} />
                                    </Box>
                                </Box>
                            }
                            {(user.websiteUrl != "" && user.websiteUrl) &&
                                <Box style={contactInfosx} onClick={() => this.handleWebsiteClick(user.websiteUrl)}>
                                    <Box sx={{ ...contactInneri }}>
                                        <i class="fa-2xl fas fa-link fa-thin" aria-hidden="true" style={{ color: 'blue' }} ></i>
                                    </Box>
                                    <Box sx={{ ...contactInnersx }}>
                                        <Typography sx={{ fontWeight: "bold", wordBreak: "break-word", overflowWrap: "break-word" }}>{user.websiteUrl}</Typography>
                                        <ArrowForwardIosIcon sx={{ color: "lightgray" }} />
                                    </Box>
                                </Box>
                            }
                            {(user.whatsAppNumber != "" && user.whatsAppNumber) &&
                                <Box style={contactInfosx} onClick={() => this.handleWhatsappClick(user.whatsAppNumber)}>
                                    <Box sx={{ ...contactInneri }}>
                                        <WhatsAppIcon sx={{ fontSize: '2rem', color: 'green' }} />
                                    </Box>
                                    <Box sx={{ ...contactInnersx }}>
                                        <Tooltip
                                            title={<Typography sx={{ fontWeight: "bold" }}>{user.whatsAppNumber}</Typography>}
                                            placement="right"
                                            arrow
                                        >
                                            <Typography sx={{ fontWeight: "bold" }}>WhatsApp Chat</Typography>
                                        </Tooltip>
                                        <ArrowForwardIosIcon sx={{ color: "lightgray" }} />
                                    </Box>
                                </Box>
                            }
                            <Box p={1} />
                        </Box>

                        {
                            ((user.facebookUrl || user.instagramUrl || user.twitterUrl || user.linkedInUrl) && (user.facebookUrl != "" || user.instagramUrl != "" || user.twitterUrl != "" || user.linkedInUrl != "")) && (
                                <>
                                    <Box sx={{ border: "1px solid red", mt: 2, mb: 2 }} />

                                    <Box p={1} />
                                    <Box sx={boxStyle(this.state.theme)}>
                                        <Typography style={headingssx} >Social networks</Typography>
                                        <Box p={2} />
                                        <Box sx={{
                                            display: "flex", justifyContent: "start", alignItems: "center", flexWrap: "wrap",
                                            paddingLeft: "10px", gap: "8px"
                                        }}>
                                            {(user.facebookUrl != "" && user.facebookUrl) &&
                                                <Box
                                                    component="a"
                                                    href={user.facebookUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ ...socialIconStyle, '&:hover': { backgroundColor: 'lightgray' } }}
                                                >
                                                    <Box component="img" alt="Facebook" src={fb} sx={{ width: "50px" }} />
                                                </Box>
                                            }
                                            {(user.instagramUrl != "" && user.instagramUrl) &&
                                                // {user.instagramUrl != "" &&
                                                <Box
                                                    component="a"
                                                    href={user.instagramUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ ...socialIconStyle, '&:hover': { backgroundColor: 'lightgray' } }}
                                                >
                                                    <Box
                                                        component="img"
                                                        alt="Instagram"
                                                        src={insta}
                                                        sx={{ width: "50px" }}
                                                    />
                                                </Box>
                                            }
                                            {(user.twitterUrl != "" && user.twitterUrl) &&
                                                // {user.twitterUrl != "" &&
                                                <Box
                                                    component="a"
                                                    href={user.twitterUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ ...socialIconStyle, '&:hover': { backgroundColor: 'lightgray' } }}
                                                >
                                                    <Box
                                                        component="img"
                                                        alt="twitter"
                                                        src={twit}
                                                        sx={{ width: "50px" }}
                                                    />
                                                </Box>
                                            }
                                            {(user.linkedInUrl != "" && user.linkedInUrl) &&
                                                // {user.linkedInUrl != "" &&
                                                <Box
                                                    component="a"
                                                    href={user.linkedInUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ ...socialIconStyle, '&:hover': { backgroundColor: 'lightgray' } }}
                                                >
                                                    <Box
                                                        component="img"
                                                        alt="linkedin"
                                                        src={link}
                                                        sx={{ width: "50px" }}
                                                    />
                                                </Box>
                                            }
                                        </Box>
                                        <Box p={1} />
                                    </Box>
                                </>
                            )
                        }

                        {
                            user.about && (
                                <>
                                    <Box sx={{ border: "1px solid red", mt: 2, mb: 2 }} />
                                    <Box p={1} />
                                    <Box sx={boxStyle(this.state.theme)}>
                                        <Typography style={headingssx} >About</Typography>
                                        <Box p={2} />

                                        <Typography sx={{
                                            padding: "14px", textAlign: "justify",
                                            display: "block",
                                            overflowWrap: "break-word",
                                            wordBreak: "break-word",
                                            whiteSpace: "normal",
                                            // wordWrap: "break-word",
                                            // overflow: "hidden",
                                            // textOverflow: "ellipsis"
                                        }}>
                                            {this.state.isExpandedAbout ? user.about : `${user.about.slice(0, 150)}...`}
                                            <Button sx={{ fontSize: "10px", }} onClick={() => this.toggleText()}>
                                                {this.state.isExpandedAbout ? "Show Less" : "Show More"}
                                            </Button>
                                        </Typography>
                                    </Box>
                                </>
                            )
                        }

                        {
                            user.productsnservices && (
                                <>
                                    <Box sx={{ border: "1px solid red", mt: 2, mb: 2 }} />

                                    <Box p={1} />
                                    <Box sx={boxStyle(this.state.theme)}>
                                        <Typography style={headingssx} >Products & Services</Typography>
                                        <Box p={2} />
                                        <Box sx={{
                                            display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", gap: "10px", p: 2
                                        }}>
                                            {user.productsnservices && user.productsnservices.map((product, index) => (
                                                <Box key={index} sx={{
                                                    p: 2, mb: 2, borderRadius: "10px",
                                                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                                                    width: "320px",
                                                    backgroundColor: this.state.theme ? '#333' : 'white',
                                                    // backgroundColor: this.state.theme ? '#333' : '#333',
                                                    color: this.state.theme ? 'white' : 'black',
                                                    // color: this.state.theme ? '#333' : 'white',
                                                }}>
                                                    {
                                                        product.pnsHeader != "" &&
                                                        <Typography variant="h5" sx={{
                                                            color: this.state.theme ? 'white' : 'black',
                                                        }}>{product.pnsHeader}</Typography>
                                                    }

                                                    <Box sx={{ position: "relative" }}>
                                                        {
                                                            product.pnsImageUrl != "" &&
                                                            <img src={product.pnsImageUrl} alt={`Product ${index}`} style={{ width: "100%", }} />
                                                        }
                                                        {
                                                            ((product.pnsPrice != "") || (product.pnsDuration != "")) &&
                                                            <Typography sx={{
                                                                backgroundColor: "#333", color: "white", fontSize: "10px", p: 1, borderRadius: "20px", position: "absolute",
                                                                bottom: 10,
                                                                right: 10,
                                                            }}>{getRupee(product.pnsPrice)}/{product.pnsDuration}</Typography>
                                                        }
                                                    </Box>
                                                    {
                                                        product.pnsContent != "" &&
                                                        <Typography sx={{
                                                            textAlign: "justify",
                                                            display: "block",
                                                            overflowWrap: "break-word",
                                                            wordBreak: "break-word",
                                                            whiteSpace: "normal",
                                                            color: this.state.theme ? '#EDEADE' : 'black',
                                                        }}>
                                                            {this.state.isExpandedProducts[index] ? product.pnsContent : `${product.pnsContent.slice(0, 100)}...`}
                                                            <Button sx={{ fontSize: "10px", }} onClick={() => this.toggleProducts(index)}>
                                                                {this.state.isExpandedProducts[index] ? "Show Less" : "Show More"}
                                                            </Button>
                                                        </Typography>
                                                    }

                                                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                                                        <Typography sx={{
                                                            color: this.state.theme ? 'white' : '#3498db', fontSize: "10px", cursor: "pointer", p: 1, borderRadius: "20px",
                                                            '&:hover': {
                                                                background: '#d6eaf8',
                                                            },
                                                        }} onClick={() => this.handleOpenEnquiryModal()}>
                                                            Enquiry <ArrowForwardIosIcon sx={{ fontSize: "10px" }} />
                                                        </Typography>
                                                        <EnquiryModal
                                                            open={this.state.openEnquiryModal}
                                                            onClose={this.handleCloseEnquiryModal}
                                                            uid={user.uid}
                                                        />
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </>
                            )
                        }

                        {
                            ((user.clientImages) && (user.clientImages != "")) ? (
                                <>
                                    <Box sx={{ border: "1px solid red", mt: 2, mb: 2 }} />

                                    <Box p={1} />
                                    <Box sx={boxStyle(this.state.theme)}>
                                        <Typography style={headingssx} >Our Clients</Typography>
                                        <Box p={2} />
                                        <Box sx={{
                                            display: "flex", flexWrap: "wrap", justifyContent: "space-evenly",
                                            gap: "10px", pb: "15px"
                                        }}>
                                            {user.clientImages.map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`Client image ${index}`}
                                                    style={{
                                                        maxWidth: "150px",
                                                        minWidth: "130px",
                                                        minHeight: "130px",
                                                        // maxHeight: "130px",

                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </>
                            ) : ("")
                        }

                        <Box p={2.5} />
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                            <Typography sx={{ color: "gray" }} >Create your own profile</Typography>
                            <Link to="/" style={{ textDecoration: 'none', }}>
                                Click Here
                            </Link>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                            {/* <i class="fa fa-star" aria-hidden="true" style={{ color: "gold" }}></i> */}
                            {/* <Typography sx={{ color: "gray" }} >Brought to life with</Typography> */}
                            {/* <i class="fa fa-heart" aria-hidden="true" style={{ color: "red" }}></i> */}
                            <Typography sx={{ color: "gray" }} >Powered By</Typography>

                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", cursor: "pointer" }}
                                onClick={() => window.location.href = "https://invtechnologies.in/"}
                            >
                                <Typography sx={{ color: "#02437a", fontWeight: "bold" }} >INV</Typography>
                                <Typography sx={{ color: "#fc7f09", fontWeight: "bold" }} >TECHNOLOGIES</Typography>
                            </Box>
                            {/* <i class="fa fa-star" aria-hidden="true" style={{ color: "gold" }}></i> */}
                            {/* <Box
                                component="img"
                                alt="Company Logo"
                                src={companyLogo}
                                sx={{
                                    width: "225px",
                                }}
                            /> */}
                        </Box>
                        <Box p={1} />
                    </Box>
                </Box >
            </main >
        );
    }

    render() {
        return (
            <BaseComponent collectionName="users" render={this.renderProfile} params={this.props.params} navigate={this.props.navigate} />
        );
    }
}

export default withRouter(ProfilePage);