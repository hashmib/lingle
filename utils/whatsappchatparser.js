/* 
Reads chat messages from string and returns an array of objects
*/
function parseChat(_chat) {
    // Using regex to split the chat into an array of messages, using the newline character as the delimiter
    messageList = _chat.split(/\r\n|\n\r|\n|\r/);
    parsedMessages = [];

    for (let i in messageList) {
        messageObject = [];
        
        // First space delimits timestamp
        let splitList = messageList[i].split('] ');
        messageObject.push(splitList[0]);

        let remainder = splitList[1];

        // First few messages in a chat file never have a semicolon, so no sender
        if (remainder.includes(':')) {
            let msg = remainder.split(': ');
            messageObject.push(msg[0]);
            messageObject.push(msg[1]);
        }
        else {
            messageObject.push(remainder);
        }

        parsedMessages.push(messageObject);
    }
    return parsedMessages;
}

module.exports = {
    parseChat
}