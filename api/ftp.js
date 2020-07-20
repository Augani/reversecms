var Client = require('ftp');
var fs = require('fs');
 
  var c = new Client();
  c.on('ready', function() {
    c.list(function(err, list) {
      if (err) throw err;
      console.dir(list);
      c.end();
    });
  });
  // connect to localhost:21 as anonymous
  c.connect();


  class Connect{
      username = "";
      password = "";
      host = "";
      connection = null
      constructor(username, password, host){
        this.username = username;
        this.password = password;
        this.host = host;
      }

       connect(){
          
        this.connection = new Client();
        this.connection.connect({
            user: this.username,
            password: this.password,
            host: this.host,
            port: 21
            
        })
       
      }

      getFiles(){
        //   if(!this.connection)await this.connect();
      let files =   this.connection.on('ready', function() {
            this.connection.list(function(err, list) {
              if (err) return [];
              return list;
            });
          });
       this.connection.end();
       return files;   
      }

      kill(){
          this.connection.end();
      }
  }

  module.exports = Connect;