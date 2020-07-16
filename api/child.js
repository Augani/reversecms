var exec = require('child_process').exec;

const Run = (cmd)=>{
    exec(cmd, {
        cwd: '/home/user/directory'
      }, function(error, stdout, stderr) {
        // work with result
        if(error)return error;
        return stdout;
      });
}


module.exports = Run;