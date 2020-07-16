import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toaster } from 'evergreen-ui'
import back from '../images/apple-computer-decor-design-326502.jpg'
import './auth.css'
import { withRouter, Link, Redirect } from 'react-router-dom'
import Lottie from 'react-lottie'
import {LOGIN_SCRIPT, REGISTER_NEW_USER} from '../utils/queries'
import Cms from '../anim/17343-programming.json'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { LoginUser } from '../actions'

function LoginRT (props) {
  const [loginRun] = useMutation(LOGIN_SCRIPT);
  const [values, setValues] = React.useState({
    signClicked: false,
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  })
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Cms,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  const onChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const Login = async()=>{
    if(!values.username || !values.password)return toaster.warning('Please fill all fields');
    loginRun({
      variables: { username: values.username, password: values.password }
    }).then((response)=>{
      if(!response.data.login._id)return toaster.danger('Invalid Username and/or password');
      toaster.success('Login Successful')
      props.LoginUser(response.data.login)
    }).catch((error)=>{
      return toaster.danger('Invalid Username and/or password')
    })
   
  }

  return (
    <div className='h-full w-full grid grid-cols-1 md:grid-cols-2'>
      <div className='bg-blue-900 w-full hidden md:block leftHook'>
        <div className='absolute h-full w-full leftHookCover'></div>
        <div className='absolute leftHeading w-full h-full flex flex-col justify-center items-center'>
         
          <Lottie
            options={defaultOptions}
            height={400}
            width={400}
            isStopped={false}
            isPaused={false}
          />
          <p className='text-xl text-blue-100 font-bold'>Manage web pages with ease</p>
        </div>
      </div>

      {props.location.pathname === '/' ||
      props.location.pathname == '/login' ? (
        <div className='w-full flex flex-col justify-center items-center'>
          <div className='w-4/5 md:w-3/5 lg:w-2/5'>
            <form className='bg-white  rounded px-8 pt-6 pb-8 mb-4'>
              <h3 className='md:text-4xl text-2xl text-blue-900 text-center font-bold'>
                Tentem Web
              </h3>
              <hr />
              <div className='mb-4 mt-6'>
                <label
                  className='block text-blue-900 text-sm font-bold mb-2'
                  for='username'
                >
                  Email
                </label>
                <input
                  className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
                  id='email'
                  type='email'
                  onChange={onChange}
                  name="username"
                  value={values.username}
                  placeholder='right@gmail.com'
                />
              </div>
              <div className='mb-6'>
                <label
                  className='block text-blue-900 text-sm font-bold mb-2'
                  for='password'
                >
                  Password
                </label>
                <input
                  className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
                  id='password'
                  value={values.password}
                  onChange={onChange}
                  name="password"
                  type='password'
                  placeholder='******************'
                />
              </div>
              <div className='flex flex-col items-center justify-between'>
                <button
                onClick={Login}
                  className='bg-blue-900 w-full mb-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  type='button'
                >
                  Sign In
                </button>
                <a
                  className='inline-block align-baseline mb-4 font-bold text-sm text-blue-900 hover:text-blue-800'
                  href='/forgot'
                >
                  Forgot Password?
                </a>
                <p className='text-center text-gray-500'>
                  Don't have an account? <br className="md:hidden"/>
                  <Link className='text-gray-700' to='/signup'>
                    Create One
                  </Link>
                </p>
              </div>
            </form>
            <p className='text-center text-gray-500 text-xs'>
              &copy;{new Date().getFullYear()} Epareto Information Systems. <br className="md:hidden"/> All
              rights reserved.
            </p>
          </div>
        </div>
      ) : (
        <Register />
      )}
    </div>
  )
}

