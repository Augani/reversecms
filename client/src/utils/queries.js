import { gql } from 'apollo-boost'

export const  LOGIN_SCRIPT = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      _id,
      username,
      email,
      userType
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

export const PUBLISH_SITE = gql`
   
    mutation publish($username: String!, $site: String! ){
        publishSite(username: $username,site: $site)
    }
`;

export const ADD_SITE = gql`
   
    mutation upSite($siteUrl: String!, $pagename: String!, $username: String!, $ftpUrl: String, $ftpUser: String, $ftpPass: String){
        addSite(data: {siteUrl: $siteUrl,pagename: $pagename, ftpUrl: $ftpUrl, username: $username, ftpUsername: $ftpUser, ftpPassword: $ftpPass}){
            _id,
            siteUrl,
            pagename,
        }
    }
`;

export const DELETE_SITE = gql`
    mutation removeSite($id: String){
        removeSite(id: $id)
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
                pagename,
                owner{
                    email,
                    username
                }
        }
    }
`;

export const GET_EDITABLE = gql`
       query getEditableContent($pagename: String, $email: String){
            getEditable(data:{pagename: $pagename, username: $email})
    }
`;

export const REGISTER_NEW_USER_WITH_SITE = gql`
mutation RegisterWithSite( $username: String!, $email: String!, $password: String!,$url: String!, $pagename: String!, $ftp: String, $ftpUsername: String, $ftpPassword: String){
    registerWithSite(user: {username: $username, password: $password, email: $email, url: $url, ftp: $ftp, ftpUsername: $ftpUsername, ftpPassword: $ftpPassword, pagename: $pagename})
}

`;

export const UPDATE_PAGE = gql`
mutation updatePage($pageData: String!, $page: String, $username: String, $pagename: String){
    updatePageData(pageData: $pageData, page: $page, username: $username, pagename: $pagename)
}

`;
