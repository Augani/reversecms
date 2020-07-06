
const jsftp = require("jsftp");

const Ftp = new jsftp({
  host: "ftp.drivehq.com",
  port: 21, // defaults to 21
  user: "augani", // defaults to "anonymous"
  pass: "Augustus@1996" // defaults to "@anonymous"
});

Ftp.ls(".", (err, res) => {
    res.forEach(file => console.log(file.name));
  });

  Ftp.get("/wwwhome/home.htm", "./test/home.htm", err => {
    if (err) {
      return console.error("There was an error retrieving the file.");
    }
    console.log("File copied successfully!");
  });
  
  



