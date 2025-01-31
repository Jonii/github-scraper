/**
 * next_page checks for pagination on a page
 * @param {Object} $ - cheerio object with DOM of page to be scraped
 * @param {Object} data - the data we have scraped from the page so far
 * @return {Object} the data object with a next_page key & value
 */
module.exports = function next_page($, data) {
  var next = $('.pagination').find('a').filter(function () {
    return $(this).text() === "Next";
  }).attr('href');
  if (next && next.length > 0) {
    data.next_page = next
  }
  return data;
}
