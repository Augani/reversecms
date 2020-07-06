
const cheerio = require('cheerio');
const axios = require('axios');
const tags = [];
var htmlSrc = "";

const fetchData = async (url) => {
    const result = await axios.get(url);
    return cheerio.load(result.data);
  };
  const getResults = async (url) => {
    const $ = await fetchData(url);
  
    $(".air-reverse").each((index, element) => {
        tags.push({
            class: $(element).attr('class'),
            value:$(element).text()
        });
        $(element).attr('contenteditable', true);


     
    });

  //   $(".air-reverse").each((index, element) => {
  //       $(element).attr('contenteditable', true);
  //   });

   htmlSrc = $.html();
 


    
  //Convert to an array so that we can sort the results.
  return {
   
    tags: [...tags].sort(),
    src: htmlSrc
   

   };
  };
  module.exports = getResults;