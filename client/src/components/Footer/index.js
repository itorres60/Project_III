import React from 'react';

const Footer = () => {
  return (
    <footer className="container w-100 bg-accent-gold">
      <div className='text-center'>
        Relief and Rotation &copy;{new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;
