import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ConfirmationDialog({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message 
}) {
  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="inherit">
          Cancelar
        </Button>
        <Button 
          onClick={() => {
            onConfirm();
            onClose(false);
          }} 
          variant="contained" 
          color="error" 
          autoFocus
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}