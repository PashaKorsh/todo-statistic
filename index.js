const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'show':
            for (let file of getFiles()) {
                for (let line of file.split('\n')) {
                    let comment = line.match(/(\/\/\s*TODO.*)/);
                    if (comment) {
                        console.log(line.match(/(\/\/\s*TODO.*)/)[0]);
                    }
                }
            }
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
