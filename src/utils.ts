/**
 * Shortens a string by trimming it to whole sentences until it fits within the given maxLength.
 * For example, if the original string has 5 sentences totaling 200 characters, and maxLength is
 * 100, the method will include as many full sentences as possible without exceeding the limit.
 * If the first 2 sentences total 88 characters and the first 3 total 133, the returned string
 * will contain only the first 2.
 * @param string - the original string to shorten
 * @param maxLength - the maximum string length
 * @param separator - the separator of sentences. defaults to ". "
 * @returns shortenned string
 */
export const shortenParagraph = (
  string: string,
  maxLength: number,
  separator: string = ". "
) => {
  const sentences = string.split(separator);

  // If there's only 1 sentence, no need to trim.
  if (sentences.length === 1) return sentences[0];

  let currLength = 0;
  const currSentences = [];

  for (let i = 0; i < sentences.length; i++) {
    const currSentence = sentences[i];
    currSentences.push(currSentence);

    currLength += currSentence.length;
    if (currLength >= maxLength) break;
  }

  currSentences.push(" ");

  return currSentences.join(". ").trim();
};
