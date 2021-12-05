import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
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
    } catch (e) {
      window.alert(`Invalid login information.  Please try again or contact administrator for access.`)
    }

    // clear form values
    setFormState({
      email: '',
      password: '',
    });
  };

  return (
    <main className="flex-row justify-center" style={{ marginTop: '5rem' }}>
      <div className="col-md-5">

        <Card sx={{ minWidth: 275 }} style={{ backgroundColor: '#333' }}>
          <div className="flex-row justify-center mb-4">
            <h2 style={{ color: '#fff' }}>Welcome Back!</h2>
          </div>
          <CardContent className="flex-row justify-center mb-4">
            <form onSubmit={handleFormSubmit}>
              <label id="email" style={{ color: '#fff' }}>Email: </label>
              <input
                name="email"
                type="email"
                value={formState.email}
                placeholder="example@mail.com"
                style={{ marginLeft: '2rem' }}
                onChange={handleChange}>
              </input>
              <br />
              <br />
              <label id="password" style={{ color: '#fff' }}>Password: </label>
              <input
                name="password"
                type="password"
                value={formState.password}
                placeholder="••••••••••"
                onChange={handleChange}>
              </input>
              <CardActions className="flex-row justify-center mt-4">
                <Button type="submit" size="large" variant="contained" style={{ backgroundColor: '#9C27B0' }}>Login</Button>
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
