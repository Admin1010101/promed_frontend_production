import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Fade,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: '90%', sm: 480 },
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 10,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

const NotificationModal = ({
  open,
  handleClose,
  notification,
  handleDelete,
}) => {
  if (!notification) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              id="notification-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 600 }}
            >
              Notification
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Main Message */}
          <Box mt={3}>
            <Typography
              id="notification-modal-description"
              sx={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "text.primary",
              }}
            >
              {notification.message}
            </Typography>
          </Box>

          {/* Additional Info */}
          {notification.data && (
            <Box mt={3}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "text.secondary",
                  mb: 1,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                }}
              >
                Additional Info
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-line", color: "text.secondary" }}
              >
                {notification.data}
              </Typography>
            </Box>
          )}

          {/* Footer Buttons */}
          <Box
            mt={4}
            display="flex"
            justifyContent="flex-end"
            gap={2}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 500,
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => handleDelete(notification.id)}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 500,
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default NotificationModal;
