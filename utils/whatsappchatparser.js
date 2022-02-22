const FIVER_REGEX = new RegExp('\\b[a-zA-Z]{5}\\b', 'g');

function extractFiveLetterWords(message) {
    result = []
    let matches = message.matchAll(FIVER_REGEX);
    for (const match of matches) {
        result.push(match[0]);
    }
    return result;
}

/**
 * @description Parses a whatsapp chat file and returns an array of message objects.
 * Additionally, when creating these message objects, populate our five-letter word list 
 * @parameter _chat - A string containing the contents of a whatsapp chat file
 * @parameter _roomUuid - A string containing the uuid of the room that the chat belongs to
 * @returns An object containing an array of messages and an array of five-letter words
 */
function parseChat(_chat, _roomUuid) {
    // Using regex to split the chat into an array of messages, using the newline character as the delimiter
    messageList = _chat.split(/\r\n|\n\r|\n|\r/);
    parsedMessages = [];
    let fiveLetterMatches = [];

    for (let i in messageList) {
        messageObject = {};

        // For all newline entries that are not a new message, skip them
        if (!(messageList[i].includes('['))) {
            messageObject["message"] = messageList[i];
        }

        else {
            // First space delimits timestamp
            let splitList = messageList[i].split('] ');

            // Remove [ character
            let timestamp = splitList[0].replace('[', '');
            messageObject["timestamp"] = timestamp;
            messageObject["room_uuid"] = _roomUuid;

            let remainder = splitList[1];

            if (remainder.includes(':')) {
                let msg = remainder.split(': ');
                messageObject["sender"] = msg[0];
                messageObject["message"] = msg[1];
                

                let regexMatches = extractFiveLetterWords(messageObject["message"]);
                for (let i in regexMatches) {
                    fiveLetterMatches.push(regexMatches[i].toLowerCase());
                }
            }
            // First few messages in a chat file never have a semicolon, therefore no sender
            else {
                messageObject["message"] = remainder;
            }
        }
        parsedMessages.push(messageObject);
    }

    // Remove duplicates
    //let fiveLetterWords = [...new Set(fiveLetterMatches)];
    return {
        messages: parsedMessages,
        words: fiveLetterMatches
    }
}

module.exports = {
    parseChat
}