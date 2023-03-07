// Import modules
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// Define start URL
const startUrl = 'https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation/guide/';

// Define base URL
const baseUrl = 'https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation';

// Define visited URLs set
const visitedUrls = new Set();

// Define data array
const data = [];

// Define crawl function
function crawl(url) {
    // Check if URL is already visited
    if (visitedUrls.has(url)) {
        return;
    }
    // Mark URL as visited
    visitedUrls.add(url);
    console.log(`Visiting page ${url}`);
    // Make request to URL
    request(url, (error, response, body) => {
        // Handle errors
        if (error) {
            console.error(error);
            return;
        }
        // Parse HTML with cheerio
        const $ = cheerio.load(body);
        // Extract text from div with class theme-default-content 
        const text = $('.theme-default-content').text();
        // Push text to data array
        data.push(text);
        // Find all links on page
        const links = $('a');
        console.log(`Found ${links.length} links on page`);
        // Loop through links and crawl them recursively if they are under base URL 
        links.each((index, element) => {
            const href = $(element).attr('href');
            // console.log(`Crawling link ${$(element).attr('href')}`);
            if (href?.startsWith(baseUrl)) {
                crawl(href);
            } else if (href?.startsWith('/vuexy-nextjs-admin-template/documentation')) {
                crawl("https://demos.pixinvent.com" + href);
            }
        });
    });
}

// Call crawl function with start URL 
crawl(startUrl);

// Write data array to file after crawling is done 
process.on('exit', () => {
    fs.writeFileSync('data.txt', data.join('\n'));
});