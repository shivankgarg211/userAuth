import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Home() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('')
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true)
          console.log(auth)
          setName(res.data.name)
        } else {
          setAuth(false)
          setMessage(res.data.Error)
          console.log(res.data)
          navigate('/login')
        }

      })
      .then(err => console.log(err));
  })

  const handleDelete = () => {
    axios.get('http://localhost:4000/logout')
      .then(res => {
        window.location.reload();
      }).catch(err => console.log(err));
  }
  return (
    <div className='container mt-4'>
      {
        auth ?
          <div>
            <h3> you are Atuhorized---- {name}</h3>
            <button className='btn btn-danger' onClick={handleDelete}>Logout</button>
          </div>
          :
          <div>
            <h3>{message}</h3>
            <h3>Login Now</h3>
            <Link to="/login" className='btn btn-primary'>Login</Link>
          </div>
      }
    </div>
  )
}

export default Home
