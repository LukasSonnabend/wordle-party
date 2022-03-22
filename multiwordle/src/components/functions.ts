export default function validateGuess(guessString: string, wordID: number[], word: string): number[] {
  const alphabet = "abcdefghijklmnopqrstuvwxz"
  const wordToGuess = word.toLocaleLowerCase()//"notar"//allWordsObject[alphabet[wordID[0]]][wordID[1]]
  let correctCount = 0
  let word2GuessArray = wordToGuess.split("")
  let guessStringArray = guessString.split("")
  const counts = {};

  //TODO: disable counts for hard mode
  for (const char of word2GuessArray) {
    counts[char] = counts[char] ? counts[char] + 1 : 1;
  }

  let validationArray = Array(guessString.length).fill(1)

   // first correct guesses
   for (let i = 0; i < guessString.length; i++) {
    if (guessString[i] === word2GuessArray[i]) {
      validationArray[i] = 3
      word2GuessArray[i] = " "
      correctCount++;
    }
   }

   for (let i = 0; i < guessStringArray.length; i++) {
      if (guessStringArray[i] !== " " && word2GuessArray.includes(guessStringArray[i]) ){
        validationArray[i] = counts[guessStringArray[i]]-- > 0 ? 2 : 1;
        word2GuessArray[i] = " "
      }
   }

  return {roundWon: correctCount===word2GuessArray.length, validation: validationArray}
}
