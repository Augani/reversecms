import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Pane, Dialog, FilePicker, toaster} from 'evergreen-ui'
import User from './userData'
import {useTransition, animated, useSpring} from 'react-spring'
import {FiUpload, FiDelete, FiEdit, FiEye, FiSkipBack} from 'react-icons/fi'
import {AiOutlineClose, AiOutlineFolderAdd} from 'react-icons/ai'
import Component from '@reactions/component'
import {withRouter, Link, Redirect} from 'react-router-dom'
import Table from '../components/table'
import axios from 'axios';
import {UPLOAD_FILE} from '../utils/queries'
import {LOGIN_SCRIPT, REGISTER_NEW_USER, GET_USERS, GET_SITES_USER, ADD_SITE} from '../utils/queries'
import Cms from '../anim/17343-programming.json'
import {useQuery, useMutation} from '@apollo/react-hooks'

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

class Homecontent extends PureComponent {
  constructor(props) {
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
        return <Published/>;
      case 'Drafts':
        return <Drafts/>;
      case 'Accounts':
        return <Users/>;
      case 'Add user':
        return <AddUsers/>;
      case 'Settings':
        return <Settings/>
    }
  }

  render() {
    return (
      <div className='h-full w-full flex flex-col'>
        <Pane className='w-full h-16 shadow-sm p-3 flex flex-row justify-between'>
          <h5 className='text-xl font-bold text-blue-900'>{this.props.page}</h5>
          <User/>
        </Pane>
        {this.renderPage(this.props.page)}
      </div>
    )
  }
}

function Drafts() {
  return <div>drafts</div>
}

