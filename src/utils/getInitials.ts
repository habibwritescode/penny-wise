// The first letter or digit of each word, so a leading emoji or "*" is
// skipped instead of being cut in half.
// (A RegExp object: tsconfig's ES5 target rejects the /u literal.)
const LETTER_OR_DIGIT = new RegExp("[\\p{L}\\p{N}]", "u");
const firstLetter = (word: string) => word.match(LETTER_OR_DIGIT)?.[0];

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .map(firstLetter)
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default getInitials;
