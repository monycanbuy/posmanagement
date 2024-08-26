import React from "react";

const ConfirmationDialog = () => {
  return (
    <div>
      {/* Your DataGrid or other components here */}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDeleteUser}
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
};

export default ConfirmationDialog;
