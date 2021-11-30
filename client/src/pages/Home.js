import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import { QUERY_ME, QUERY_CALENDAR } from '../utils/queries';
import { ADD_USER, CREATE_RESERVATION } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import Card from '@mui/material/Card';

const Home = () => {
  const [userFormState, setUserFormState] = useState({
    email: ''
  });
  const [formState, setFormState] = useState({
    title: '',
    start: '',
    end: ''
  });
  const { loading, error, data } = useQuery(QUERY_ME);
  const [addUser, { loading: userLoading, error: userError }] = useMutation(ADD_USER);
  const [createReservation, { loading: reservationLoading, error: reservationError }] = useMutation(CREATE_RESERVATION);

  if (loading || userLoading || reservationLoading) return 'Loading...';
  if (reservationError) return `${reservationError.message}`;
  if (userError) return `${userError.message}`;
  if (error) return `${error.message}`;

  const handleUserChange = (event) => {
    const { name, value } = event.target;

    setUserFormState({
      ...userFormState,
      [name]: value,
    });
  };

  // submit form
  const handleUserFormSubmit = async (event) => {
    event.preventDefault();
    console.log(userFormState)

    try {
      const { data: userData } = await addUser({
        variables: {
          email: userFormState.email,
          calendarId: data.me.calendars[0]._id
        },
      });

    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleRequestFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data: reservationData } = await createReservation({
        variables: {
          title: formState.title,
          start: formState.start,
          end: formState.end,
          calendarId: data.me.calendars[0]._id
        },
      });

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-column justify-center">
      {data.me.role === 'administrator' && <form id='modalTarget' onSubmit={handleUserFormSubmit}>
      <Card style={{backgroundColor: '#333', padding: '2rem', color: '#fff', margin: 'auto'}} className='flex-row justify-center'>
      
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
      </form>}
      {data.me.role === 'employee' && <form id='modalTarget' onSubmit={handleRequestFormSubmit}>
      <Card style={{backgroundColor: '#333', padding: '2rem', color: '#fff', margin: 'auto'}} className='flex-row justify-center'>
        <h2 className='mb-4 text-center'>Create a Reservation</h2>
        <input
          placeholder="Reservation Title"
          name="title"
          type="title"
          for="title"
          value={formState.title}
          onChange={handleRequestChange}
          className='mb-4 form-input' />
        <input
          placeholder="Reservation Start Date"
          name="start"
          type="start"
          for="start"
          value={formState.start}
          onChange={handleRequestChange}
          className='mb-4 form-input' />
        <input
          placeholder="Reservation End Date"
          name="end"
          type="end"
          for="end"
          value={formState.end}
          onChange={handleRequestChange}
          className='mb-4 form-input' />
        <button type="submit" className='btn'>Submit</button>
        </Card>
      </form>}

      <Calendar calendarId={data.me.calendars[0]._id} userId={data.me._id} userRole={data.me.role}></Calendar>
    </main>

  );
};

export default Home;