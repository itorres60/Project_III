import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

const Profile = () => {
  const { loading, error, data } = useQuery(QUERY_ME);

  if(loading) return 'Loading...';
  if(error) return `${error.message}`;

  if(data.me.role === 'administrator') {
    // needs an input allowing the admin to create a calendar
    return (
      <div>
        Admin
      </div>
    );
  } else if (data.me.role === 'employee' || data.me.role === 'reliever') {
    return (
      <div>
        Not Admin
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