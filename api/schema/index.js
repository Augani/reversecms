var { buildSchema } = require('graphql');


var schema = buildSchema(`
  input UserInput {
    username: String
    password: String,
    email: String
  }
  input UserData {
    id: String
    username: String
  }

  input siteInput {
    filename: String
    pagename: String
    owner: UserData
  }
  type ownerData {
    id: String
    username: String
  }

  type SiteData {
    _id: String
    filename: String
    pagename: String
    owner: ownerData
  }
 

  type User {
    _id: String
    username: String
    password: String
    email: String
  }

  type Query {
    getUser(username: String): User
  }

  type Mutation {
    register(user: UserInput): User
    login(username: String, password: String): User
    fileUpload(data: siteInput): SiteData
  }
`);

module.exports = schema;