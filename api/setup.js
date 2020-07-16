const Path = require('path')
const glob = require('glob')
const cheerio = require('cheerio')
const fs = require('fs')
const GetResults = require('./scrape')

const Setup =async ({ username, pagename }) => {
    var options = {
      cwd: process.cwd() + `/sites/local/${username}/${pagename}`
    }
  glob('**/*.html', options,function (err, files) {
    
   files.forEach(function(file, index){
      let way = process.cwd() + '/sites/local/' + username + '/' + pagename + '/' + file;
      
      let gs  = null;
      fs.readFile(way,'utf8',async function(err, data){
        gs = data;
        
        let { src } = await GetResults(gs);
        fs.writeFile(way,src, function(err,dn){
          console.log('file replaced');
        });

      });
    
    });
    });
}

function getNumberOfSites(options){
  glob('**/*.html', options,function (err, files) {
    return files;
  })
}

function removeEditable (url) {
  const $ = cheerio.load(url)
  var html = ''
  $('.reverse-cms').each((index, element) => {
    $(element).attr('contenteditable', false)
  })
  html = $.html()
  return html
}

const Done = async ({ username, pagename }) => {
  var options = {
    cwd: `../sites/${username}/${pagename}`
  }

  glob('**/*.html', options, function (err, files) {
    for (let y = 0; y < files.length; y++) {
      let way = '../sites/' + username + '/' + pagename + '/' + files[y]
      let gs = null
      fs.readFile(way, 'utf8', async function (err, data) {
        if (err) {
          return console.log(err)
        }
        gs = data
        let src = removeEditable(gs)
        fs.writeFile(way, src, function (err) {
          if (err) return console.log(err)
        })
      })
    }
  })
}




module.exports = { Setup, Done }
