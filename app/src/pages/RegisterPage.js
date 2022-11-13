import { useState } from 'react'
import { Link } from 'react-router-dom'
import ApiStore from '../components/api-store'
import Alert from '../components/alert'
import '../css/signup/signup.scss'

const RegisterPage = () => {

  const initialFormState = {
    email : '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_pass: ''
  }

  const initAlertState = {
    show: false,
    message: 'This is a test message.',
    type: 'info'
  }

  const [formState, setFormState] = useState(initialFormState)
  const [alertState, setAlertState] = useState(initAlertState);
  const [showPasswordDisplay, setPasswordDisplay] = useState(false);
  const [registrationState, setRegistrationState] = useState(false);

  document.title = 'TeamUp Create Account'

  const handleChange = (e, property) => {
    let updatedValue = {};
    updatedValue = { [property]: e.target.value };
    setFormState(registerationState => ({
          ...registerationState,
          ...updatedValue
        }));
    }

    const togglePasswordDisplay = () => {
      setPasswordDisplay(!showPasswordDisplay)
    }

    const onSubmit = async (e) => {
      e.preventDefault()
      const {password, confirm_pass} = formState

      if (password !== confirm_pass) {
        setAlertState({
          show: true,
          message: 'Passwords do not match.',
          type: 'info'
        })

        return
      }

      const res = await ApiStore.createUser(formState)

      if (res.error) {
        setAlertState({
          show: true,
          message: 'That email is already in use.',
          type: 'info'
        })

        return
      }

      setRegistrationState(true);
    }

    const displayAlert = () => {
      if (alertState.show)
        return <Alert message={alertState.message} type={alertState.type}></Alert>

      return false
    }

  return registrationState ?
   (
    <>
      <img src='images/background_waves_3.svg' alt='background waves' className='waves' />
      <div className='signup'>
        <div className='signup-card'>
            <div className='signup-card-logo'>
              <img src='images/TeamUp.png' alt='logo' />
            </div>

            <div className='signup-card-header'>
              <h1>Welcome to TeamUp</h1>
              <div>Thank you for registering an account with us.</div>
            </div>

            <Link to='/login'>
              <button className='button'>go to signin</button>
            </Link>
        </div>
      </div>
    </>
   ):
   (
    <>
      <img src='images/background_waves_3.svg' alt='background waves' className='waves' />

      <div className='signup'>
        <div className='signup-card'>
          <div className='signup-card-logo'>
            <img src='images/TeamUp.png' alt='logo' />
          </div>

          <div className='signup-card-header'>
            <h1>Welcome to TeamUp</h1>
            <div>Create an account to team up with friends, classmates and the whole world with ease</div>
          </div>

          {displayAlert()}

          <form className='signup-card-form' onSubmit={onSubmit}>
            <div className='form-title'>First Name</div>
            <div className='form-item'>
              <input className='form-input' type='text' defaultValue={formState.first_name} onChange={(e) => handleChange(e, 'first_name')} required autoFocus />
            </div>

            <div className='form-title'>Last Name</div>
            <div className='form-item'>
              <input className='form-input' type='text' defaultValue={formState.last_name} onChange={(e)=> handleChange(e, 'last_name')} required autoFocus />
            </div>

            <div className='form-title'>Email Address</div>
            <div className='form-item'>
              <input className='form-input' type='text' defaultValue={formState.email} onChange={(e)=> handleChange(e, 'email')} required autoFocus />
            </div>

            <div className='form-title'>Password</div>
            <div className='form-item'>
              <input className='form-input' type={showPasswordDisplay ? 'text' : 'password'} defaultValue={formState.password} onChange={(e)=> handleChange(e, 'password')} id='passwordInput' required autoFocus />
            </div>

            <div className='form-title'>Confirm Password</div>
            <div className='form-item'>
              <input className='form-input' type={showPasswordDisplay ? 'text': 'password'} defaultValue={formState.confirm_pass} onChange={(e)=> handleChange(e, 'confirm_pass')} required autoFocus />
            </div>

            <div className='form-item-other'>
              <div className='checkbox'>
                <input type='checkbox' id='showPasswordBox' onChange={togglePasswordDisplay} />
                <label htmlFor='showPasswordBox'>Show Password</label>
              </div>
            </div>

            <button type='submit'>Create Account</button>
          </form>

          <div className='signup-card-footer'>
            Already have an account? <Link to='/login'>Sign in</Link>.
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
