import { gql } from 'apollo-boost'

export const  LOGIN_SCRIPT = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      _id,
      username,
      email
    }
  }
`;

export const RESET_PASSWORD = gql`
mutation Reset($username: String!){
    resetPass(username: $username){
        response
    }
}
`;

export const REGISTER_NEW_USER = gql`
    mutation Register( $username: String!, $email: String!, $password: String!){
        register(user: {username: $username, password: $password, email: $email}){
            _id,
            username,
            email,
        }
    }
`;

export const UPLOAD_FILE = gql`
   
    mutation upload($filename: String!, $pagename: String!, $owner: UserData! ){
        fileUpload(data: {filename: $filename,pagename: $pagename, owner: $owner}){
            _id,
            filename,
            pagename,
        }
    }
`;

export const ADD_SITE = gql`
   
    mutation upSite($siteUrl: String!, $pagename: String!, $username: String!, $ftpUrl: String){
        addSite(data: {siteUrl: $siteUrl,pagename: $pagename, ftpUrl: $ftpUrl, username: $username}){
            _id,
            siteUrl,
            pagename,
        }
    }
`;

export const GET_USERS = gql`
        {
            getAllUsers{
                _id,
                username,
                password,
                email,
                userType,
                sites
            }
        }
`;


export const GET_SITES_USER = gql`
       query getSitesUser($username: String!){
            getSitesByUser(username:$username){
                _id,
                siteUrl,
                ftpUrl,
                pagename
        }
    }
`;
