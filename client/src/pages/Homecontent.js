import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Pane, Dialog, FilePicker, toaster } from 'evergreen-ui'
import User from './userData'
import { useTransition, animated, useSpring } from 'react-spring'
import { FiUpload, FiDelete, FiEdit, FiEye } from 'react-icons/fi'
import Component from '@reactions/component'
import axios from 'axios';
import {UPLOAD_FILE} from '../utils/queries'
import { useQuery, useMutation } from '@apollo/react-hooks'

class Homecontent extends PureComponent {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      page: this.props.page
    }
  }

  renderPage = v => {
    console.log(v)
    switch (v) {
      case 'Published':
        return <Published />
      case 'Drafts':
        return <Drafts />
    }
  }

  render () {
    return (
      <div className='h-full w-full flex flex-col'>
        <Pane className='w-full h-16 shadow-sm p-3 flex flex-row justify-between'>
          <h5 className='text-xl font-bold text-blue-900'>{this.props.page}</h5>
          <User />
        </Pane>
        {this.renderPage(this.props.page)}
      </div>
    )
  }
}

function Drafts () {
  return <div>drafts</div>
}


const calc = (x, y) => [-(y - window.innerHeight / 3) / 30, (x - window.innerWidth / 3) / 30, 1.1]
const trans = (x, y, s) => `perspective(50px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

function TileR (prop) {
  const [fileUpload] = useMutation(UPLOAD_FILE);
  const [props, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 100, friction: 40 } }))
  
  const [file, setFile] = React.useState(null);
  const [site, setSite] = React.useState("")

  const uploadFile = (f)=>{

    const data = new FormData() 
    data.append('sampleFile', f);
    axios.post("/uploadFile", data, { 

  })
  .then(res => { 
  
    fileUpload({
      variables: { filename: res.data.filename, pagename: site, owner:{
        username: prop.PROFILE.username,
        id: prop.PROFILE._id
      } }
    }).then((response)=>{
      if(response.data.fileUpload.pagename){
        return toaster.success(`${response.data.fileUpload.pagename} uploaded successfully`)
      }
    }).catch((err)=>{
      return toaster.warning('Error occurred while uploading site ')
    })
   
  }).catch((e)=> {
    console.log(e)
    toaster.danger('Error while uploading file')
  })
  }
  
  return prop.data.map((t, key)=>(
    <animated.div
    onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
    onMouseLeave={() => set({ xys: [0, 0, 1] })}
    
  >
  
<Component
initialState={{ isShown: false, isLoading: false }}
didUpdate={({ state, setState }) => {
 
}}
>
{({ state, setState }) => (
  <Pane>
    <Dialog
      isShown={state.isShown}
      title='Upload site'
      width={300}
      onCloseComplete={() =>
        setState({ isShown: false, isLoading: false })
      }
      isConfirmLoading={state.isLoading}
      onConfirm={() => {setState({ isLoading: true }); uploadFile(file); setState({
        isShown: false
      }); }}
      confirmLabel={state.isLoading ? 'Uploading...' : 'Upload'}
    >
      <div className='w-full h-full flex flex-col justify-center'>
      <div className='mb-4'>
            <label
              className='block text-blue-900 text-sm font-bold mb-2'
              for='siteName'
            >
              Site name / Alias
            </label>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
              id='siteName'
              type='text'
              value={site}
              onChange={val=>setSite(val.target.value)}
              name="site"
              placeholder='eg. HomeChow'
            />
           
          </div>
        <FilePicker
          multiple
          width={250}
          marginBottom={32}
          onChange={files => setFile(files[0])}
          placeholder='Select the file here!'
        />
      </div>
    </Dialog>
   <Pane className="mainCard">
   <Pane className="siteBack ">
   <Pane className="flex flex-row justify-around w-full my-4">
   <FiEye />
   <FiEdit/>
      <FiDelete/>
   </Pane>
    <Pane
   
      onClick={() => setState({ isShown: true })}
      elevation={3}
      className='siteCard cursor-pointer'
    >
      <div className="h-full w-full flex flex-col justify-center cardOverLay items-center">
      <FiUpload className='mb-4' />

      <h6 className='text-blue-900 font-semibold'>{t.title}</h6>
      </div>
    </Pane>

    </Pane>

   </Pane>
  </Pane>
)}
</Component>


  </animated.div>
  ))
  
}

function Published () {
  const data = [{ title: 'New Site' }, { title: 'Old site' }]

  return (
    <div className='h-full w-full grid grid-flow-col grid-cols-5 p-10'>
      <Tile data={data} />
    </div>
  )
}


const mapStateToProps = state => (state)

const mapDispatchToProps = dispatch => ({})
const Tile = connect(mapStateToProps, mapDispatchToProps)(TileR)


export default connect(mapStateToProps, mapDispatchToProps)(Homecontent)


