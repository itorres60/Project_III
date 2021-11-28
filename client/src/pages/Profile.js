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
      <div id='modalTarget'></div>
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