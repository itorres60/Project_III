import React from 'react';

const Footer = () => {
  return (
    <footer className="w-100 bg-accent-gold">
      <div className='text-center m-2'>
        Relief and Rotation &copy;{new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;
