const getResults = require("./scrape");

getResults("http://127.0.0.1:5500").then((r)=>{
    console.log(r)
}).catch((e)=>{
    console.log(e)
})
