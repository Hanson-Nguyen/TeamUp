import { useState } from 'react'
import { Link } from 'react-router-dom'
import ApiStore from '../components/api-store'
import '../css/signup/signup.scss'

function RegisterPage() {

  const initialRegistrationState = {
    email : '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_pass: ''
  }

  const [registerationState, setRegsitrationState] = useState(initialRegistrationState)
  const [showPasswordDisplay, setPasswordDisplay] = useState(false);

  document.title = 'TeamUp Create Account'

  const handleChange = (e, property) => {
    let updatedValue = {};
    updatedValue = { [property]: e.target.value };
    setRegsitrationState(registerationState => ({
          ...registerationState,
          ...updatedValue
        }));
    }

    const togglePasswordDisplay = () => {
      setPasswordDisplay(!showPasswordDisplay)
    }

    const onSubmit = async (e) => {
      e.preventDefault()
      const {password, confirm_pass} = registerationState

      if (password !== confirm_pass) return
      const res = await ApiStore.createUser(registerationState)

      if (!res) {
        //TODO: alert user
      }

      //TODO: let user know they've created an account
      console.log('I Submitted')
    }

  return (
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

          <form className='signup-card-form' onSubmit={onSubmit}>
            <div className='form-title'>First Name</div>
            <div className='form-item'>
              <input className='form-input' type='text' defaultValue={registerationState.first_name} onChange={(e) => handleChange(e, 'first_name')} required autoFocus />
            </div>

            <div className='form-title'>Last Name</div>
            <div className='form-item'>
              <input className='form-input' type='text' defaultValue={registerationState.last_name} onChange={(e)=> handleChange(e, 'last_name')} required autoFocus />
            </div>

            <div className='form-title'>Email Address</div>
            <div className='form-item'>
              <input className='form-input' type='text' defaultValue={registerationState.email} onChange={(e)=> handleChange(e, 'email')} required autoFocus />
            </div>

            <div className='form-title'>Password</div>
            <div className='form-item'>
              <input className='form-input' type={showPasswordDisplay ? 'text' : 'password'} defaultValue={registerationState.password} onChange={(e)=> handleChange(e, 'password')} id='passwordInput' required autoFocus />
            </div>

            <div className='form-title'>Confirm Password</div>
            <div className='form-item'>
              <input className='form-input' type={showPasswordDisplay ? 'text': 'password'} defaultValue={registerationState.confirm_pass} onChange={(e)=> handleChange(e, 'confirm_pass')} required autoFocus />
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
