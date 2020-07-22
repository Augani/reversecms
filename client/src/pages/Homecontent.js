import React, {PureComponent, useCallback} from 'react'
import {connect} from 'react-redux'
import * as JqueryP from 'jquery.dropzone';
import {
  Pane,
  Dialog,
  FilePicker,
  toaster,
  Spinner,
  CornerDialog,
  Tab,
  Tablist,
  TablistProps,
  Paragraph
} from 'evergreen-ui';
import * as UpChunk from '@mux/upchunk';
import HugeUploader from 'huge-uploader';
import DropImage from '../components/drop';
import {parse} from 'node-html-parser';
import User from './userData'
import {useTransition, animated, useSpring} from 'react-spring'
import {FiUpload, FiDelete, FiEdit, FiEye, FiSkipBack} from 'react-icons/fi'
import {AiOutlineClose, AiOutlineFolderAdd, AiOutlineCloudUpload} from 'react-icons/ai'
import Component from '@reactions/component'
import {withRouter, Link, Redirect} from 'react-router-dom'
import Table from '../components/table';
import $ from 'jquery';
import { Avatar, Button } from '@material-ui/core'
import axios from 'axios';
import {
  LOGIN_SCRIPT,
  REGISTER_NEW_USER_WITH_SITE,
  GET_USERS,
  GET_SITES_USER,
  ADD_SITE,
  GET_EDITABLE,
  DELETE_SITE,
  UPDATE_PAGE,
  PUBLISH_SITE
} from '../utils/queries';
import {useDropzone} from 'react-dropzone'
import Cms from '../anim/17343-programming.json'
import {useQuery, useMutation} from '@apollo/react-hooks'
import {set} from 'mongoose'

const Columns = [
  {
    title: 'Username',
    field: 'username'
  }, {
    title: 'Email',
    field: 'email'
  }, {
    title: 'No of Sites',
    field: 'sites'
  }, {
    title: 'User Type',
    field: 'userType'
  }
];

const tableData = [
  {
    id: 'bygyg76g',
    type: 'Token payment',
    description: 'yvgyugvjhviy',
    amount: 103,
    'date': 'Apr 13th, 2020 16:56'
  }, {
    id: 'hjbjkbkj',
    type: 'Token payment',
    description: 'yvgyugvjhviy',
    amount: 103,
    'date': 'Apr 13th, 2020 16:56'
  }
];

