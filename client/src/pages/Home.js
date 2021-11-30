import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import { QUERY_ME } from '../utils/queries';
import { ADD_USER } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import Card from '@mui/material/Card';

const Home = () => {
  const [userFormState, setUserFormState] = useState({
    email: ''
  });

  const { loading, error, data } = useQuery(QUERY_ME);
  const [addUser, { loading: userLoading, error: userError }] = useMutation(ADD_USER);

  if (loading || userLoading) return 'Loading...';
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
          email: userFormState.email.toLowerCase(),
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
      <div className='mt-5 mb-4'>
      <Calendar calendarId={data.me.calendars[0]._id} userId={data.me._id} userRole={data.me.role} userFirstName={data.me.firstName}></Calendar>
      </div>
    </main>

  );
};

export default Home;