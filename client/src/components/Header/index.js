import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QUERY_ME } from '../../utils/queries';
import { ADD_USER, REMOVE_USER } from '../../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import CreateCalendarModal from '../../utils/modal';
import { confirmAlert } from 'react-confirm-alert'; // Import
import '../../alert.css'; // Import css
import Auth from '../../utils/auth';

const Header = () => {
  const [userFormState, setUserFormState] = useState({
    email: ''
  });

  const { loading, error, data } = useQuery(QUERY_ME);

  const [addUser, { loading: userLoading, error: userError }] = useMutation(ADD_USER);

  const [removeUser, { loading: rUserLoading, error: rUserError }] = useMutation(REMOVE_USER);

  if (loading || userLoading || rUserLoading) return 'Loading...';
  if (userError) return `${userError.message}`;
  if (rUserError) return `${rUserError.message}`;
  if (error) return `${error.message}`;

  const logout = event => {
    event.preventDefault();
    Auth.logout();
  };

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
    console.log(user)

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

  const usersAr = data.me.calendars[0].users;

  return (
    <header className="bg-tertiary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>Relief & Rotations</h1>
        </Link>

        <nav className="flex-row text-center nav-bar">

        {data.me.role === 'administrator' &&
          <CreateCalendarModal 
            className='hide-mobile' 
            handleUserFormSubmit={handleUserFormSubmit} 
            handleUserChange={handleUserChange} 
            handleRemoveUser={handleRemoveUser}
            userFormState={userFormState}
            data={usersAr}>
          </CreateCalendarModal>
        }
          {Auth.loggedIn() ? (
            <>
              <a href="/" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
