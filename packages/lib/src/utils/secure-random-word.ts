import crypto from "node:crypto"

const syllables = {
  consonants: [
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "qu",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
  consonantClusters: [
    "bl",
    "br",
    "ch",
    "cl",
    "cr",
    "dr",
    "fl",
    "fr",
    "gl",
    "gr",
    "ph",
    "pl",
    "pr",
    "sc",
    "sh",
    "sk",
    "sl",
    "sm",
    "sn",
    "sp",
    "st",
    "sw",
    "th",
    "tr",
    "tw",
    "wh",
    "wr",
  ],
  vowels: ["a", "e", "i", "o", "u"],
  vowelCombos: [
    "ai",
    "ay",
    "ea",
    "ee",
    "ei",
    "ey",
    "ie",
    "oa",
    "oo",
    "ou",
    "oy",
    "ue",
    "ui",
  ],
}

function getSecureRandomElement(array: string[]) {
  const randomBytes = crypto.randomBytes(4)
  const randomIndex = randomBytes.readUInt32BE(0) % array.length
  return array[randomIndex]
}

export const generateLengthLetterSegment = (length = 4) => {
  let segment = ""

  // Start with either a consonant cluster or a single consonant
  segment += getSecureRandomElement([
    ...syllables.consonantClusters,
    ...syllables.consonants,
  ])

  // Add a vowel or vowel combo
  segment += getSecureRandomElement([
    ...syllables.vowels,
    ...syllables.vowelCombos,
  ])

  // Fill the remaining space with consonants and/or vowels
  while (segment.length < length) {
    if (segment.length === 3) {
      segment += getSecureRandomElement([
        ...syllables.consonants,
        ...syllables.vowels,
      ])
    } else {
      segment += getSecureRandomElement([
        ...syllables.consonants,
        ...syllables.vowels,
        ...syllables.vowelCombos,
      ])
    }
  }

  // Trim if necessary (in case we added a 2-letter combo at the end)
  return segment.slice(0, 4)
}

export const generateSecureRandomWordWithHyphens = (segmentsCount = 4) => {
  const segments = Array(segmentsCount)
    .fill("0000")
    .map(() => generateLengthLetterSegment())

  return segments.join("-")
}
