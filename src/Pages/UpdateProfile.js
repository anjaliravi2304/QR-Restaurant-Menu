import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Button, TextField, Typography, Grid, Avatar, Modal, CircularProgress, IconButton, Skeleton, Drawer } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import QRCodeModal from "./QRCodeModal";
import LogoutButtonComp from "../components/LogoutButtonComp";
import MenuIcon from "@mui/icons-material/Menu";

const schema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  linkedInUrl: z.string().optional(),
  mobileNumber: z.string().min(10, { message: "Invalid mobile number" }),
  websiteUrl: z.string().optional(),
  whatsAppNumber: z.string().min(10, { message: "Invalid WhatsApp number" }),
  displayEmail: z.string().email({ message: "Invalid email address" }),
  about: z.string().optional(),
  profileImage: z.any().optional(),
  companyLogo: z.any().optional(),
  clientImage: z.any().optional(),
  companyName: z.string().min(1, { message: "Company name is required" }),
  designation: z.string().min(1, { message: "Designation is required" }),
});

const UpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(true);

  const [profileImage, setProfileImage] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newCompanyLogo, setNewCompanyLogo] = useState(null);

  const [clientImages, setClientImages] = useState([]);
  const [newClientImages, setNewClientImages] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const userData = await getDoc(userDoc);

        if (userData.exists()) {
          const data = userData.data();
          setValue("firstName", data.firstName || "");
          setValue("middleName", data.middleName || "");
          setValue("lastName", data.lastName || "");
          setValue("email", data.email || "");
          setValue("facebookUrl", data.facebookUrl || "");
          setValue("instagramUrl", data.instagramUrl || "");
          setValue("twitterUrl", data.twitterUrl || "");
          setValue("linkedInUrl", data.linkedInUrl || "");
          setValue("mobileNumber", data.mobileNumber || "");
          setValue("websiteUrl", data.websiteUrl || "");
          setValue("whatsAppNumber", data.whatsAppNumber || "");
          setValue("about", data.about || "");
          setValue("companyName", data.companyName || "");
          setValue("designation", data.designation || "");
          setValue("displayEmail", data.displayEmail || "");
          // Set the initial state for profileImage and companyLogo
          setProfileImage(data.profileImage || null);
          setCompanyLogo(data.companyLogo || null);
          setClientImages(data.clientImages || []);
        }
      }
      setLoadingAvatar(false);
    };

    fetchUserData();
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const storage = getStorage();

  const uploadImage = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let profileImageUrl = profileImage;
      let companyLogoUrl = companyLogo;
      let clientImageUrls = [...clientImages];

      if (newProfileImage) {
        profileImageUrl = await uploadImage(newProfileImage, `profileImages/${user.uid}`);
      }

      if (newCompanyLogo) {
        companyLogoUrl = await uploadImage(newCompanyLogo, `companyLogos/${user.uid}`);
      }
      if (newClientImages.length > 0) {
        const uploadPromises = newClientImages.map((image, index) =>
          uploadImage(image, `clientImages/${user.uid}/${clientImageUrls.length + index}`)
        );
        const newUrls = await Promise.all(uploadPromises);
        clientImageUrls = [...clientImageUrls, ...newUrls];
      }
      const userDocRef = doc(db, "users", user.uid);
      const updatedData = {
        ...data,
        profileImage: profileImageUrl,
        companyLogo: companyLogoUrl,
        clientImages: clientImageUrls,
      };

      await updateDoc(userDocRef, updatedData);
      setOpenModal(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate(`/profile/${user.uid}`);
  };

  const onDropProfileImage = useCallback((acceptedFiles) => {
    setNewProfileImage(acceptedFiles[0]);
  }, []);

  const onDropCompanyLogo = useCallback((acceptedFiles) => {
    setNewCompanyLogo(acceptedFiles[0]);
  }, []);

  const onDropClientImages = useCallback((acceptedFiles) => {
    setNewClientImages((prevImages) => [...prevImages, ...acceptedFiles]);
  }, []);

  const {
    getRootProps: getRootClientImages,
    getInputProps: getInputClientImages,
  } = useDropzone({
    onDrop: onDropClientImages,
    accept: "image/*",
  });

  const {
    getRootProps: getRootPropsProfile,
    getInputProps: getInputPropsProfile,
  } = useDropzone({
    onDrop: onDropProfileImage,
    accept: "image/*",
  });

  const {
    getRootProps: getRootPropsLogo,
    getInputProps: getInputPropsLogo,
  } = useDropzone({
    onDrop: onDropCompanyLogo,
    accept: "image/*",
  });

  const handleShowQRClick = async () => {
    setLoading(true);
    try {
      const userDoc = doc(db, "users", user.uid);
      const userData = await getDoc(userDoc);

      if (userData.exists()) {
        const data = userData.data();
        const requiredFields = ["firstName", "lastName", "mobileNumber", "companyName", "designation"];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
          alert(`Please fill the following fields: ${missingFields.join(", ")}`);
        } else {
          setOpenQR(true);
        }
      } else {
        alert("User data not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("An error occurred while fetching user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseQR = () => {
    setOpenQR(false);
  };

  return (
    <Box sx={{ pl: 2, pr: 2, }}>
      {/* <Box sx={{ display: "flex", justifyContent: "end", m: 1 }}>
      <Button variant="contained"
          color="primary"
          sx={{ fontSize: { xs: "10px", md: "1rem" } }}
          onClick={() => navigate("/view-enquiry")}>View Enquiry</Button>
        <Box p={1} />
        <Button variant="contained"
          color="primary"
          sx={{ fontSize: { xs: "10px", md: "1rem" } }}
          onClick={() => navigate("/add-products-and-services")}>Add P & S</Button>
        <Box p={1} />
        <Button variant="outlined" onClick={() => handleShowQRClick()}
          sx={{ fontSize: { xs: "10px", md: "1rem" } }} disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Show QR"}
          </Button>
          <QRCodeModal open={openQR} onClose={handleCloseQR} />

        <Box p={1} />
        <LogoutButtonComp />
      </Box> */}
      <Box sx={{ display: "flex", justifyContent: "end", m: 1 }}>
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Box sx={{ width: "90%", textAlign: "end" }}><IconButton sx={{ width: "2.5rem" }} onClick={toggleDrawer(false)}>x</IconButton></Box>
            <Button
              // variant="contained"
              // color="primary"
              sx={{ width: "100%", mb: 1 }}
              onClick={() => navigate("/enquiries")}
            >
              View Enquiries
            </Button>
            <Button
              // variant="contained"
              // color="primary"
              sx={{ width: "100%", mb: 1 }}
              onClick={() => navigate("/add-products-and-services")}
            >
              Add P & S
            </Button>
            <Button
              // variant="outlined"
              onClick={() => handleShowQRClick()}
              sx={{ width: "100%", mb: 1 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Show QR"}
            </Button>
            <Box sx={{ width: "100%", textAlign: "center" }}><LogoutButtonComp /></Box>

          </Box>
        </Drawer>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Update Profile
        </Typography>
        {loadingAvatar ? (
          <Skeleton variant="circular" width={100} height={100} />
        ) : (
          <Avatar
            alt="Profile Picture"
            src={newProfileImage ? URL.createObjectURL(newProfileImage) : profileImage || user?.photoURL || ""}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
        )}
        <Typography sx={{ mb: 2, mt: 2 }} >
          {watch("email")}
        </Typography>
        <QRCodeModal open={openQR} onClose={handleCloseQR} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <Grid container spacing={2}
          // sx={{ boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px" }}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                placeholder="First Name"
                variant="outlined"
                fullWidth
                {...register("firstName")}
                error={!!errors.firstName}
                // helperText={errors.firstName ? errors.firstName.message : ""}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                placeholder="Middle Name"
                variant="outlined"
                fullWidth
                {...register("middleName")}
                error={!!errors.middleName}
                // helperText={errors.middleName ? errors.middleName.message : ""}
                helperText={errors.middleName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                placeholder="Last Name"
                variant="outlined"
                fullWidth
                {...register("lastName")}
                error={!!errors.lastName}
                // helperText={errors.lastName ? errors.lastName.message : ""}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                placeholder="Company Name"
                variant="outlined"
                fullWidth
                {...register("companyName")}
                error={!!errors.companyName}
                // helperText={errors.companyName ? errors.companyName.message : ""}
                helperText={errors.companyName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                placeholder="Designation"
                variant="outlined"
                fullWidth
                {...register("designation")}
                error={!!errors.designation}
                // helperText={errors.designation ? errors.designation.message : ""}
                helperText={errors.designation?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Previously Uploaded Profile Images</Typography>
              {profileImage && typeof profileImage === "string" && !newProfileImage && (
                <Box
                  sx={{
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  <img
                    src={profileImage}
                    alt="Profile Preview"
                    style={{
                      width: "50%",
                      maxHeight: "300px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
              <Grid item xs={12}>
                <Typography variant="h6">Profile Image</Typography>
                <Box
                  {...getRootPropsProfile()}
                  sx={{
                    border: "2px dashed #d3d3d3",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <input {...getInputPropsProfile()} />
                  {newProfileImage ? (
                    <img
                      src={URL.createObjectURL(newProfileImage)}
                      alt="Profile Preview"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Typography>Drag & drop to upload or browse</Typography>
                  )}
                </Box>
              </Grid>

            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Previously Uploaded Company Logo</Typography>
              {companyLogo && typeof companyLogo === "string" && !newCompanyLogo && (
                <Box
                  sx={{
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  <img
                    src={companyLogo}
                    alt="Company Logo Preview"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
              <Typography variant="h6">Company Logo</Typography>
              <Box
                {...getRootPropsLogo()}
                sx={{
                  border: "2px dashed #d3d3d3",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <input {...getInputPropsLogo()} />
                {newCompanyLogo ? (
                  <img
                    src={URL.createObjectURL(newCompanyLogo)}
                    alt="Company Logo Preview"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography>Drag & drop to upload or browse</Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Facebook URL</Typography>
              <TextField
                placeholder="Facebook URL"
                variant="outlined"
                fullWidth
                {...register("facebookUrl")}
                error={!!errors.facebookUrl}
                helperText={errors.facebookUrl ? errors.facebookUrl.message : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Instagram URL</Typography>
              <TextField
                placeholder="Instagram URL"
                variant="outlined"
                fullWidth
                {...register("instagramUrl")}
                error={!!errors.instagramUrl}
                helperText={errors.instagramUrl ? errors.instagramUrl.message : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Twitter URL</Typography>
              <TextField
                placeholder="Twitter URL"
                variant="outlined"
                fullWidth
                {...register("twitterUrl")}
                error={!!errors.twitterUrl}
                helperText={errors.twitterUrl ? errors.twitterUrl.message : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>LinkedIn URL</Typography>
              <TextField
                placeholder="LinkedIn URL"
                variant="outlined"
                fullWidth
                {...register("linkedInUrl")}
                error={!!errors.linkedInUrl}
                helperText={errors.linkedInUrl ? errors.linkedInUrl.message : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Mobile Number</Typography>
              <TextField
                placeholder="Mobile Number"
                variant="outlined"
                fullWidth
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric"
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "." || e.key === "e" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
                {...register("mobileNumber")}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber ? errors.mobileNumber.message : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Website URL</Typography>
              <TextField
                placeholder="Website URL"
                variant="outlined"
                fullWidth
                {...register("websiteUrl")}
                error={!!errors.websiteUrl}
                helperText={errors.websiteUrl ? errors.websiteUrl.message : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>WhatsApp Number</Typography>
              <TextField
                placeholder="WhatsApp Number"
                variant="outlined"
                fullWidth
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric"
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "." || e.key === "e" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
                {...register("whatsAppNumber")}
                error={!!errors.whatsAppNumber}
                helperText={errors.whatsAppNumber ? errors.whatsAppNumber.message : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Display Email</Typography>
              <TextField
                placeholder="Display Email"
                variant="outlined"
                fullWidth
                {...register("displayEmail")}
                error={!!errors.displayEmail}
                helperText={errors.displayEmail ? errors.displayEmail.message : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">About</Typography>
              <TextField
                placeholder="About"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                {...register("about")}
                error={!!errors.about}
                helperText={errors.about ? errors.about.message : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Upload Client Logos</Typography>
              <Box
                {...getRootClientImages()}
                sx={{
                  border: "2px dashed #d3d3d3",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <input {...getInputClientImages()} />
                {newClientImages.length > 0 ? (
                  newClientImages.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Client image Preview ${index}`}
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                        marginBottom: "10px",
                      }}
                    />
                  ))
                ) : (
                  <Typography>Drag & drop to upload or browse</Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Existing Client Logos</Typography>
              <Box sx={{
                display: "flex", flexWrap: "wrap", justifyContent: "space-evenly",
                gap: "10px", p: "15px", mt: 1,
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                borderRadius: "10px",
              }}>
                {(clientImages.length > 0) ?
                  <Box>
                    {clientImages.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Client image ${index}`}
                        style={{
                          width: "130px",
                          height: "130px",
                        }}
                      />
                    ))}
                  </Box>
                  :
                  <Typography>Not yet added</Typography>
                }
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => window.location.reload()}
                // onClick={() => navigate("/update-profile")}
                sx={{ fontSize: { xs: "10px", md: "1rem" } }}
              >
                Cancel
              </Button>

              <Button type="submit" variant="contained" color="primary" disabled={loading}
                sx={{ fontSize: { xs: "10px", md: "1rem" } }}
              >
                {loading ? <CircularProgress size={24} /> : "Update Profile"}
              </Button>
            </Grid>
          </Grid>
          <Box p={1} />
        </form>

        <Modal
          open={openModal}
          onClose={() => { setOpenModal(false); window.location.reload(); }}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300,
              bgcolor: 'background.paper',
              borderRadius: '10px',
              boxShadow: 24,
              p: 2,
              textAlign: 'center',
            }}
          >
            <Typography id="modal-title" variant="h6" component="h3" gutterBottom>
              Profile updated successfully
            </Typography>
            <Button onClick={() => handleCloseModal()} variant="contained" color="primary" sx={{ mt: 2 }}>
              See your profile
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default UpdateProfile;
