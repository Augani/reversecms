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
    siteUrl: String
    pagename: String
    ftpUrl: String
    username: String
  }
  type ownerData {
    id: String
    username: String
  }

  type SiteData {
    _id: String
    siteUrl: String
    pagename: String
    ftpUrl: String
    owner: ownerData
  }
 

  type User {
    _id: String
    username: String
    password: String
    email: String,
    userType: Int
    sites: [String]
  }

  type Query {
    getUser(username: String): User
    getAllUsers:[User]
    getSitesByUser(username: String):[SiteData]
  }

  type Mutation {
    register(user: UserInput): User
    login(username: String, password: String): User
    addSite(data: siteInput): SiteData
    
    
  }
`);

module.exports = schema;