function RegisterT (props) {
  const [registerRun, { loading, error }] = useMutation(REGISTER_NEW_USER);
  const [values, setValues] = React.useState({
    signClicked: false,
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  })
  const onChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const Register = async () =>{
    const {username, password, confirmPassword, email} = values;
    if(!username || !password || !confirmPassword || !email)return toaster.warning("Please fill all fields");
    if(password !== confirmPassword)return toaster.danger('Passwords do not match');
    registerRun({
      variables: { username, password, email }
    }).then((response)=>{
      toaster.success('Registered Successfully');
      props.history.push('/');
      // props.LoginUser(response.data.register)
    }).catch((error)=>{
      return toaster.danger('Either email or username is taken already');
    })
   
  }
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <div className='w-4/5 md:w-2/5'>
        <form className='bg-white  rounded px-8 pt-6 pb-8 mb-4'>
          <h3 className='md:text-4xl text-2xl text-blue-900 text-center font-bold'>
            Tentem Web
          </h3>
          <hr />
          <div className='mb-4 mt-6'>
            <label
              className='block text-blue-900 text-sm font-bold mb-2'
              for='username'
            >
              Username
            </label>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
              id='username'
              value={values.username}
              onChange={onChange}
              name="username"
              type='text'
              placeholder='Username'
            />
          </div>
          <div className='mb-4'>
            <label
              className='block text-blue-900 text-sm font-bold mb-2'
              for='username'
            >
              Email
            </label>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
              id='email'
              value={values.email}
              onChange={onChange}
              name="email"
              type='email'
              placeholder='Email'
            />
          </div>
          <div className='mb-4'>
            <label
              className='block text-blue-900 text-sm font-bold mb-2'
              for='password'
            >
              Password
            </label>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
              id='password'
              type='password'
              value={values.password}
              onChange={onChange}
              name="password"
              placeholder='******************'
            />
           
          </div>
          <div className='mb-6'>
            <label
              className='block text-blue-900 text-sm font-bold mb-2'
              for='password'
            >
              Confirm Password
            </label>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
              id='password'
              value={values.confirmPassword}
              onChange={onChange}
              type='password'
              name="confirmPassword"
              placeholder='******************'
            />
            
          </div>
          <div className='flex flex-col items-center justify-between'>
            <button
              className='bg-blue-900 w-full mb-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='button'
              onClick={Register}
            >
              Create account
            </button>

            <p className='text-center text-gray-500'>
              Already a member?<br className="md:hidden"/>
              <Link className='text-gray-700' to='/'>
                Sign In
              </Link>
            </p>
          </div>
        </form>
        <p className='text-center text-gray-500 text-xs'>
          &copy;{new Date().getFullYear()} Epareto Information Systems. <br className="md:hidden"/> All
          rights reserved.
        </p>
      </div>
    </div>
  )
}

function Forgot (props) {
  if (props.location.pathname == '/' || props.location.pathname == '/login')
    return <Login />
  if (props.location.pathname == '/signup') return <Login />
  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <div className='w-4/5 md:w-3/5 lg:w-1/4'>
        <form className='bg-white  rounded px-8 pt-6 pb-8 mb-4'>
          <h2 className='text-center text-blue-900 md:text-4xl text-xl font-bold'>
            Recover Password
          </h2>
          <hr />
          <div className='mb-4 mt-6'>
            <label
              className='block text-blue-900 text-sm font-bold mb-2'
              for='username'
            >
              Email
            </label>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
              id='emailForgot'
              type='email'
              placeholder='Your Email'
            />
          </div>
          <div className='flex flex-col items-center justify-between'>
            <button
              className='bg-blue-900 w-full mb-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='button'
            >
              Send Reset Email
            </button>

            <p className='text-center text-sm md:text-xl text-gray-500'>
              Remember Password?{' '}
              <Link className='text-gray-700' to='/login'>
                Sign In
              </Link>
            </p>
          </div>
        </form>
        <p className='text-center text-gray-500 text-xs'>
          &copy;{new Date().getFullYear()} Epareto Information Systems. All
          rights reserved.
        </p>
      </div>
    </div>
  )
}

const ForgotR = withRouter(Forgot)

class Auth extends PureComponent {
  static propTypes = {}

  constructor (props) {
    super(props)

    this.state = {
      route: this.props.location.pathname
    }
  }

  renderPage = () => {
    switch (this.state.route) {
      case '/':
        return <Login LoginUser={this.props.LoginUser} />
      case '/login':
        return <Login LoginUser={this.props.LoginUser} />
      case '/signup':
        return <Login LoginUser={this.props.LoginUser} />
      case '/forgot':
        return <ForgotR />
    }
  }

  componentDidMount () {
  }

  render () {
    if(this.props.PROFILE._id){
      return <Redirect to="/home"/>
    }
    return <div className='w-screen h-screen'>{this.renderPage()}</div>
  }
}

const mapStateToProps = state => (state)

const mapDispatchToProps = {
  LoginUser
}

const Login = withRouter(LoginRT);
const Register = connect(mapStateToProps, mapDispatchToProps)(withRouter(RegisterT));

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Auth))
