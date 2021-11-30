import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { CREATE_CALENDAR } from '../utils/mutations';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';


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
      <form id='modalTarget' onSubmit={handleFormSubmit}>
        <h2>You do not have any active calendars. Input your company's name to create one:</h2>
        <input
          placeholder="Your company's name"
          name="companyName"
          type="companyName"
          for="companyName"
          value={formState.companyName}
          onChange={handleChange}
          className='mb-4' />
        <button type="submit">Submit</button>
      </form>
    );
  } else if (currentUserData.me.role === 'employee' || currentUserData.me.role === 'reliever') {
    return (
      <div class='flex-row justify-center' style={{ color: '#fff' }}>
        You are not assigned to any calendars. Contact your administrator if this is a mistake.
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