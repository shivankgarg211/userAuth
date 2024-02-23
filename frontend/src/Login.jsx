import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''

  })


  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:4000/login', values)
      .then(res => {
        if (res.data.status === 'Succes'){
          navigate('/')
        } else {
          alert( "Error");
          console.log(res.data)
        }

      })
      .then (err =>console.log(err));
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>

          <div className='mb-3'>
            <label htmlFor='Email'><strong>Email</strong></label>
            <input type='email' placeholder='Enter email' name='email'
             onChange={e => setValues({ ...values, email: e.target.value })} className='form-control rounded-0' />
          </div>
          <div className='mb-3'>
            <label htmlFor='password'><strong>password</strong></label>
            <input type='password' placeholder='Enter password' name='password'
             onChange={e => setValues({ ...values, password: e.target.value })} className='form-control rounded-0' />
          </div>
          <button type='submit' className='btn btn-success'>Sign up</button>
          <p>you are agree to our term and policies</p>
          <Link to="/register" className='btn btn-default border w-100 bg-light rounded-0 text- decoration-none'>create account</Link>
        </form>
      </div>
    </div>


  )
}

export default Login
