import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { CREATE_CALENDAR } from '../utils/mutations';
import Card from '@mui/material/Card';



const Initial = () => {
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
      /* const { data: calendarData } = */await createCalendar({
        variables: { ...formState },
      });

      window.location.assign('/calendar');
    } catch (e) {
      console.error(e);
    }
  };

  const { loading, error, data: currentUserData } = useQuery(QUERY_ME);

  if (loading) return 'Loading...';
  if (error) return (<Redirect to="/login" />);
  if (calendarError) return `${calendarError.message}`;

  if (currentUserData.me.calendars.length >= 1) {
    return (<Redirect to="/calendar" />);
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
      <Card sx={{ minWidth: 275, maxWidth: 500 }} style={{backgroundColor:'#333', padding:'2.5rem', margin:'auto'}} className='flex-row justify-center'>
      <div className='flex-column justify-center text-center mb-2' style={{ color: '#fff' }}>
        You are not assigned to any calendars. Contact your administrator if this is a mistake.
      
      <a href='/login' className='btn'>Return to Login</a>
      </div>
      </Card>
    );
  }
};

export default Initial;