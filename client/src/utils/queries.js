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