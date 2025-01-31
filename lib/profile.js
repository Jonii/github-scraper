const parse_int = require('../lib/utils').parse_int;
/**
 * profile method scrapes a given GitHub user profile
 * @param {string} username - a valid GitHub username
 * @param {function} callback - the callback we should call after scraping
 *  a callback passed into this method should accept two parameters:
 *  @param {objectj} error an error object (set to null if no error occurred)
 *  @param {object} data - the complete GitHub Profile for the username
 */
module.exports = function profile ($, url, callback) {
  var data = { url: url, type: 'profile' };
  data.username = url.replace('/', '');
  data.bio = $('.user-profile-bio').text().trim();
  const avatarElement = $('.avatar')[0];
  data.avatar   = avatarElement.attribs.src; // Profile pic
  var parts = data.avatar.split('/');
  data.uid = parseInt(parts[parts.length-1].split('?')[0], 10);

  // Profile Stats (Navigation)
  var stats = $('.Counter').map(function (i, item) {
    var stat = $(item).text();
    return parse_int(stat);
  });
  // data.repos     = stats[2];
  // data.projects  = stats[3];
  // data.stars     = stats[5]; // number of repositories user has starred
  data.stars     = parse_int($('a[href$="?tab=stars"] .Counter').text());
  data.repos     = parse_int($('a[href$="?tab=repositories"] .Counter').text());
  data.projects  = parse_int($('a[href$="?tab=projects"] .Counter').text());
  data.following = parse_int($('a[href$="?tab=following"]').find("span").text());
  data.followers = parse_int($('a[href$="?tab=followers"]').find("span").text());

  // Pinned Repos
  [];
  var repos = $('.pinned-item-list-item')

  // console.log('repos: ', repos);
  data.pinned = [];
  repos.each(function (i) {
    data.pinned.push({
      url: $(this).find('a.text-bold')[0]['attribs']['href'],
      // Want More? see: https://github.com/nelsonic/github-scraper/issues/78
    })
  });
  data.name = $('.vcard-fullname').text().trim();            // Full Name
  data.worksfor = $('.p-org').first().text().trim();      // Works for
  const location = $('li[itemprop=homeLocation]')
  if(location && location.attr('aria-label')) {
    data.location = location.attr('aria-label').replace("Home location: ", '');
  }
  data.website  = $('[data-test-selector=profile-website-url] > a').attr("href")
  // data.joined   = $('.join-date').attr('datetime');       // Joined GitHub

  // Contributions to Open Source in the past 12 months
  data.contribs = parseInt($('.js-yearly-contributions').text().trim()
    .split(' contributions')[0].replace(',', ''), 10);
  // Contribution Matrix
  // data = require('./profile_contribs.js')($, data);

  // List of (Public) organizations from profile
  // data-hovercard-type="organization"
  var orgs = $('.avatar-group-item');
  // console.log(orgs);
  data.orgs = {}; // https://github.com/nelsonic/github-scraper/issues/80
  orgs.each( function (i) {
    var url = orgs[i].attribs.href.replace('/', '');
    data.orgs[url] = $(this).find('img')['0'].attribs.src; // org image
  })

  // GitHub Developer Program member?
  var member = $('.Label--purple').text().trim();
  // yes this is always on the page but the hide it using CSS!! :-(
  var display = $('.Label--purple').parent().hasClass('d-none');
  if(member && member === 'Pro' && !display) {
    data.developerprogram = true;
  }
  callback(null, data);
  // add task to arana to scrape /{username}?tab=repositories after profile!
}
