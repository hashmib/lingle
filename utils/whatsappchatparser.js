/* 
Reads chat messages from string and returns an array of objects
*/
function parseChat(_chat) {
    // Using regex to split the chat into an array of messages, using the newline character as the delimiter
    messageList = _chat.split(/\r\n|\n\r|\n|\r/);
    parsedMessages = [];

    for (let i in messageList) {
        messageObject = {};
        
        // First space delimits timestamp
        let splitList = messageList[i].split('] ');

        // Remove [ character
        let timestamp = splitList[0].replace('[', '');
        messageObject["timestamp"] = timestamp;

        let remainder = splitList[1];

        // First few messages in a chat file never have a semicolon, so no sender
        if (remainder.includes(':')) {
            let msg = remainder.split(': ');
            messageObject["sender"] = msg[0];
            messageObject["message"] = msg[1];
        }
        else {
            messageObject["message"] = remainder;
        }

        parsedMessages.push(messageObject);
    }
    return parsedMessages;
}

module.exports = {
    parseChat
}