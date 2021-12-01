import React from 'react';

const Footer = () => {
  return (
    <footer className="w-100 mt-auto bg-secondary">
      <div style={{marginTop: '-7px'}}>
        Relief and Rotation &copy;{new Date().getFullYear()} by <a href='' target='_blank'>Zach</a>, <a href='' target='_blank'>AB</a>, <a href='' target='_blank'>Bailey</a>, and <a href='' target='_blank'>J</a>
      </div>
    </footer>
  );
};

export default Footer;
