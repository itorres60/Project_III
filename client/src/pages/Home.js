import React from 'react';
import Calendar from '../components/Calendar';
import { QUERY_ME } from '../utils/queries';
import { useQuery } from '@apollo/client';


const Home = () => {

  const { loading, error, data } = useQuery(QUERY_ME);


  if (loading) return 'Loading...';
  if (error) return `${error.message}`;

  return (
    <main className="flex-column justify-center">
    
      <div id='modalTarget' className='flex-row justify-space-between align-center'>
        <strong style={{color:'#fff', marginTop: '-20px'}} >
          {data.me.firstName} {data.me.lastName}
          <span style={{fontSize:'1.25rem', color:'#999'}} className='flex-row align-center role-mobile'>
            {data.me.role.charAt(0).toUpperCase()}{data.me.role.slice(1)}
          </span>
        </strong>

      </div>
      
      <div className='calendar-card'>
        <Calendar 
          calendarId={data.me.calendars[0]._id} 
          userId={data.me._id} 
          userRole={data.me.role} 
          userFirstName={data.me.firstName}>
        </Calendar>
      </div>
    </main>

  );
};

export default Home;