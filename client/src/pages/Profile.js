import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { CREATE_CALENDAR } from '../utils/mutations';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { maxWidth } from '@mui/system';
import Calendar from '../components/Calendar';



const Profile = () => {
  const [formState, setFormState] = useState({
    companyName: ''
  });
  const [createCalendar, { error: calendarError }] = useMutation(CREATE_CALENDAR);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data: calendarData } = await createCalendar({
        variables: { ...formState },
      });

      window.location.assign('/');
    } catch (e) {
      console.error(e);
    }
  };

  const { loading, error, data: currentUserData } = useQuery(QUERY_ME);

  if (loading) return 'Loading...';
  if (error) return `${error.message}`;
  if (calendarError) return `${calendarError.message}`;

  if (currentUserData.me.calendars.length >= 1) {
    return (<Redirect to="/" />);
  } else if (currentUserData.me.role === 'administrator') {
    // needs an input allowing the admin to create a calendar
    return (
      <Card sx={{ minWidth: 275, maxWidth: 750 }} style={{backgroundColor:'#333', padding:'2.5rem', margin:'auto'}}>
      <form id='modalTarget' onSubmit={handleFormSubmit} style={{color: '#fff'}} className='flex-row justify-center'>
      <h3 >Looks like you don't have any calendars!</h3>
      <h3 className='mb-4'>Create one below:</h3>
        <input
          placeholder="Your company's name"
          name="companyName"
          type="companyName"
          for="companyName"
          value={formState.companyName}
          onChange={handleChange}
          className='mb-4 form-input' />
        <button type="submit" className='btn'>Submit</button>
      </form>
      </Card>
    );
  } else if (currentUserData.me.role === 'employee' || currentUserData.me.role === 'reliever') {
    return (
      <Card sx={{ minWidth: 275, maxWidth: 500 }} style={{backgroundColor:'#333', padding:'2.5rem', margin:'auto'}} class='flex-row justify-center'>
      <div class='flex-row justify-center text-center mb-2' style={{ color: '#fff' }}>
        You are not assigned to any calendars. Contact your administrator if this is a mistake.
      </div>
      <a href='/login' className='btn'>Return to Login</a>
      </Card>
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