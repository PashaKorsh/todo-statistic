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

function processCommand(command) {
    switch (command) {
        case 'show':
            const allComments = getComments();
            for (let comment of allComments) {
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
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
