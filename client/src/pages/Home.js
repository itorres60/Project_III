import React from 'react';
import Calendar from '../components/Calendar';

const Home = () => {
  const error = 'noUser';


  return (
    <main className="flex-row justify-center">
    {error && <div style={{color: '#fff'}}>Please contact an administrator to be assigned a calendar</div>}
      <Calendar></Calendar>
    </main>
    
  );
};

export default Home;