const calc = (x, y) => [ -(y - window.innerHeight / 3) / 30,
  (x - window.innerWidth / 3) / 30,
  1.1
]
const trans = (x, y, s) => `perspective(50px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

function TileR(prop) {
  const [addSite, {
      loading,
      error
    }
  ] = useMutation(ADD_SITE);
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
    const [update, setUpdate] = React.useState(false);

  const viewSite = (d) => {

    setPage(true);
    setSiteLink(d)

  }
  const viewEdit = (d) => {

    setEdit(true);
    setSiteLink(d)

  }

  React.useEffect(()=>{
      
  }, [update])

  const uploadFile = (f) => {
    addSite({
      variables:{
        ftpUrl: ftp,
        siteUrl: url,
        pagename,
        username: prop.PROFILE.email
      }
    }).then((response)=>{
        if(!response.data.addSite)return toaster.warning('Site wasn\'t added');
        return toaster.success("Site added successfully");
        setUpdate(true)
    })
  }

  if (edit && siteLink) {
    return (
      <div className="w-full h-full flex flex-col items-end">
        <AiOutlineClose className="closeWeb"/>
        <div className="h-full w-full flex flex-row">
          <div className="w-1/3 h-full flex flex-col items-center">
            <h5>Edit Content</h5>
          </div>
          <iframe className="w-2/3 h-full" src={siteLink}></iframe>
        </div>

      </div>
    )
  }

  if (page && siteLink) {
    return (
      <div className="w-full h-full flex flex-col items-end">
        <AiOutlineClose className="closeWeb"/>
        <iframe className="w-full h-full" src={siteLink}></iframe>
      </div>
    )
  }

  return (
    <div className="h-full w-full ">
      <div className="w-full flex flex-row-reverse">
        <animated.div
          onMouseMove={({clientX: x, clientY: y}) => set({
          xys: calc(x, y)
        })}
          onMouseLeave={() => set({
          xys: [0, 0, 1]
        })}>

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
                  title='Upload site'
                  width={400}
                  onCloseComplete={() => setState({isShown: false, isLoading: false})}
                  isConfirmLoading={state.isLoading}
                  onConfirm={() => {
                  setState({isLoading: true});
                  uploadFile();
                  setState({isShown: false});
                }}
                  confirmLabel={state.isLoading
                  ? 'Adding...'
                  : 'Add Site'}>
                  <div className='w-full h-full flex flex-col justify-center'>
                    <div className='mb-4'>
                      <label className='block text-blue-900 text-sm font-bold mb-2' for='siteName'>
                        Site name / Alias
                      </label>
                      <input
                        className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
                        id='siteName'
                        type='text'
                        value={site}
                        onChange={val => setPageName(val.target.value)}
                        name="site"
                        placeholder='eg. HomeChow'/>

                    </div>
                    <div className='mb-4'>
                      <label className='block text-blue-900 text-sm font-bold mb-2' for='siteName'>
                        Site Url
                      </label>
                      <input
                        className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
                        id='siteUrl'
                        type='text'
                        value={url}
                        onChange={val => setUrl(val.target.value)}
                        name="url"
                        placeholder='eg. http://'/>

                    </div>
                    <div className='mb-4'>
                      <label className='block text-blue-900 text-sm font-bold mb-2' for='siteName'>
                        FTP Url
                      </label>
                      <input
                        className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
                        id='ftpUrl'
                        type='text'
                        value={ftp}
                        onChange={val => setFtp(val.target.value)}
                        name="ftp"
                        placeholder='eg. ftp://'/>

                    </div>

                  </div>
                </Dialog>
                <AiOutlineFolderAdd
                  className="addIcon"
                  onClick={() => setState({isShown: true})}/>

              </Pane>
            )}
          </Component>

        </animated.div>
      </div>
      <div className="w-full h-full grid grid-flow-col grid-cols-5">
        {prop
          .data
          .map((t, key) => (
            <Pane key={t.siteUrl} className="mainCard">
              <Pane className="siteBack ">
                <Pane className="flex flex-row justify-around w-full my-4">
                  <FiEye onClick={() => viewSite(t.siteUrl)}/>
                  <FiEdit onClick={() => viewEdit(t.siteUrl)}/>
                  <FiDelete/>
                </Pane>
                <Pane elevation={3} className='siteCard cursor-pointer'>
                  <div
                    className="h-full w-full flex flex-col justify-center cardOverLay items-center">

                    <h6 className='text-blue-900 text-3xl font-semibold'>{t.pagename}</h6>
                  </div>
                </Pane>

              </Pane>

            </Pane>

          ))}
      </div>
    </div>
  )

}

function PublishedR(Props) {
  console.log(Props, "props")
  const {loading, error, data} = useQuery(GET_SITES_USER, {
    variables: {
      username: Props.PROFILE.email
    }
  });

  const [allSites,
    setAllSites] = React.useState([])

  React.useEffect(() => {
    if (data) 
      setAllSites(data.getSitesByUser);
    }
  , [data])

  if (loading) 
    return <p>Loading ...</p>;
  return (
    <div className='h-full w-full p-10'>
      <Tile data={allSites}/>
    </div>
  )
}

function Users() {
  const {loading, error, data} = useQuery(GET_USERS);
  console.log(data);
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
                  <label className='block text-blue-900 text-sm font-bold mb-2' for='username'>
                    Username
                  </label>
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
                    id='username'
                    value={values.username}
                    onChange={onChange}
                    name="username"
                    type='text'
                    placeholder='Username'/>
                </div>
                <div className='mb-4'>
                  <label className='block text-blue-900 text-sm font-bold mb-2' for='username'>
                    Email
                  </label>
                  <input
                    className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
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

function Settings() {
  const data = [
    {
      title: 'New Site',
      id: 200
    }, {
      title: 'Old site',
      id: 300
    }
  ]

  return (
    <div className='h-full w-full p-10'>
      <Tile data={data}/>
    </div>
  )
}

function AddUsers(props) {
  const [registerRun, {
      loading,
      error
    }
  ] = useMutation(REGISTER_NEW_USER);
  const [values,
    setValues] = React.useState({signClicked: false, username: '', password: '', email: '', confirmPassword: ''})
  const onChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const Register = async() => {
    const {username, password, confirmPassword, email} = values;
    if (!username || !password || !confirmPassword || !email) 
      return toaster.warning("Please fill all fields");
    if (password !== confirmPassword) 
      return toaster.danger('Passwords do not match');
    registerRun({
      variables: {
        username,
        password,
        email
      }
    }).then((response) => {
      toaster.success('Added user successfully');
      props
        .history
        .push('/');
      // props.LoginUser(response.data.register)
    }).catch((error) => {
      return toaster.danger('Either email or username is taken already');
    })

  }
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className='w-4/5 md:w-4/5 lg:w-2/5 lg:p-10'>
        <form className='bg-white  rounded px-8 pt-6 pb-8 mb-4'>

          <div className='mb-4 mt-6'>
            <label className='block text-blue-900 text-sm font-bold mb-2' for='username'>
              Username
            </label>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
              id='username'
              value={values.username}
              onChange={onChange}
              name="username"
              type='text'
              placeholder='Username'/>
          </div>
          <div className='mb-4'>
            <label className='block text-blue-900 text-sm font-bold mb-2' for='username'>
              Email
            </label>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
              id='email'
              value={values.email}
              onChange={onChange}
              name="email"
              type='email'
              placeholder='Email'/>
          </div>
          <div className='mb-4'>
            <label className='block text-blue-900 text-sm font-bold mb-2' for='password'>
              Password
            </label>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
              id='password'
              type='password'
              value={values.password}
              onChange={onChange}
              name="password"
              placeholder='******************'/>

          </div>
          <div className='mb-6'>
            <label className='block text-blue-900 text-sm font-bold mb-2' for='password'>
              Confirm Password
            </label>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-900'
              id='password'
              value={values.confirmPassword}
              onChange={onChange}
              type='password'
              name="confirmPassword"
              placeholder='******************'/>

          </div>
          <div className='flex flex-col items-center justify-between'>
            <button
              className='bg-blue-900 w-full mb-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='button'
              onClick={Register}>
              Add user
            </button>

          </div>
        </form>

      </div>

    </div>
  )
}

const mapStateToProps = state => (state)

const mapDispatchToProps = dispatch => ({})
const Tile = connect(mapStateToProps, mapDispatchToProps)(withRouter(TileR))
const Published = connect(mapStateToProps, mapDispatchToProps)(withRouter(PublishedR))

export default connect(mapStateToProps, mapDispatchToProps)(Homecontent)
