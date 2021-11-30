import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import { QUERY_ME } from '../utils/queries';
import { ADD_USER } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';

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
    <main className="flex-row justify-center">
      {data.me.role === 'administrator' && <form id='modalTarget' onSubmit={handleUserFormSubmit}>
        <h2>Add a user to the calendar.</h2>
        <input
          placeholder="Employee's Email"
          name="email"
          type="email"
          for="email"
          value={userFormState.email}
          onChange={handleUserChange}
          className='mb-4' />
        <button type="submit">Submit</button>
      </form>}
      <Calendar calendarId={data.me.calendars[0]._id} userId={data.me._id} userRole={data.me.role} userFirstName={data.me.firstName}></Calendar>
    </main>

  );
};

export default Home;