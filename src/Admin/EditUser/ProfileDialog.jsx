import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateProfile } from "../../features/accountusers/accountusers";

const ProfileDialog = ({ open, onClose, user, setProfileImage }) => {
  const dispatch = useDispatch();

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setLocalProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("User prop:", user);
    if (user) {
      setFullname(user.fullname || "");
      setPhone(user.phone || ""); // Set phone from user data
      setLocalProfileImage(user.profileImage || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfileImage(reader.result); // Set the local image state to the Base64 string
      };
      reader.readAsDataURL(file);
      setSelectedImage(file.name); // Set the image name for display
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      fullname,
      phone,
      profileImage: profileImage || "",
    };

    console.log("Request Body:", requestBody);

    try {
      await dispatch(updateProfile(requestBody)).unwrap();
      //toast.success("Profile updated successfully!");
      setProfileImage(profileImage);
      onClose();
    } catch (error) {
      console.error("Update Profile Error:", error);
      toast.error(error?.message || "Failed to update profile.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Profile</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Full Name"
          type="text"
          fullWidth
          variant="outlined"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Phone"
          type="text"
          fullWidth
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)} // Update phone number
        />
        <input
          accept="image/png"
          style={{ display: "none" }}
          id="upload-image"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="upload-image">
          <Button variant="contained" component="span">
            Upload Image
          </Button>
        </label>
        {selectedImage && <div>Selected Image: {selectedImage}</div>}
        {profileImage && (
          <img
            src={profileImage}
            alt="Preview"
            style={{ width: "100px", height: "100px" }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Update Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
