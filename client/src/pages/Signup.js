import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Auth from '../utils/auth';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Signup = () => {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  });
  const [createUser, { error }] = useMutation(CREATE_USER);

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
    console.log(formState)

    try {
      const { data } = await createUser({
        variables: { ...formState },
      });

      Auth.login(data.createUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-md-6">
        <Card sx={{ minWidth: 275 }} style={{ backgroundColor: '#333' }} className="flex-row justify-center">
          <CardContent>
            <h2 className="flex-row justify-center mt-0" style={{ color: '#fff' }}>Sign Up</h2>
            <form onSubmit={handleFormSubmit} className="justify-center" style={{ color: '#fff' }}>

              <label id="firstName">First Name: </label>
              <br />
              <input
                placeholder="Your first name"
                name="firstName"
                type="firstName"
                for="firstName"
                value={formState.firstName}
                onChange={handleChange}
                className='mb-4'
              />
              <br />
              <label id="lastName">Last Name: </label>
              <br />
              <input
                placeholder="Your last name"
                name="lastName"
                type="lastName"
                for="lastName"
                value={formState.lastName}
                onChange={handleChange}
                className='mb-4'
              />
              <br />
              <label id="email">Email: </label>
              <br />
              <input
                placeholder="Your email"
                name="email"
                type="email"
                for="email"
                value={formState.email}
                onChange={handleChange}
                className='mb-4'
              />
              <br />
              <label id="password">Password: </label>
              <br />
              <input
                placeholder="******"
                name="password"
                type="password"
                for="password"
                value={formState.password}
                onChange={handleChange}
              />
              <br />
              <br />

              <div className='mb-4'>
                <FormControl component="fieldset">
                  <FormLabel component="legend" color="secondary">Choose a role:</FormLabel>
                  <RadioGroup
                    aria-label="role"
                    defaultValue="employee"
                    name="role"
                    onChange={handleChange}
                  >
                    <FormControlLabel value="employee" control={<Radio color="secondary"/>} label="Employee" />
                    <FormControlLabel value="reliever" control={<Radio color="secondary" />} label="Reliever" />
                    <FormControlLabel value="administrator" control={<Radio color="secondary" />} label="Administrator" />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="flex-row justify-center mb-4">
                <CardActions>
                  <Button type="submit" size="large" variant="contained" style={{ backgroundColor: '#9C27B0' }} className='flex-row justify-center'>Submit</Button>
                </CardActions>
              </div>
            </form>

            <div className="flex-row justify-center mb-4">
              <p style={{ color: '#fff' }}>Already have an account?
                <br />
                <div className="flex-row justify-center">
                  <a style={{ color: '#29b6f6' }} href="/login">Login</a>
                </div>
              </p>
            </div>
            {error && <div style={{ color: '#fff' }}>Signup failed</div>}
          </CardContent>

        </Card>
      </div>
    </main>
  );
};



export default Signup;
