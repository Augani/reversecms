import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Avatar } from '@material-ui/core'
import Image from '../images/apple-computer-decor-design-326502.jpg'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    
  }
}))

function UserData (props) {
  const classes = useStyles()
  return (
    <div className='flex flex-row-reverse h-full items-center'>
      
        <Avatar alt='Remy Sharp' src={Image} className="mx-4" />
      
       <h4 className=" font-black text-blue-900 text-xl">{props.PROFILE.username}</h4>
       
      
    </div>
  )
}

const mapStateToProps = state => (state)

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserData)
