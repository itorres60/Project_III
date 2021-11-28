import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

const Profile = () => {
  const createCalendar = () => {
    console.log('Creating new calendar...')
  }
  const deleteCalendar = () => {
    console.log('Deleting calendar...')
  }
  const { loading, error, data } = useQuery(QUERY_ME);

  if(loading) return 'Loading...';
  if(error) return `${error.message}`;

  if(data.me.role === 'administrator') {
    // needs an input allowing the admin to create a calendar
    return (
      <Card sx={{ minWidth: 275 }} style={{backgroundColor:'#333'}}>
      <CardContent>
      <div style={{color:'#fff'}}>
      <CardActions className='flex-column'>
        <Button size="large" variant="contained" style={{ backgroundColor: '#9C27B0', marginBottom: '1rem'}} onClick={createCalendar}><span style={{fontSize:'1.5rem', marginRight: '0.5rem'}}>+</span> Create Calendar</Button>
        <Button size="large" variant="contained" onClick={deleteCalendar}><span style={{fontSize:'1.15rem', marginRight: '0.5rem'}}>X</span> Delete Calendar</Button>
        </CardActions>
      </div>
      </CardContent>
      </Card>
    );
  } else if (data.me.role === 'employee' || data.me.role === 'reliever') {
    return (
      <div class='flex-row justify-center' style={{color:'#fff'}}>
        Calendar will be implemented here
      </div>
    );
    } else {
      return (
        <div>
          Not logged in.
        </div>
      );
    }
};

export default Profile;