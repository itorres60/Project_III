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
  const [login, { error }] = useMutation(LOGIN_USER);

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
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
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
                for="email"
                value={setFormState.email}
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
                for="password"
                value={setFormState.password}
                placeholder="••••••••••"
                onChange={handleChange}>
              </input>
            </form>
          </CardContent>
          <CardActions className="flex-row justify-center">
            <Button size="large" variant="contained" style={{ backgroundColor: '#9C27B0' }} onClick={login}>Login</Button>
          </CardActions>
          <div className="flex-row justify-center mb-4">
            <p style={{ color: '#fff' }}>Don't have an account? 
            <br />
              <div className="flex-row justify-center">
                <a style={{ color: '#29b6f6' }} href="/signup">Signup</a>
              </div>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Login;
