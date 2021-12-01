import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import { QUERY_ME } from '../utils/queries';
import { ADD_USER } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import CreateCalendarModal from '../utils/modal';

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
      {data.me.role === 'administrator' &&
        <div id='modalTarget'>
          <CreateCalendarModal className='hide-mobile' handleUserFormSubmit={handleUserFormSubmit} handleUserChange={handleUserChange} userFormState={userFormState}></CreateCalendarModal>
        </div>
      }
      <div className='mt-5 mb-4'>
        <Calendar calendarId={data.me.calendars[0]._id} userId={data.me._id} userRole={data.me.role} userFirstName={data.me.firstName}></Calendar>
      </div>
    </main>

  );
};

export default Home;