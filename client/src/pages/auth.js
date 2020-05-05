import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import back from '../images/apple-computer-decor-design-326502.jpg'
import './auth.css'
import { withRouter, Link } from 'react-router-dom'
import Lottie from 'react-lottie';
import Cms from '../anim/17343-programming.json'

function LoginRT (props) {
    console.log(props)
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: Cms,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };
     
  return (
    <div className='h-full w-full grid grid-cols-1 md:grid-cols-2'>
      <div className='bg-blue-900 w-full hidden md:block leftHook'>
        <div className='absolute h-full w-full leftHookCover'></div>
        <div className='absolute leftHeading w-full h-full flex flex-col justify-center items-center'>
          <h1 className='text-6xl text-white antialiased font-bold pb-3'>
            Reverse CMS
          </h1>
          <Lottie options={defaultOptions}
             height={400}
             width={400}
              isStopped={false}
              isPaused={false}/>
          <p className='text-xl text-blue-100'>Manage web pages with ease</p>
        </div>
      </div>

     {props.location.pathname === "/" || props.location.pathname == "/login"? (
        <div className='w-full flex flex-col justify-center items-center'>
        <div className='w-4/5 md:w-3/5 lg:w-2/5'>
          <form className='bg-white  rounded px-8 pt-6 pb-8 mb-4'>
          <h3 className="md:hidden text-2xl text-blue-900 text-center font-bold">Reverse CMS</h3>
            <hr/>
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
                type='text'
                placeholder='Username'
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
                type='password'
                placeholder='******************'
              />
             
            </div>
            <div className='flex flex-col items-center justify-between'>
              <button
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
           Don't have an account? <Link className="text-gray-700" to="/signup">Create One</Link>
          </p>
            </div>
          </form>
          <p className='text-center text-gray-500 text-xs'>
            &copy;{new Date().getFullYear()} Epareto Information Systems. All rights reserved.
          </p>
          
        </div>
      </div>
    
     ):
         <Register/>
     }
    </div>
  )
}

const Login = withRouter(LoginRT)

function Register () {
  return(
    <div className='w-full flex flex-col justify-center items-center'>
    <div className='w-4/5 md:w-2/5'>
      <form className='bg-white  rounded px-8 pt-6 pb-8 mb-4'>
      <h3 className="md:hidden text-2xl text-blue-900 text-center font-bold">Reverse CMS</h3>
            <hr/>
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
            placeholder='******************'
          />
          <p className='text-red-500 text-xs italic'>
            Please choose a password.
          </p>
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
            type='password'
            placeholder='******************'
          />
          <p className='text-red-500 text-xs italic'>
            Please repeat password
          </p>
        </div>
        <div className='flex flex-col items-center justify-between'>
          <button
            className='bg-blue-900 w-full mb-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='button'
          >
            Create account
          </button>
         
          <p className='text-center text-gray-500'>
       Already a member? <Link className="text-gray-700" to="/">Login</Link>
      </p>
        </div>
      </form>
      <p className='text-center text-gray-500 text-xs'>
        &copy;{new Date().getFullYear()} Epareto Information Systems. All rights reserved.
      </p>
      
    </div>
  </div>

  )
}


function Forgot(props) {
    if(props.location.pathname == "/" || props.location.pathname =="/login")return <Login/>;
    if(props.location.pathname == "/signup")return <Login/>;
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className='w-4/5 md:w-3/5 lg:w-1/4'>
            
          <form className='bg-white  rounded px-8 pt-6 pb-8 mb-4'>
          <h2 className="text-center text-blue-900 md:text-4xl text-xl font-bold">Recover Password</h2>
         <hr/>
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
           Remember Password? <Link className="text-gray-700" to="/login">Sign In</Link>
          </p>
            </div>
          </form>
          <p className='text-center text-gray-500 text-xs'>
            &copy;{new Date().getFullYear()} Epareto Information Systems. All rights reserved.
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
        return <Login />;
        case '/login':
            return <Login />;
      case '/signup':
        return <Login />;
      case '/forgot':
        return <ForgotR/>;
    }
  }

  componentDidMount () {
    console.log(this.props)
  }

  render () {
    return <div className='w-screen h-screen'>{this.renderPage()}</div>
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Auth))
