import Box from "@mui/material/Box";
import MuiModal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface ModalProps {
  children?: ReactNode;
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function Modal({
  children,
  title,
  description,
  open,
  onClose,
}: ModalProps) {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width={300}
        bgcolor="background.paper"
        boxShadow={24}
        borderRadius={2}
        sx={{ transform: "translate(-50%, -50%)" }}
      >
        <Box p={2}>
          <Typography id="modal-modal-title" variant="h5" mb={1}>
            {title}
          </Typography>
          <Typography id="modal-modal-description">{description}</Typography>
          <Box>{children}</Box>
        </Box>
      </Box>
    </MuiModal>
  );
}