const calc = (x, y) => [ -(y - window.innerHeight / 3) / 30,
  (x - window.innerWidth / 3) / 30,
  1.1
]
const trans = (x, y, s) => `perspective(50px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

class Homecontent extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      page: this.props.page
    }
  }

  renderPage = v => {

    switch (v) {
      case 'Published':
        return <Published/>;
      case 'Drafts':
        return <Drafts/>;
      case 'Accounts':
        return <Users/>;
      case 'Add user':
        return <AddUsers/>;
      case 'Change Password':
        return <ChangePassword/>;
      case 'Profile':
        return <ProfileView/>;
    }
  }

  render() {
    return (
      <div className='h-full w-full flex flex-col'>
        <Pane className='w-full h-16 shadow-sm p-3 flex flex-row justify-between'>
          <h5 className='text-xl font-bold text-red-700'>{this.props.page}</h5>
          <User/>
        </Pane>
        {this.renderPage(this.props.page)}
      </div>
    )
  }
}

function ProfileViewL(props) {
  const [values,
    setValues] = React.useState({signClicked: false, username: props.PROFILE.username, password: '', email: props.PROFILE.email, confirmPassword: ''})
  const onChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
     <User hide={true} size="large"/>
      <form className='bg-white w-1/4  rounded  pb-8 mb-4'>
       
        <div className='mb-4 mt-6'>
          <label className='block text-red-700 text-sm font-bold mb-2' for='username'>
            Username
          </label>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
            id='username'
            value={values.username}
            onChange={onChange}
            disabled
            name="username"
            type='text'
            placeholder='Username'/>
        </div>
        <div className='mb-4'>
          <label className='block text-red-700 text-sm font-bold mb-2' for='username'>
            Email
          </label>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
            id='email'
            value={values.email}
            onChange={onChange}
            name="email"
            disabled
            type='email'
            placeholder='Email'/>
        </div>
      
      </form>

    </div>
  )
}

function Drafts() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h5>No drafts found</h5>
    </div>
  )
}

function TileR(prop) {
  const [addSite, {
      loading,
      error
    }
  ] = useMutation(ADD_SITE);
  const [PublishSite, {
    lo,
    er
  }
] = useMutation(PUBLISH_SITE);
  const [deleteSite, {
      load,
      err
    }
  ] = useMutation(DELETE_SITE);

  const [props,
    set] = useSpring(() => ({
    xys: [
      0, 0, 1
    ],
    config: {
      mass: 5,
      tension: 100,
      friction: 40
    }
  }))
  const [editor, setEditor] = React.useState('')
  const [ftpUsername,
    setFtpUsername] = React.useState("")
  const [ftpPassword,
    setFtpPassword] = React.useState("")

  const [file,
    setFile] = React.useState(null);
  const [edit,
    setEdit] = React.useState(false)
  const [site,
    setSite] = React.useState("");
  const [ftp,
    setFtp] = React.useState("");
  const [url,
    setUrl] = React.useState("");
  const [pagename,
    setPageName] = React.useState("");
  const [page,
    setPage] = React.useState(false)
  const [siteLink,
    setSiteLink] = React.useState("");
  const [update,
    setUpdate] = React.useState(false);

  const [pageSelected,
    setPageSelected] = React.useState('')

  const viewSite = (d,c) => {
    let web = "/local/" + c.email + "/" + d + "/";
    setEditor(c.email)
    setPageSelected(d);
    setPage(true);
    setSiteLink(web);
   
  }
  const viewEdit = async(d,c) => {
    let web = "/local/" + c.email + "/" + d + "/";
    setPageSelected(d);
    setSiteLink(web)
    setEditor(c.email)
    setEdit(true);

  }

  React.useEffect(() => {
    prop.update()
  }, [update])

  const removeSite = (id) => {
    deleteSite({variables: {
        id
      }}).then(() => {
      toaster.success('Site deleted successfully');
      prop.update()
    })
  }

  const uploadFile = (f) => {
    addSite({
      variables: {
        ftpUrl: ftp,
        siteUrl: url,
        ftpUser: ftpUsername,
        ftpPass: ftpPassword,
        pagename,
        username: prop.PROFILE.email
      }
    }).then((response) => {
      if (!response.data.addSite) 
        return toaster.warning('Site wasn\'t added');
      setUpdate(true)
      return toaster.success("Site added successfully");

    })
  }

  const Push = ()=>{
    PublishSite({
      variables:{
        username: editor,
        site: pageSelected
      }
    }).then((resp)=>{
      console.log(resp)

    }).catch((e)=>{

    })

  }

  const Close = () => {
    setPage(null)
  }

  const siteUpload = (files, user, site)=>{
    toaster.notify('Please wait, site is being uploaded')
    var formData = new FormData();
    var imagefile = files[0];
    
    const uploader = new HugeUploader({ endpoint: '/upload', file: imagefile, postParams:{
      username:user.email,
    pagename:site
    }});

    // subscribe to events
    $('#fileLoader').trigger('click');
    uploader.on('error', (err) => {
      console.error('Something bad happened', err.detail);
    });
    
    uploader.on('progress', (progress) => {
        console.log(`The upload is at ${progress.detail}%`);
        $('#loaderProgress').text(progress.detail)
    });
    
    uploader.on('finish', () => {
        console.log('yeahhh');
        // toaster.success('Woohoo!!!\n Site uploaded successfully');
        // toaster.notify('Go ahead and edit')
    });




/** 

    formData.append("sampleFile", imagefile[0]);
    formData.append('username', user.email);
    formData.append('pagename', site);
    $('#fileLoader').trigger('click');
    axios.post('/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        maxContentLength: 100000000,
        maxBodyLength: 1000000000,
        onUploadProgress: (progressEvent)=>{
          if (progressEvent.lengthComputable) {
            let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            console.log(percentCompleted)
            $('#loaderProgress').text(percentCompleted)
            
         }
        }
    }).then((resp)=>{
      toaster.success('Woohoo!!!\n Site uploaded successfully');
      toaster.notify('Go ahead and edit')
    }).catch(er=>console.log(er))
    */
  }

  if (edit && siteLink) {
    return <EditReady
      log={editor}
      stationary={siteLink}
      siteLink={siteLink}
      site={pageSelected}
      Close={() => setEdit(false)}/>
  }

  if (page && siteLink) {
    return (
      <div className="w-full h-full flex flex-col items-end">
     <div className="w-full flex flex-row-reverse">
     <button
          onClick={Push}
          className='bg-green-500 mx-4  mb-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='button'>
          Publish Site
        </button>
        <button
          onClick={Close}
          className='bg-red-500  mb-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='button'>
          Close
        </button>
     </div>

        <iframe className="w-full h-full" src={siteLink}></iframe>
      </div>
    )
  }

  return (
    <div className="h-full w-full ">
    <Component initialState={{ isShown: false, progress: 0 }}>
  {({ state, setState }) => (
    <React.Fragment>
      <CornerDialog
        title="File uploading"
        isShown={state.isShown}
        hasFooter={false}
        onCloseComplete={() => setState({ isShown: false })}
      >
       <div className="flex flex-row">
       <p className="text-2xl text-blue-600" id="loaderProgress"></p><p className="text-2xl text-blue-600">%</p>
       </div>
      </CornerDialog>
      <Button className="hidden" id="fileLoader" onClick={() => setState({ isShown: true })}>
       
      </Button>
    </React.Fragment>
  )}
</Component>
      <div className="w-full flex flex-row-reverse">
        <animated.div
          onMouseMove={({clientX: x, clientY: y}) => set({
          xys: calc(x, y)
        })}
          onMouseLeave={() => set({
          xys: [0, 0, 1]
        })}>

          {prop.PROFILE.userType > 0
            ? (
              <Component
                initialState={{
                isShown: false,
                isLoading: false
              }}
                didUpdate={({state, setState}) => {}}>
                {({state, setState}) => (
                  <Pane>
                    <Dialog
                      isShown={state.isShown}
                      title='Import site'
                      width={400}
                      onCloseComplete={() => setState({isShown: false, isLoading: false})}
                      isConfirmLoading={state.isLoading}
                      onConfirm={() => {
                      setState({isLoading: true});
                      uploadFile();
                      setState({isShown: false});
                    }}
                      confirmLabel={state.isLoading
                      ? 'Importing...'
                      : 'Import'}>
                      <div className='w-full h-full flex flex-col justify-center'>
                        <div className='mb-4'>
                          <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
                            Site name / Alias
                          </label>
                          <input
                            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
                            id='siteName'
                            type='text'
                            value={pagename}
                            onChange={val => setPageName(val.target.value)}
                            name="site"
                            placeholder='eg. HomeChow'/>

                        </div>
                        <div className='mb-4'>
                          <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
                            Site Url
                          </label>
                          <input
                            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
                            id='siteUrl'
                            type='text'
                            value={url}
                            onChange={val => setUrl(val.target.value)}
                            name="url"
                            placeholder='eg. http://'/>

                        </div>
                        <div className='mb-4'>
                          <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
                            FTP Url
                          </label>
                          <input
                            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
                            id='ftpUrl'
                            type='text'
                            value={ftp}
                            onChange={val => setFtp(val.target.value)}
                            name="ftp"
                            placeholder='eg. ftp://'/>

                        </div>
                        <div className='mb-4'>
                          <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
                            FTP Username
                          </label>
                          <input
                            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
                            id='ftpUrl'
                            type='text'
                            value={ftpUsername}
                            onChange={val => setFtpUsername(val.target.value)}
                            name="ftp"
                            placeholder='eg. ftp://'/>

                        </div>
                        <div className='mb-4'>
                          <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
                            FTP Password
                          </label>
                          <input
                            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
                            id='ftpUrl'
                            type='text'
                            value={ftpPassword}
                            onChange={val => setFtpPassword(val.target.value)}
                            name="ftp"
                            placeholder='eg. ftp://'/>

                        </div>

                      </div>
                    </Dialog>
                    <AiOutlineFolderAdd
                      className="addIcon cursor-pointer"
                      onClick={() => setState({isShown: true})}/>

                  </Pane>
                )}
              </Component>
            )
            : null}

        </animated.div>
      </div>
      <div className="w-full h-full grid grid-flow-col grid-cols-5">
        {prop
          .data
          .map((t, key) => (
            <Pane key={t._id} className="mainCard">
              <Pane className="siteBack ">
                <Pane className="flex flex-row justify-around w-full my-4">
                  <FiEye onClick={() => viewSite(t.pagename, t.owner)}/>
                  <FiEdit onClick={() => viewEdit(t.pagename, t.owner)}/> {prop.PROFILE.userType > 0
                    ? (
                      <React.Fragment>
                      <Component
                initialState={{
                isShown: false,
                isLoading: false
              }}
                didUpdate={({state, setState}) => {}}>
                {({state, setState}) => (
                  <Pane>
                    <Dialog
                      isShown={state.isShown}
                      title='Site Uploader'
                      width={400}
                      onCloseComplete={()=>setState({isShown: false, isLoading: false})}
                      hasFooter={false}
                    >
                       <MyDropzone type="siteUpload" site={t.pagename} user={t.owner} upload={siteUpload} close={()=>setState({isShown: false, isLoading: false})}/>
                       {/* <DropImage/> */}
                    </Dialog>
                 
                   <AiOutlineCloudUpload onClick={() =>{
                     
                      setState({isShown: true})}}/>
                  </Pane>
                )}
              </Component>
              <Component
                        initialState={{
                        isShown: false
                      }}>
                        {({state, setState}) => (
                          <React.Fragment>
                            <CornerDialog
                              title={`Are you sure you want to delete ${t.pagename}`}
                              isShown={state.isShown}
                              onConfirm={() => {
                              removeSite(t._id);
                              setState({isShown: false})
                            }}
                              confirmLabel="Delete Site"
                              hasClose={false}
                              onCancel={() => setState({isShown: false})}></CornerDialog>
                            <FiDelete onClick={() => setState({isShown: true})}/>

                          </React.Fragment>
                        )}
                      </Component>
      
                      </React.Fragment>
                    

                    )
                    : null}
                </Pane>
                <Pane elevation={3} className='siteCard cursor-pointer'>
                  <div
                    className="h-full w-full flex flex-col justify-center cardOverLay items-center">

                    <h6 className='text-red-700 text-3xl font-semibold'>{t.pagename}</h6>
                  </div>
                </Pane>

              </Pane>

            </Pane>

          ))}
      </div>
    </div>
  )

}

function EditInput(props) {
  const [val,
    setVal] = React.useState(props.data.value)
  const valChanged = (v) => {
    setVal(v)

    $('#editableIframe')
      .contents()
      .find(`.${props.data.class}`)
      .text(val)
  }
  if (props.data.value.length > 30) {
    return (
      <div className='mb-4'>
        <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
          {props.data.class}
        </label>
        <textarea
          style={{
          height: '200px'
        }}
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-4/5 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
          type='text'
          value={val}
          onChange={val => valChanged(val.target.value)}
          name="url"
          placeholder='eg. http://'/>

      </div>
    )
  }
  return (
    <div className='mb-4'>
      <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
        {props.data.class}
      </label>
      <input
        className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-4/5 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
        type='text'
        value={val}
        onChange={val => valChanged(val.target.value)}
        name="url"
        placeholder='eg. http://'/>

    </div>
  )
}

function MyDropzone(props) {
  const [added, setAdded] = React.useState(false)
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    
    if(props.type == "ImageChange"){
      props.droppedImage(acceptedFiles);
      props.close();

      return;
    }
    setAdded(true);
    props.upload(acceptedFiles, props.user, props.site);
    props.close();
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  if(props.type == "siteUpload"){
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          added ?(
            <div className="w-full flex justify-center flex-col fH items-center">
            <AiOutlineCloudUpload/>
            <p className="text-center ">Nice!! Now click the upload site button</p>
            </div>
          ):
          isDragActive ?
          <div className="w-full flex justify-center flex-col fH items-center">
            <AiOutlineCloudUpload/>
            <p className="text-center ">Drop it here</p>
            </div> :
            <div className="w-full justify-center flex flex-col fH items-center">
            <AiOutlineCloudUpload/>
            <p className="text-center ">Drag and drop the zipped site here to upload</p>
            </div>
        
        }
      </div>
    )
  }
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <div className="w-full h-full flex flex-col items-center">
          <p className="text-center ">Drag and drop images here or click to upload an image.</p>
          </div>
      }
    </div>
  )
}

function EditReadyT(props) {
  const {data, loading, error} = useQuery(GET_EDITABLE, {
    variables: {
      pagename: props.site,
      email:props.log
    }
  });
  const [imageEdit, setImageEdit] = React.useState(null)
  const [updatePage] = useMutation(UPDATE_PAGE)
  const [stat,
    setStat] = React.useState(props.siteLink)
  const [site,
    setSite] = React.useState(props.siteLink);
  const [currentPage,
    setCurrentPage] = React.useState('index.html')
  const setupSite = (v) => {
    setCurrentPage(v);
    var d = stat + v;
    setSite(d);
  }
  const [showImagePicker, setShowImagePicker] = React.useState(false);
  var iframeRef = React.createRef();

  const ImageClick = ()=>{
  
      let frame= document.getElementById('editableIframe');
    
    if(!frame)return;
    
    let g = frame.contentWindow.document.getElementsByTagName("img");
    let p = frame.contentWindow.document.getElementsByTagName("p");
    let h = frame.contentWindow.document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    for(let par of p){
     par.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
       addContext(ev,frame.contentWindow)
       return false;
}, false);
 }
 for(let head of h){
   head.addEventListener('contextmenu', function(ev) {
      ev.preventDefault();
      addContext(ev,frame.contentWindow)
     return false;
}, false);
}
 for(let num of g){
     num.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        sessionStorage.setItem('Image', $(ev.target).attr('id'));
       $('#GetImages').trigger('click');
       return false;
}, false);
 }
    toaster.notify('Images ready for update')
   
   
  }

  const addContext =(e,b)=>{
    var i = document.getElementById("menu").style;
      var posX = e.clientX;
      var posY = e.clientY;
      menu(posX, posY);
      document.getElementById('editableIframe').contentWindow.document.addEventListener('click', function(e) {
      i.opacity = "0";
      setTimeout(function() {
        i.visibility = "hidden";
      }, 501);
    }, false);
    var el = e.target;
    let IncFont = getId('IncF');
    let DecFont = getId('DecF');
    let IncM = getId('IncM');
    let DecM = getId('DecM');
    let IncL = getId('IncL');
    let DecL = getId('DecL');
    let Und = getId('Und');
    let IncW = getId('IncW');
    let DecW = getId('DecW');
    let Color = getId('favcolor');
    Color.value = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('color');


    IncFont.onclick = function(){
     let style = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('font-size');
    let currentSize = parseFloat(style);
     el.style.fontSize = (currentSize + 2) + 'px';
    }
    DecFont.onclick = function(){
      let style = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('font-size');
     let currentSize = parseFloat(style);
      el.style.fontSize = (currentSize - 2) + 'px';
     }
     IncM.onclick = function(){
      let style = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('margin');
     let currentSize = parseFloat(style);
      el.style.margin = (currentSize + 2) + 'px';
     }
     DecM.onclick = function(){
      let style = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('margin');
     let currentSize = parseFloat(style);
      el.style.margin = (currentSize - 2) + 'px';
     }
     IncL.onclick = function(){
      let style = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('line-height');
     let currentSize = parseFloat(style);
      el.style.lineHeight = (currentSize + .5) + 'px';
     }
     DecL.onclick = function(){
      let style = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('line-height');
     let currentSize = parseFloat(style);
      el.style.lineHeight = (currentSize - .5) + 'px';
     }
     IncW.onclick = function(){
      let style = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('font-weight');
     let currentSize = parseFloat(style);
      el.style.fontWeight = currentSize + 100;
     }
     DecW.onclick = function(){
      let style = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('font-weight');
     let currentSize = parseFloat(style);
      el.style.fontWeight = currentSize - 100;
     }
     Und.onclick = function(){
      let style = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('text-decoration');
      el.style.textDecoration = style.includes('underline')?"none":"underline";
     }
     Color.onchange = function(){
      let style = document.getElementById('editableIframe').contentWindow.window.getComputedStyle(el, null).getPropertyValue('color');
      // let currentColor = parseFloat(style);
       el.style.color = Color.value;
     }
     

    function getId(id){
     return document.getElementById(id);
    }
    
    
    function menu(x, y) {
      i.top = y + "px";
      i.left = x + "px";
      i.visibility = "visible";
      i.opacity = "1";
    }
  }

  
  const Publish = () => {
    let node = iframeRef.current;
    var full = document
      .getElementById('editableIframe')
      .contentWindow
      .document;
    let f = new XMLSerializer().serializeToString(full);
    updatePage({
      variables: {
        pageData:f,
        pagename: props.site,
        username: props.log,
        page: currentPage
      }
    }).then((t) => {
      toaster.success('Changes saved successfully');
    }).catch((e) => {
      toaster.danger("Site couldn't be activated");
    })

  }
  React.useEffect(()=>{
   
  })

  const ImageDrop = (files)=>{
    
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        let frame= document.getElementById('editableIframe');
        let id = sessionStorage.getItem('Image');
        
        frame.contentWindow.document.getElementById(id).src = fr.result;
        frame.contentWindow.document.getElementById(id).removeAttribute('srcset');
      }
      fr.readAsDataURL(files[0]);
  }
  }

  const Undo = ()=>{
      let frame= document.getElementById('editableIframe');
    frame.contentWindow.document.execCommand('undo', false, null);
  }
  const Save = () => {}
  React.useEffect(() => {
    toaster.notify('Loading images for editing')
    setTimeout(()=>{
     
      ImageClick();
    },6000)
  }, [site])
  if (loading) 
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Spinner/>
      </div>
    )
  const filtered = data.getEditable;

  return (
    <div className="w-full h-full flex flex-col items-end">
      <div class="flex flex-row justify-end">
      <button
        onClick={Undo}
          className='bg-red-500 mr-3  mb-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='button'>
          Undo
        </button>
        {/* <button
          className='bg-red-500 mr-3  mb-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='button'>
          Save as draft
        </button> */}
        <button
          onClick={Publish}
          className='bg-green-500 mr-3  mb-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='button'>
          Save
        </button>
        <button
          onClick={props.Close}
          className='bg-red-500  mb-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='button'>
          Exit
        </button>
        <input type="file" id="generalFileLoader" className="hidden"/>

      </div>
      <div className="h-full w-full flex flex-row">
       <Component
                initialState={{
                isShown: false,
                isLoading: false
              }}
             
                didUpdate={({state, setState}) => {}}>
                {({state, setState}) => (
                  <Pane>
                    <Dialog
                      isShown={state.isShown}
                      title='Image Uploader'
                      width={500}
                      hasFooter={false}
                      onCloseComplete={() => setState({isShown: false, isLoading: false})}
                      isConfirmLoading={state.isLoading}
                      onConfirm={() => {
                      setState({isLoading: true});
                      setState({isShown: false});
                    }}
                      confirmLabel={state.isLoading
                      ? 'Changing...'
                      : 'Change Image'}>
                       <MyDropzone type="ImageChange" close={()=>setState({isShown: false})} droppedImage={ImageDrop}/>
                       {/* <DropImage/> */}
                    </Dialog>
                 
                    <button id="GetImages" onClick={() => setState({isShown: true})}>
                    </button>
                  </Pane>
                )}
              </Component>
        <div className="w-1/6 h-full flex flex-col items-center">
          <h5>Pages</h5>
          <div className="overflow-y-scroll w-full  flex flex-col px-4">
            {filtered.map((item) => (<Buttons set={setupSite} data={item}/>))}
          </div>
        </div>
        <iframe ref={iframeRef} id="editableIframe" className="w-5/6 h-full" src={site}></iframe>
        <div id="menu">
          <p id="IncF">Increase font</p> 
          <hr />
          <p id="DecF">Decrease font</p>
          <hr />
          <p id="IncM">Increase margin</p>
          <hr />
          <p id="DecM">Decrease margin</p>
          <hr />
          <p id="IncL">Increase line height</p> 
          <hr />
          <p id="DecL">Decrease line height</p> 
          <hr />
          <p id="IncW">Increase font weight</p> 
          <hr />
          <p id="DecW">Decrease font weight</p> 
          <hr />
          <p id="Und">Underline</p> 
          <hr />
         
          <p>Change color <input type="color" id="favcolor" name="favcolor" /></p>
        </div>
      </div>

    </div>

  )
}

function Buttons(prop) {
  return (
    <button
      onClick={() => prop.set(prop.data)}
      className='bg-green-500  mb-4 hover:bg-red-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline'
      type='button'>
      {prop
        .data
        .split('.')[0]}
    </button>

  )
}

function PublishedR(Props) {
  const {loading, error, data} = useQuery(GET_SITES_USER, {
    variables: {
      username: Props.PROFILE.email
    }
  });
  const [upd,
    setUpd] = React.useState(false)

  const update = () => {
    setUpd(true)
  }

  const [allSites,
    setAllSites] = React.useState([])

  React.useEffect(() => {
    if (data) 
      setAllSites(data.getSitesByUser);
    }
  , [data])
  React.useEffect(() => {
    if (data) 
      setAllSites(data.getSitesByUser);
    }
  , [upd])

  if (loading) 
    return <p>Loading ...</p>;
  return (
    <div className='h-full w-full overflow-y-scroll p-10'>
      <Tile update={update} data={allSites}/>
    </div>
  )
}

function Users() {
  const {loading, error, data} = useQuery(GET_USERS);
  const [user,
    setUser] = React.useState(null)
  const viewTransact = (m) => {
    setUser(m)
  }
  const [alldata,
    SetAlldata] = React.useState([])
  const [values,
    setValues] = React.useState({signClicked: false, username: '', password: '', email: '', confirmPassword: ''})
  const onChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const loaddata = () => {
    var d = data.getAllUsers;
    var final = d.map((r) => {
      r.userType = r.userType == 0 || r.userType == "User"
        ? "User"
        : "Admin";
      r.sites = Array.isArray(r.sites)
        ? r.sites.length
        : r.sites;
      return r
    });
    SetAlldata(final)
  }

  React.useEffect(() => {
    if (data) 
      loaddata();
    }
  , [data])
  if (loading) 
    return <p>Loading ...</p>;
  return (
    <div className=' w-full h-full md:p-10 p-2 flex flex-col items-center'>
      {user
        ? (
          <div className="md:w-2/3 w-full h-full flex-row">

            <div className="w-1/3 h-full">
              <form className='bg-white  rounded px-8 pt-6 pb-8 mb-4'>

                <div className='mb-4 mt-6'>
                  <label className='block text-red-700 text-sm font-bold mb-2' for='username'>
                    Username
                  </label>
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
                    id='username'
                    value={values.username}
                    onChange={onChange}
                    name="username"
                    type='text'
                    placeholder='Username'/>
                </div>
                <div className='mb-4'>
                  <label className='block text-red-700 text-sm font-bold mb-2' for='username'>
                    Email
                  </label>
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
                    id='email'
                    value={values.email}
                    onChange={onChange}
                    name="email"
                    type='email'
                    placeholder='Email'/>
                </div>

              </form>

            </div>
            <div className="w-2/3 h-full"></div>
          </div>
        )
        : (
          <Pane className="rounded-lg md:w-2/3 w-full h-full ">
            <Table
              className="userTable"
              table={{
              Columns,
              options: {
                view: viewTransact
              },
              Data: alldata,
              title: "User Accounts"
            }}/>

          </Pane>

        )}
    </div>
  )
}

function ChangePassword() {
  const [values,
    setValues] = React.useState({oldPassword: '', newPassword: '', confirmNewPassword: ''})
  const onChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const Change = () => {}
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <form className='bg-white w-1/3  rounded px-8 pt-6 pb-8 mb-4'>

        <div className='mb-4 mt-6'>
          <label className='block text-red-700 text-sm font-bold mb-2' for='username'>
            Old Password
          </label>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
            id='username'
            value={values.oldPassword}
            onChange={onChange}
            name="username"
            type='password'
            placeholder='******************'/>
        </div>
        <div className='mb-4'>
          <label className='block text-red-700 text-sm font-bold mb-2' for='username'>
            New Password
          </label>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
            id='email'
            value={values.newPassword}
            onChange={onChange}
            name="email"
            type='password'
            placeholder='******************'/>
        </div>
        <div className='mb-6'>
          <label className='block text-red-700 text-sm font-bold mb-2' for='password'>
            Confirm New Password
          </label>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
            id='password'
            value={values.confirmNewPassword}
            onChange={onChange}
            type='password'
            name="confirmPassword"
            placeholder='******************'/>

        </div>
        <div className='flex flex-col items-center justify-between'>
          <button
            className='bg-red-700 w-full mb-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='button'
            onClick={Change}>
            Change Password
          </button>

        </div>
      </form>
    </div>
  )
}

function Settings() {

  return (
    <div className='h-full w-full p-10'></div>
  )
}

function AddUsers(props) {
  const [registerWithSite, {
      loading,
      error
    }
  ] = useMutation(REGISTER_NEW_USER_WITH_SITE);
  const [values,
    setValues] = React.useState({signClicked: false, username: '', password: '', email: '', confirmPassword: ''})

  const [post,
    setPost] = React.useState(null)
  const Register = async(newValues) => {
    const {username, password, confirmPassword, email} = JSON.parse(sessionStorage.getItem('userData'))[0];
    if (!username || !password || !confirmPassword || !email) 
      return toaster.warning("Please fill all fields");
    if (password !== confirmPassword) 
      return toaster.danger('Passwords do not match');
    registerWithSite({
      variables: {
        username,
        password,
        email,
        ...newValues
      }
    }).then((response) => {
      toaster.success('Added user and site successfully');

      // props.LoginUser(response.data.register)
    }).catch((error) => {
      return toaster.danger('Either email or username is taken already');
    })

  }

  const [ownIndex,
    setOwnIndex] = React.useState(0)

  const goToNextPage = (vals) => {
    setPost(vals);
    sessionStorage.setItem('userData', JSON.stringify([vals]));
    setOwnIndex(1)

  }
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className='w-4/5 md:w-4/5 lg:w-2/5 lg:p-10'>
        <Component
          initialState={{
          selectedIndex: ownIndex,
          tabs: [ < UserForm submit = {
              goToNextPage
            }
            next = {
              () => setOwnIndex(1)
            } />, < WebsiteForm submit = {
              Register
            } />
          ],
          tabsTitle: ["Fill user details", "Add User's Site"]
        }}>
          {({state, setState}) => (
            <Pane height={120}>
              <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
                {state
                  .tabsTitle
                  .map((tab, index) => (
                    <Tab
                      key={index}
                      id={index}
                      onSelect={() => setOwnIndex(index)}
                      isSelected={index === ownIndex}
                      aria-controls={`panel-${index}`}>
                      {state.tabsTitle[index]}
                    </Tab>
                  ))}
              </Tablist>
              <Pane padding={16} background="tint1" flex="1">
                {state
                  .tabs
                  .map((tab, index) => (
                    <Pane
                      key={index}
                      id={`panel-${index}`}
                      role="tabpanel"
                      aria-labelledby={tab}
                      aria-hidden={index !== ownIndex}
                      display={index === ownIndex
                      ? 'block'
                      : 'none'}>
                      {state.tabs[ownIndex]}
                    </Pane>
                  ))}
              </Pane>
            </Pane>
          )}
        </Component>
      </div>

    </div>
  )
}

function UserForm(props) {
  const [values,
    setValues] = React.useState({signClicked: false, username: '', password: '', email: '', confirmPassword: ''})
  const onChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form className='bg-white  rounded px-8 pt-6 pb-8 mb-4'>

      <div className='mb-4 mt-6'>
        <label className='block text-red-700 text-sm font-bold mb-2' for='username'>
          Username
        </label>
        <input
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
          id='username'
          value={values.username}
          onChange={onChange}
          name="username"
          type='text'
          placeholder='Username'/>
      </div>
      <div className='mb-4'>
        <label className='block text-red-700 text-sm font-bold mb-2' for='username'>
          Email
        </label>
        <input
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
          id='email'
          value={values.email}
          onChange={onChange}
          name="email"
          type='email'
          placeholder='Email'/>
      </div>
      <div className='mb-4'>
        <label className='block text-red-700 text-sm font-bold mb-2' for='password'>
          Password
        </label>
        <input
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
          id='password'
          type='password'
          value={values.password}
          onChange={onChange}
          name="password"
          placeholder='******************'/>

      </div>
      <div className='mb-6'>
        <label className='block text-red-700 text-sm font-bold mb-2' for='password'>
          Confirm Password
        </label>
        <input
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
          id='password'
          value={values.confirmPassword}
          onChange={onChange}
          type='password'
          name="confirmPassword"
          placeholder='******************'/>

      </div>
      <div className='flex flex-col items-center justify-between'>
        <button
          className='bg-red-700 w-full mb-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='button'
          onClick={() => {
          props.next();
          props.submit(values)
        }}>
          Next
        </button>

      </div>
    </form>

  )
}

function WebsiteForm(props) {
  const [ftpUsername,
    setFtpUsername] = React.useState("")
  const [ftpPassword,
    setFtpPassword] = React.useState("")

  const [ftp,
    setFtp] = React.useState("");
  const [url,
    setUrl] = React.useState("");
  const [pagename,
    setPageName] = React.useState("");

  const Send = () => {
    let values = {
      url,
      pagename,
      ftp,
      ftpUsername,
      ftpPassword
    }
    props.submit(values)
  }
  return (
    <form className='bg-white  rounded px-8 pt-6 pb-8 mb-4'>
      <div className='mb-4'>
        <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
          Site name / Alias
        </label>
        <input
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
          id='siteName'
          type='text'
          value={pagename}
          onChange={val => setPageName(val.target.value)}
          name="site"/>

      </div>
      <div className='mb-4'>
        <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
          Site Url
        </label>
        <input
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
          id='siteUrl'
          type='text'
          value={url}
          onChange={val => setUrl(val.target.value)}
          name="url"/>

      </div>
      <div className='mb-4'>
        <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
          FTP Url
        </label>
        <input
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
          id='ftpUrl'
          type='text'
          value={ftp}
          onChange={val => setFtp(val.target.value)}
          name="ftp"/>

      </div>
      <div className='mb-4'>
        <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
          FTP Username
        </label>
        <input
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
          id='ftpUrl'
          type='text'
          value={ftpUsername}
          onChange={val => setFtpUsername(val.target.value)}
          name="ftp"/>

      </div>
      <div className='mb-4'>
        <label className='block text-red-700 text-sm font-bold mb-2' for='siteName'>
          FTP Password
        </label>
        <input
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700'
          id='ftpUrl'
          type='text'
          value={ftpPassword}
          onChange={val => setFtpPassword(val.target.value)}
          name="ftp"/>

      </div>
      <div className='flex flex-col items-center justify-between'>
        <button
          className='bg-red-700 w-full mb-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='button'
          onClick={() => Send()}>
          Add User
        </button>

      </div>
    </form>

  )

}

const mapStateToProps = state => (state)

const mapDispatchToProps = dispatch => ({})
const Tile = connect(mapStateToProps, mapDispatchToProps)(withRouter(TileR))
const Published = connect(mapStateToProps, mapDispatchToProps)(withRouter(PublishedR))
const EditReady = connect(mapStateToProps, mapDispatchToProps)(withRouter(EditReadyT))
const ProfileView = connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfileViewL))

export default connect(mapStateToProps, mapDispatchToProps)(Homecontent)
