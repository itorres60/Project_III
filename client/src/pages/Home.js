import React from 'react';

const Home = () => {
  const error = 'noUser';


  return (
    <main className="flex-row justify-center">
    {error && <div style={{color: '#fff'}}>Please contact an administrator to be assigned a calendar</div>}
    </main>
    
  );
};

export default Home;
