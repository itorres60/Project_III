import React from 'react';
import Calendar from '../components/Calendar';
import { QUERY_ME } from '../utils/queries';
import { useQuery } from '@apollo/client';

const Home = () => {
  const { loading, error, data} = useQuery(QUERY_ME);

  if (loading) return 'Loading...';
  if (error) return `${error.messaage}`;
  return (
    <main className="flex-row justify-center">
      <Calendar calendar={data.me.calendars[0]} userId={data.me._id} userRole={data.me.role}></Calendar>
    </main>
    
  );
};

export default Home;