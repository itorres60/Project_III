
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CREATE_CALENDAR from './mutations'
import REMOVE_CALENDAR from './mutations'
import Card from '@mui/material/Card';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function CreateCalendarModal({ handleUserFormSubmit, handleUserChange, userFormState }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className='hide-mobile'>
            <Button onClick={handleOpen} type="submit" size="large" variant="contained" style={{ backgroundColor: '#9C27B0' }} >Add User</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                    <form id='modalTarget' onSubmit={handleUserFormSubmit}>
                        <Card style={{ backgroundColor: '#333', padding: '2rem', color: '#fff', margin: 'auto' }} className='flex-row justify-center'>

                            <h2>Add a user to the calendar.</h2>
                            <input
                                placeholder="Employee's Email"
                                name="email"
                                type="email"
                                for="email"
                                value={userFormState.email}
                                onChange={handleUserChange}
                                className='mb-4 form-input' />
                            <button type="submit" className="btn">Submit</button>
                        </Card>
                    </form>
            </Modal>
        </div>
    );
}