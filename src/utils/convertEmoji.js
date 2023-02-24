const { getEmoji } = require("../handlers/emojiHandler");

let charTable = {
  "!": "z_symbolexclamation",
  "?": "z_symbolquestion"
};

const convertStringToEmoji = (input) => {
  input = [...input.toLowerCase()];
  let finalString = "";
  for (let i = 0; i < input.length; i++) {
    let rawChar = input[i];
    let emojiText = "";
    if (rawChar.match(/[a-z]/i)) {
      emojiText = getEmoji(`z_letter${rawChar}`);
    } else if (rawChar.match(/[0-9]/i)) {
      emojiText = getEmoji(`z_number${parseInt(rawChar)}`);
    } else if (rawChar !== " ") {
      let symbol = getEmoji(charTable[rawChar]);
      if (!symbol) continue;
      emojiText = symbol;
    } else {
      finalString += `  `;
      continue;
    }
    finalString += `${emojiText}`;
  }
  return finalString.trimEnd();
};

module.exports = {convertStringToEmoji}