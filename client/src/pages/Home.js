import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import { QUERY_ME } from '../utils/queries';

import { ADD_USER, REMOVE_USER } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import CreateCalendarModal from '../utils/modal';
import { confirmAlert } from 'react-confirm-alert'; // Import
import '../alert.css'; // Import css


const Home = () => {
  const [userFormState, setUserFormState] = useState({
    email: ''
  });

  const { loading, error, data } = useQuery(QUERY_ME);

  const [addUser, { loading: userLoading, error: userError }] = useMutation(ADD_USER);

  const [removeUser, { loading: rUserLoading, error: rUserError }] = useMutation(REMOVE_USER);

  if (userLoading || rUserLoading) return 'Loading...';
  if (userError) return `${userError.message}`;
  if (rUserError) return `${rUserError.message}`;

  if (loading) return 'Loading...';
  if (error) return `${error.message}`;


  const handleUserChange = (event) => {
    const { name, value } = event.target;

    setUserFormState({
      ...userFormState,
      [name]: value,
    });
  };

  const handleUserFormSubmit = async (event) => {
    event.preventDefault();
    
    confirmAlert({
      title: '',
      message: `${userFormState.email} has been added to the calendar`,
      buttons: [
        {
          label: 'Ok'
        }
      ]
    })

    try {
      await addUser({
        variables: {
          email: userFormState.email.toLowerCase(),
          calendarId: data.me.calendars[0]._id
        },
      });

    } catch (e) {
      console.error(e);
    }
    setUserFormState('');
  };

  const handleRemoveUser = (event) => {
    event.preventDefault();
    const user = event.target.parentNode.parentNode.children[0].innerHTML
    
    confirmAlert({
      title: '',
      message: `Remove ${user} from ${data.me.calendars[0].companyName} calendar?`,
      buttons: [
        {
          label: 'Remove',
          onClick: async () => {
            try{
              await removeUser({
                variables: {
                  email: user,
                  calendarId: data.me.calendars[0]._id
                }
              });
            } catch (e) {
              console.error(e);
            }
          }
        },
        {
          label: 'Cancel'
        }
      ]
    })

    setUserFormState('');
  }

  let usersAr;
  if(data.me.calendars) {
    usersAr = data.me.calendars[0].users;
  }

  return (
    <>
      <div id='modalTarget' className='flex-row justify-space-between align-center'>
        <strong style={{color:'#fff'}} >
          {data.me.firstName} {data.me.lastName}
        </strong> 
        <span>{data.me.calendars[0].companyName}</span>  
      </div>
      <div className='flex-row justify-space-between text-subtle'>
            {data.me.role.charAt(0).toUpperCase()}{data.me.role.slice(1)}
            {data && data.me.role === 'administrator' &&
            <CreateCalendarModal 
              className='hide-mobile' 
              handleUserFormSubmit={handleUserFormSubmit} 
              handleUserChange={handleUserChange} 
              handleRemoveUser={handleRemoveUser}
              userFormState={userFormState}
              data={usersAr}>
            </CreateCalendarModal>
          }
      </div> 
      
      <div className='calendar-card'>
        <Calendar 
          calendarId={data.me.calendars[0]._id} 
          userId={data.me._id} 
          userRole={data.me.role} 
          userFirstName={data.me.firstName}>
        </Calendar>
      </div>
  </>

  );
};

export default Home;