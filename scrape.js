
const cheerio = require('cheerio');
const axios = require('axios');
const tags = [];

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
     
    });
  //Convert to an array so that we can sort the results.
  return {
   
    tags: [...tags].sort(),
   

   };
  };
  module.exports = getResults;