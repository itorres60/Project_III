
import * as React from 'react';
/* import Box from '@mui/material/Box'; */
import Button from '@mui/material/Button';
/* import Typography from '@mui/material/Typography'; */
import Modal from '@mui/material/Modal';
/* import CREATE_CALENDAR from './mutations' */
/* import REMOVE_CALENDAR from './mutations' */ 
import Card from '@mui/material/Card';

/* const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}; */

export default function CreateCalendarModal({ handleUserFormSubmit, handleUserChange, handleRemoveUser, userFormState, data }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  return (
    <div className='hide-mobile'>
      <Button onClick={handleOpen} type="submit" size="small" variant="contained" style={{ backgroundColor: '#d16d2c' }} >Users</Button>
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <form id='modalTarget' onSubmit={handleUserFormSubmit}>
          <Card style={{ backgroundColor: '#333', padding: '2rem', color: '#fff', margin: 'auto' }} className='flex-column justify-center'>

            <h3>Add a user to the calendar.</h3>
            <input
              placeholder="Employee's Email"
              name="email"
              type="email"
              htmlFor="email"
              value={userFormState.email}
              onChange={handleUserChange}
              className='mb-4 form-input' />
            <button type="submit" className="btn">Submit</button>
            <h4 className='mb-4'>Current Users:</h4>
            {data && data.map(users => {
              return (
                <div key={users} className='flex-row justify-space-between'>
                  <p>{users}</p>
                  <span><button onClick={handleRemoveUser} style={{backgroundColor: "red", color:"white"}}>remove</button></span>
                </div>
              )
            })}
          </Card>
        </form>
      </Modal>
    </div>
  );
}