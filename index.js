const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getComments() {
    const arrayComments = [];
    for (let file of getFiles()) {
        for (let line of file.split('\n')) {
            let comment = line.match(/(\/\/\s*TODO.*)/);
            if (comment) {
                arrayComments.push(line.match(/(\/\/\s*TODO.*)/)[0]);
            }
        }
    }
    return arrayComments;
}

function compareCommentsByUser(a, b) {
    let user1 = a.match(/TODO(.*?);/);
    let user2 = b.match(/TODO(.*?);/);
    if (user1 == null)
        return 1;
    if (user2 == null)
        return -1;
    return user1[1].trim().localeCompare(user2[1].trim());
}
function compareCommentsByDate(a, b) {
    let user1 = a.match(/TODO.*;(.*);/);
    let user2 = b.match(/TODO.*;(.*);/);
    if (user1 == null)
        return 1;
    if (user2 == null)
        return -1;
    user1 = user1[1].split('-');
    user2 = user2[1].split('-');
    return new Date(user1[0], user1[1], user1[2]) - new Date(user2[0], user2[1], user2[2]);
}

function processCommand(command) {
    command = command.trim().split(/\s+/);
    switch (command[0]) {
        case 'show':
            for (let comment of getComments()) {
                console.log(comment);
            }
            break;
        case 'important':
            for (let comment of getComments()) {
                if (comment.indexOf('!') != -1){
                    console.log(comment);
                }
            }
            break;
        case 'sort':
            let comments = getComments();
            if (command[1] === 'importance') {
                comments.sort((a, b) => b.split('!').length - a.split('!').length);
            } else if (command[1] === 'user') {
                comments.sort((a, b) => compareCommentsByUser(a,b));
            } else if (command[1] === 'date') {
                comments.sort((a, b) => compareCommentsByDate(a,b));
            } else {
                break;
            }
            for (let comment of comments) {
                console.log(comment);
            }
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
