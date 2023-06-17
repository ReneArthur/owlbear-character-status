import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Modal } from "@common/components/ui/Modal";

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  handleDelete: () => void;
  title: string;
  message: string;
}

export function DeleteConfirmation({
  open,
  onClose,
  handleDelete,
  title,
  message,
}: DeleteConfirmationProps) {
  return (
    <Modal title={title} open={open} onClose={onClose}>
      <Typography mb={2}>{message}</Typography>
      <Stack direction="row" gap={2}>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Excluir
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
      </Stack>
    </Modal>
  );
}
