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
        variables: { 
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email.toLowerCase(),
          password: formState.password,
          role: formState.role
         },
      });

      Auth.login(data.createUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-md-6">
        <Card sx={{ minWidth: 275 }} style={{ backgroundColor: '#004b8d', borderRadius:'30px'}} className="flex-row justify-center">
          <CardContent>
            <h2 className="flex-row justify-center mt-0" style={{ color: '#fff', marginBottom:'40px', marginTop:'20px' }}>Sign Up</h2>
            <form onSubmit={handleFormSubmit} className="justify-center" style={{ color: '#fff' }}>

              <label id="firstName">First Name: </label>
              <br />
              <input
                placeholder="Your first name"
                name="firstName"
                type="firstName"
                htmlFor="firstName"
                value={formState.firstName}
                onChange={handleChange}
                className='form-input'
              />
              <br />
              <label id="lastName">Last Name: </label>
              <br />
              <input
                placeholder="Your last name"
                name="lastName"
                type="lastName"
                htmlFor="lastName"
                value={formState.lastName}
                onChange={handleChange}
                className='form-input'
              />
              <br />
              <label id="email">Email: </label>
              <br />
              <input
                placeholder="Your email"
                name="email"
                type="email"
                htmlFor="email"
                value={formState.email}
                onChange={handleChange}
                className='form-input'
              />
              <br />
              <label id="password">Password: </label>
              <br />
              <input
                placeholder=""
                name="password"
                type="password"
                htmlFor="password"
                value={formState.password}
                onChange={handleChange}
                className='form-input'
              />
              <br />
              <br />

              <div className='mb-4'>
                <FormControl component="fieldset">
                  <FormLabel component="legend" color="secondary" style={{color:'#fff'}}>Choose a role:</FormLabel>
                  <RadioGroup
                    aria-label="role"
                    id="role"
                    name="role"
                    onChange={handleChange}
                  >
                    <FormControlLabel value="employee" control={<Radio color="secondary"/>} label="Employee" />
                    <h6 style={{fontSize:'0.85rem', marginLeft: '2rem', color:'#d16d2c'}}>- Creates Reservations</h6>
                    <FormControlLabel value="reliever" control={<Radio color="secondary" />} label="Reliever" />
                    <h6 style={{fontSize:'0.85rem', marginLeft: '2rem', color:'#d16d2c'}}>- Accepts Reservations</h6>
                    <FormControlLabel value="administrator" control={<Radio color="secondary" />} label="Administrator" />
                    <h6 style={{fontSize:'0.85rem', marginLeft: '2rem', color:'#d16d2c'}}>- Controls Calendar(s)</h6>
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="flex-row justify-center mb-4">
                <CardActions>
                  <Button type="submit" size="large" variant="contained" style={{ backgroundColor: '#d16d2c' }} className='flex-row justify-center'>Submit</Button>
                </CardActions>
              </div>
            </form>

            <div className="flex-row justify-center mb-4">
              <p style={{ color: '#fff' }}>Already have an account?
                <br />
                <a className='flex-row justify-center' style={{ color: '#29b6f6' }} href="/login">Login</a>
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
