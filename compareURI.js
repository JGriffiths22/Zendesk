/*
*  Helper Function
*  Translates and removes dot segments from the path
*/
function removeDotSegments(path) {
  path = path.split('/');

  for (let i = 1; i < path.length; i++) {
    if (path[i] === '..') { // One directory up; remove it and the step before it
      path.splice(i - 1, 2);
      i -= 2;
    } else if (path[i] === '.') { // Same directory; remove current step
      path.splice(i, 1);
      i -= 1;
    }
  }

  return path.join('/');
}

/*
 *  Helper Function
 *  Standardize query params by sorting by key name for easy comparison.
 *  Params sharing a key will retain their position relative to each other in the string.
 */
function standardizeQueryParams(query) {
  query = query.split('&');

  query = query.sort(function (a, b) {
    // Sort params using only the keys to preserve to retain relative position of duplicates for comparison
    if (a.substring(0, a.indexOf('=')) < b.substring(0, b.indexOf('='))) {
      return -1;
    } else if (a.substring(0, a.indexOf('=')) > b.substring(0, b.indexOf('='))) {
      return 1;
    }

    return 0;
  });

  return query.join('&');
}

/*
 *  Helper Function
 *  Standardizes URI so a simple comparison can be performed.
 *  Operates separately on each significant portion of the URI following these steps:
 *    1) Converts scheme section to lower case (for case insensitive comparison) and copies it over
 *    2) Checks for auth section. If present, it is copied over without case conversion (for case sensitive comparison)
 *    3) Converts host section to lower case (for case insensitive comparison) and copies it over
 *    4) Check for presense of port section in host. If no port is specified the default is added (:80)
 *    5) The path section of the URI is separated and passed into the removeDotSegments helper.
 *       The helper will remove the dot segments as well as any pieces of the path affected by them.
 *       The resulting path is then retuned with its case intact (for case sensitive comparison)
 *    6) Checks for query string. If present, the query is passed into the standardizeQueryParams helper.
 *       The params are split and sorted by their key (with duplicate keys preserving their relative order).
 *       The params are then rejoined and passed back with their case intact (for case sensitive comparison)
 *    7) If anything remains after the query string (fragment/hash) it is copied over directly with it's case intact (for case sensitive comparison)
 *    8) Finally, the standardized URI is run through the decodeURI function to replace url encoded strings with their
 *       character equivalent before being returned.
 */
function standardizeUri(uri) {
  let workingIdx = 0; // Keep track of where we are in the original URI
  let standardizedUri = '';

  // Case insensitive scheme
  const schemeEnd = uri.indexOf('://') + 3;
  standardizedUri += uri.substring(0, schemeEnd).toLowerCase();
  workingIdx = schemeEnd;

  // If auth is present, copy it over preserving case
  if (uri.includes('@') === true) {
    standardizedUri += uri.substring(workingIdx, uri.indexOf('@') + 1);
    workingIdx = uri.indexOf('@') + 1;
  }

  // Case insensitive host
  const hostEnd = uri.indexOf('/', workingIdx);
  let host = uri.substring(workingIdx, hostEnd).toLowerCase();

  // If no port is specified add the default
  if (host.includes(':') === false) {
    host += ':80';
  }

  standardizedUri += host;
  workingIdx = hostEnd;

  // Case sensitive path with dot segments translated and removed
  const pathEnd = uri.search(/[?#]/) !== -1 ? uri.search(/[?#]/) : uri.length - 1;
  standardizedUri += removeDotSegments(uri.substring(workingIdx, pathEnd));
  workingIdx = pathEnd;

  // If a query string exists, standardize (sort) it and add it to the new URI
  if (uri.includes('?') === true) {
    const queryEnd = uri.indexOf('#') !== -1 ? uri.indexOf('#') : uri.length;
    standardizedUri += `?${standardizeQueryParams(uri.substring(workingIdx + 1, queryEnd))}`;
    workingIdx = queryEnd;
  }

  // Since fragment (hash) is a direct copy we can just append whatever (if anything) is left after the query
  standardizedUri += uri.substring(workingIdx, uri.length);

  // Decode any URI encoding prior to returning
  return decodeURI(standardizedUri);
}

/*
 * Primary Function
 * Compares two URIs to each other after they've been standardized to determine if they are functionally equivalent
 */
function checkURIs(uri1, uri2) {
  return standardizeUri(uri1) === standardizeUri(uri2);
}

/*
 * Test Cases Expected Results
 * 1) True
 * 2) True
 * 3) True
 * 4) False (query string duplicate key order)
 * 5) False (auth case mismatch)
 * 6) True
 * 7) False (fragment case mismatch)
 * 8) False (port mismatch)
 * 9) True
 * 10) False (paths don't resolve to equal)
 * 11) True
 */
console.log(checkURIs('http://abc.com:80/~smith/home.html', 'http://ABC.com/%7Esmith/home.html'));
console.log(checkURIs('http://abc.com/drill/down/foo.html', 'http://abc.com/drill/further/../down/./foo.html'));
console.log(checkURIs('http://abc.com/foo.html?a=1&b=2', 'http://abc.com/foo.html?b=2&a=1'));
console.log(checkURIs('http://abc.com/foo.html?a=1&b=2&a=3', 'http://abc.com/foo.html?a=3&a=1&b=2'));
console.log(checkURIs('http://user:pass@abc.com/home.html?a=1#home', 'http://user:Pass@abc.com/home.html?a=1#home'));
console.log(checkURIs('http://uname:passwd@abc.com/home.html?b=3&a=1#home', 'http://uname:passwd@abc.com/home.html?a=1&b=3#home'));
console.log(checkURIs('http://uname:passwd@abc.com/home.html?b=3&a=1#home', 'http://uname:passwd@abc.com/home.html?b=3&a=1#Home'));
console.log(checkURIs('http://abc.com:80/~smith/home.html', 'http://abc.com:3000/~smith/home.html'));
console.log(checkURIs('http://abc.com/folder1/./././folder2/home.html', 'http://abc.com/folder1/folder2/home.html'));
console.log(checkURIs('http://abc.com/drill/down/foo.html', 'http://abc.com/drill/further/../down/.././foo.html'));
console.log(checkURIs('hTtP://uname:passwd@ABC.com/folder1/folder2/.././folder3/index.html?a=1&b=3&c=5&a=4&b=2#Home', 'HtTp://uname:passwd@abc.com/folder1/folder3/index.html?b=3&c=5&a=1&b=2&a=4#Home'));
