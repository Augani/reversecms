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

    this.setState({
      route: [page]
    })
   
  }

  content = g => {
    this.setState({
      content: g
    })
  }

  renderContent = v => {
    console.log(v)
    switch (v) {
      case 'Published':
        return <HomeContent page='Published' />
      case 'Drafts':
        return <HomeContent page='Drafts' />
    }
  }

  render () {
    if(!this.props.PROFILE._id){
      return <Redirect to="/"/>
    }
    return (
      <div className='w-screen h-screen flex flex-col md:flex-row '>
        <Pane
          elevation={4}
          className='sid h-full  bg-blue-900 hidden md:flex flex-col pt-20'
        >
          <Navs route={this.state.route} logout={this.props.LogoutUser} change={this.change} />
        </Pane>
        <div className='roP h-full flex flex-col'>
          <Navbar name='Reverse CMS' />
          <Vnav route={this.state.route} content={this.content} />
        </div>
        <div className='mainPage w-full'>
          {this.renderContent(this.state.content)}
        </div>
      </div>
    )
  }
}

function Vnav (props) {
  const lok = useSpring({
    opacity: 1,
    from: { opacity: 0 }
  })
  const menus = menu => {
    switch (menu) {
      case 'home':
        const mn = ['Published', 'Drafts']
        return mn.map(p => (
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

function Navs (props) {
  const [page, setPage] = React.useState('home')
  let location = useLocation()
  const data = {
    home: 'Published',
    users: 'Accounts'
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home))
