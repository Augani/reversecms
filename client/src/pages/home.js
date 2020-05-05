import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { Pane } from 'evergreen-ui'
import './home.css'
import {withRouter, Link} from 'react-router-dom'
import {useSpring, animated} from 'react-spring'
import { FiHome, FiSettings, FiUser, FiLogOut } from "react-icons/fi";
class Home extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            route: this.props.location.pathname
        }
    }

    render() {
        
        return (
            <div className="w-screen h-screen flex flex-col md:flex-row ">
                <Pane elevation={3} className="sid h-full  bg-blue-900 hidden md:flex flex-col pt-20">
                    <Navs route={this.state.route}/>
                    </Pane>
                <div className="roP h-full flex flex-col">
                <Navbar name="Home"/>

                </div>
                <div className="mainPage w-full">

                </div>
            </div>
        )
    }
}

function Navs(props){
    return(
        <div>
                    <MenuIcon page="home" route={props.route} menu={<FiHome color="white" size="2rem"/>}/>
                   <MenuIcon page="user" route={props.route} menu={<FiUser color="white" size="2rem"/>}/>
                   <MenuIcon page="settings" route={props.route} menu={<FiSettings color="white" size="2rem"/>}/>
                   <MenuIcon route={props.route} menu={<FiLogOut color="white" size="2rem"/>}/>
              
        </div>
    )
}

function MenuIcon(props){
    const page = props.route;
    const lok = useSpring({
        opacity: 1,
        from: { opacity: 0 },
      })
    const pg = (v)=>{
        if(v.startsWith('/home/settings') && props.page == "settings")return 'active';
        if(v.startsWith('/home/users') && props.page == "user")return 'active';
        if(v.startsWith('/home') && props.page == "home")return 'active';

        return '';
    }

    const where = (p)=>{
        switch(p){
            case 'home':
                return '/home';
            case 'user':
                return '/home/users'; 
            case 'user':
                return '/home/settings';
            case 'user':
                return '/home/logout';     
        }
    }

    return(
        <div className={`w-full my-5 flex justify-center cursor-pointer ${pg(page)}`}>
         <animated.div style={lok}>
        <Link to={where(props.page)}>
        {props.menu}
        </Link>
         </animated.div>
          
        </div>
    )
    
}

function Navbar(props){
    const lok = useSpring({opacity: 1, from: {opacity: 0}})
    return(
        <div className="flex flex-row navBar p-4">
        <div className="flex flex-col ">
        <animated.div style={lok}>
        <h3 className="text-2xl font-bold text-blue-900">{props.name}</h3>
        <hr className="border-blue-900"/>
        </animated.div>
        
        </div>
    </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home))
