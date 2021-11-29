import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import { QUERY_ME } from '../utils/queries';
import { ADD_USER } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';

const Home = () => {
  const [formState, setFormState] = useState({
    email: ''
  });
  const { loading, error, data } = useQuery(QUERY_ME);
  const [ addUser, { loading: userLoading, error: userError } ] = useMutation(ADD_USER);

  if (loading || userLoading) return 'Loading...';
  if (userError) return `${userError.message}`;
  if (error) return `${error.message}`;

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
    console.log(formState)

    try {
      const { data: userData } = await addUser({
        variables: { 
          email: formState.email,
          calendarId: data.me.calendars[0]._id
         },
      });

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center">
      {data.me.role === 'administrator' && <form id='modalTarget' onSubmit={handleFormSubmit}>
        <h2>Add a user to the calendar.</h2>
        <input
          placeholder="Employee's Email"
          name="email"
          type="email"
          for="email"
          value={formState.email}
          onChange={handleChange}
          className='mb-4' />
        <button type="submit">Submit</button>
      </form>}
      <Calendar calendar={data.me.calendars[0]} userId={data.me._id} userRole={data.me.role}></Calendar>
    </main>

  );
};

export default Home;