import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Pane } from 'evergreen-ui'
import './home.css'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { withRouter, Link, useLocation, Redirect } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import HomeContent from './Homecontent'
import {LogoutUser} from '../actions'
import { FiHome, FiSettings, FiUser, FiLogOut, FiEdit, FiEye, FiDelete } from 'react-icons/fi'
class Home extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      route: 'home',
      content: 'Published'
    }
  }
  change = page => {
    this.content(page.content)
    this.setState({
      route: [page.page]
    })
   
  }

  content = g => {
    this.setState({
      content: g
    })
  }

  renderContent = v => {
    return <HomeContent page={v}/>
  }

  render () {
    if(!this.props.PROFILE._id){
      return <Redirect to="/"/>
    }
    return (
      <div className='w-screen h-screen flex flex-col md:flex-row '>
        <Pane
          elevation={4}
          className='sid h-full  hidden md:flex flex-col pt-20'
        >
          <Navs route={this.state.route} logout={this.props.LogoutUser} change={this.change} />
        </Pane>
        <div className='roP h-full flex flex-col'>
          <Navbar name='' />
          <Vnav route={this.state.route} content={this.content} />
        </div>
        <div className='mainPage w-full'>
          {this.renderContent(this.state.content)}
        </div>
      </div>
    )
  }
}

function VnavL (props) {
  const lok = useSpring({
    opacity: 1,
    from: { opacity: 0 }
  })
  const menus = menu => {
    
    if(Array.isArray(menu))menu=menu[0];
    switch (menu) {
      case 'home':
        let mn = ['Published']
        return mn.map(p => (
          <animated.div style={lok}>
            <ListItem button name={p} onClick={() => props.content(p)}>
              <ListItemText primary={p} />
            </ListItem>
          </animated.div>
        ))
      case 'users':
        let vm = props.PROFILE.userType>0? ['Accounts', 'Add user', 'Profile']:['Profile'];
        return vm.map(p =>(
          <animated.div style={lok}>
          <ListItem button name={p} onClick={() => props.content(p)}>
            <ListItemText primary={p} />
          </ListItem>
        </animated.div>
        ))
        case 'settings':
          let om = ['Change Password'];
          return om.map(p =>(
            <animated.div style={lok}>
            <ListItem button name={p} onClick={() => props.content(p)}>
              <ListItemText primary={p} />
            </ListItem>
          </animated.div>
          ))
    }
  }
  return (
    <div className='flex flex-col'>
      <List component='nav' aria-label='Menus'>
        {menus(props.route)}
      </List>
    </div>
  )
}

function NavsL (props) {
  const [page, setPage] = React.useState('home')
  let location = useLocation()
  const data = {
    home: 'Published',
    users: props.PROFILE.userType>0 ?'Accounts': 'Profile',
    settings: 'Change Password'
  }

  const changeActive = h => {
    setPage(h)
    props.change({
      page: h,
      content: data[h]
    })
  }

  return (
    <React.Fragment>
      <MenuIcon
        page='home'
        onClick={() => changeActive('home')}
        active={page == 'home' ? true : false}
        route={props.route}
        menu={<FiHome color='white' size='2rem' />}
      />
      <MenuIcon
        page='user'
        onClick={() => changeActive('users')}
        active={page == 'users' ? true : false}
        route={props.route}
        menu={<FiUser color='white' size='2rem' />}
      />
      <MenuIcon
        page='settings'
        onClick={() => changeActive('settings')}
        active={page == 'settings' ? true : false}
        route={props.route}
        menu={<FiSettings color='white' size='2rem' />}
      />
      <MenuIcon
        route={props.route}
        onClick={props.logout}
        active={page == 'logout' ? true : false}
        menu={<FiLogOut color='white' size='2rem' />}
      />
    </React.Fragment>
  )
}

function MenuIcon (props) {
  const lok = useSpring({
    opacity: 1,
    from: { opacity: 0 }
  })

  const where = p => {
    switch (p) {
      case 'home':
        return '/home'
      case 'user':
        return '/home/users'
      case 'settings':
        return '/home/settings'
      case 'logout':
        return '/home/logout'
    }
  }

  return (
    <div
      className={`w-full my-5 flex justify-center cursor-pointer ${
        props.active ? 'active' : ''
      }`}
    >
      <animated.div style={lok} onClick={props.onClick}>
        <Link to={where(props.page)}>{props.menu}</Link>
      </animated.div>
    </div>
  )
}

function Navbar (props) {
  const lok = useSpring({ opacity: 1, from: { opacity: 0 } })
  return (
    <div className='flex flex-row navBar p-4'>
      <div className='flex flex-col '>
        <animated.div style={lok}>
          <h3 className='text-xl font-bold text-white'>{props.name}</h3>
          {/* <hr className=' border-blue-900' /> */}
        </animated.div>
      </div>
    </div>
  )
}

const mapStateToProps = state => (state)

const mapDispatchToProps = {
  LogoutUser
}

const Navs = connect(mapStateToProps, mapDispatchToProps)(withRouter(NavsL))
const Vnav  = connect(mapStateToProps, mapDispatchToProps)(withRouter(VnavL))
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home))
