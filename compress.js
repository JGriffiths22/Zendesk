function compress(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return 'Error: Must provide a valid string'
  }

  let compressedString = '';
  let currentChar = str[0];
  let currentCount = 1;

  for (let i = 1; i < str.length; i++) {
    if (str[i] !== currentChar) {
      compressedString += `${currentChar}${currentCount}`;
      currentChar = str[i];
      currentCount = 1;
    } else {
      currentCount += 1;
    }
  }

  compressedString += `${currentChar}${currentCount}`;

  return compressedString;
}

console.log(compress('aaaabbaaaababbbccccccccccccd'));
console.log(compress('abcdefg'));
console.log(compress('aaaabbbaaaabababab'));
console.log(compress('ffllss--//xxxx0000www'));
