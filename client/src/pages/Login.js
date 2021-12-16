import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { confirmAlert } from 'react-confirm-alert'; // Import
import '../alert.css'; // Import css
import Auth from '../utils/auth';


const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
const [login/* , { error } */] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { 
          email: formState.email.toLowerCase(),
          password: formState.password
         },
      });

      Auth.login(data.login.token);

      // clear form values
      setFormState({
        email: '',
        password: '',
      });

    } catch (e) {
      confirmAlert({
        title: 'Invalid Login',
        message: 'Invalid login information.  Please try again or contact administrator for access.',
        buttons: [{
          label: 'Ok'
        }]
      })

      // clear form values
      setFormState({
        password: '',
      });
    }
  };

  return (
    <main className="flex-row justify-center">
      <div className="col-md-5">
        <Card sx={{ minWidth: 350 }} style={{ backgroundColor: '#004b8d', paddingTop: '30px', borderRadius: '30px' }}>
            <h2 className='text-light text-center'>Welcome Back!</h2>
          <CardContent className="flex-row justify-center mb-4">
            <form onSubmit={handleFormSubmit}>
              <label id="email" style={{ color: '#fff' }}>Email: </label>
              <input
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                className="form-input">
              </input>
              <br />
              <label id="password" style={{ color: '#fff' }}>Password: </label>
              <input
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
                className="form-input">
              </input>
              <CardActions className="flex-row justify-center mt-4">
                <Button type="submit" size="large" variant="contained" style={{ backgroundColor: '#292929' }}>Login</Button>
              </CardActions>
            </form>
          </CardContent>
          
          <div className="flex-column justify-center mb-4">
            <p style={{ color: '#fff' }} className='text-center'>Don't have an account?</p>
            <div className='flex-row justify-center'>
                <a style={{ color: '#29b6f6' }} href="/signup">Signup</a>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Login;
