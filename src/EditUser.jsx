import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { editUser, getUsers } from "./features/accountusers/accountusers";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const EditUser = ({ open, user, onClose }) => {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);

  // Set initial state using role name instead of id
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [role, setRole] = useState(user?.role || "");

  useEffect(() => {
    if (user) {
      console.log("Editing user:", user);
      setFullname(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setRole(user.role || ""); // Set role directly
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const payload = {
      id: user.id,
      userData: {
        fullname: fullname,
        email: email,
        phone: phone,
        role: role, // Directly use role string
      },
    };

    try {
      await dispatch(editUser(payload));
      toast.success("User updated successfully!");
      //setRefresh((prev) => !prev);
      await dispatch(getUsers()); // Refresh the user list
      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user.");
    }
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          fullWidth
          value={fullname}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Phone"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Role"
          fullWidth
          value={role} // Use roleName to display the role name
          onChange={(e) => setRoleName(e.target.value)} // Update role name
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;
