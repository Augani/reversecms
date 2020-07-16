
const cheerio = require('cheerio');
const axios = require('axios');
const glob = require('glob')
const tags = [];
var htmlSrc = "";

const fetchData = async (url) => {
    const result = await axios.get(url);
    return cheerio.load(result.data);
  };
  const getResults = async (url) => {
    const $ = cheerio.load(url)
  
    $("h1, h2, h3, h4, h5, h6,p,a").each((index, element) => {
        tags.push({
            class: $(element).attr('class'),
            value:$(element).text()
        });
        $(element).attr('contenteditable', true);
        console.log($(element).text());
     
    });
   
   htmlSrc = $.html();
  return {
   
    tags: [...tags].sort(),
    src: htmlSrc
   

   };
  };
  module.exports = getResults;