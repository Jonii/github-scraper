/**
 * org method scrapes a given GitHub organisation
 * @param {string} orgname - a valid GitHub orgname
 * @param {function} callback - the callback we should call after scraping
 *  a callback passed into this method should accept two parameters:
 *  @param {objectj} error an error object (set to null if no error occurred)
 *  @param {object} data - the complete organsiation data
 */
function org($, url, callback) {
  var data = { url: url, type: 'org' };
  data.name = $('.AppHeader-context-item-label').text().trim()  
  data.description = $('.pagehead .avatar').parent().next().find('div:first-child').text().trim();
  if($('span[itemprop=location]').length > 0){
    data.location = $('span[itemprop=location]')[0].attribs.title;
  }
  if($('.octicon-link').length > 0){
    // console.log($('.octicon-link'));
    data.website = $('.octicon-link').next().text().trim();
  }
  if($('a[itemprop=email]').length > 0){
    data.email = $('a[itemprop=email]').first().text().trim();
  }
  // var people  = $('.Counter').eq(1); // people is *second* in list of tabs!
  // data.pcount = parseInt(people.first().text(), 10);
  // data.pcount = isNaN(data.pcount) ? 0 : data.pcount
  const avatarElement = $('.avatar')[0];
  data.avatar = avatarElement.attribs.src
  var parts = data.avatar.split('/');
  data.uid = parseInt(parts[parts.length-1].split('?')[0], 10);
  // list of repos
  var items = $('li div[itemprop="owns"]');
  // console.log('items.length', items.length);
  data.entries = []; // avoid having circular reference objects! :-(
  items.each( function (i) { // JS counters start at 0.
    var parent = `li:nth-child(${i+1}) div[itemprop="owns"] `; // CSS selectors start at 1.
    data.entries.push({
      name: $(parent + ' a').first().text().trim(),
      lang: $(parent + 'span[itemprop=programmingLanguage]').first().text().trim(),
      url: $(parent + ' a').first().attr('href'),
      description: $(parent + 'p.d-inline-block').first().text().trim(),
      updated: $(parent + ' relative-time')[0].attribs.datetime
    });
  });

  data = require('./next_page')($, data); // don't worry this gets cached ;-)
  callback(null, data);
}

module.exports = org
