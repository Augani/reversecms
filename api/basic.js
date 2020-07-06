'use strict';

const ftp = require('basic-ftp');
const fs = require('fs');

class FTPClient {
    constructor(host = 'localhost', port = 21, username = 'anonymous', password = 'guest', secure = false) {
        this.client = new ftp.Client();
        this.settings = {
            host: host,
            port: port,
            user: username,
            password: password,
            secure: secure
        };
    }

    connect(){
       (async ()=>{
       await this.client.access(this.settings);
       let g = await this.client.send("LIST").catch(e=>console.log(e));
       console.log(g)
       })()
    }

    upload(sourcePath, remotePath, permissions) {
        let self = this;
        (async () => {
            try {
                let access = await self.client.access(self.settings);
                let upload = await self.client.upload(fs.createReadStream(sourcePath), remotePath);
                let permissions = await self.changePermissions(permissions.toString(), remotePath);
            } catch(err) {
                console.log(err);
            }
            self.client.close();
        })();
    }

    getFiles(){
     this.client.send('mkdir')
    }

    close() {
        this.client.close();
    }

    changePermissions(perms, filepath) {
        let cmd = 'SITE CHMOD ' + perms + ' ' + filepath;
        return this.client.send(cmd, false);
    }
}

module.exports = FTPClient;