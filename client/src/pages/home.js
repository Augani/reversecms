import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import './home.css'
import {useSpring, animated} from 'react-spring'
class Home extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
       
        return (
            <div className="w-screen h-screen flex flex-col md:flex-row ">
                <div className="sid h-full  bg-blue-900 hidden md:block">

                </div>
                <div className="roP w-full flex flex-col">
                <Navbar name="Home"/>

                </div>
            </div>
        )
    }
}

function Navbar(props){
    const lok = useSpring({opacity: 1, from: {opacity: 0}})
    return(
        <div className="flex flex-row navBar p-4">
        <div className="flex flex-col ">
        <animated.div style={lok}>
        <h3 className="text-2xl font-bold">{props.name}</h3>
        <hr/>
        </animated.div>
        
        </div>
    </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
