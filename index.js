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

function truncateString(str, len) {
	if (str.length > len) {
		return str.slice(0, len-1) + "…";
	}
	return str;
}

function printTable(comments) {
    let res = '  !  |  ';
    res += 'user'.padEnd(10, ' ') + '  |  ';
    res += 'date'.padEnd(10, ' ') + '  |  ';
    res += 'comment'.padEnd(50, ' ') + '  |  ';
    console.log(res);
    let a = '';
    for (let i = 0; i < 100; i++)
        a += '-';
    console.log(a);
    for (const comment of comments) {
        let res = '  ' + (comment.indexOf('!') === -1 ? ' ' : '!') + '  |  ';
        const name = comment.match(/TODO(.*?);/);
        res += truncateString(name === null ? '' : name[1].trim(), 10).padEnd(10, ' ') + '  |  ';
        const date = comment.match(/TODO.*;(.*);/);
        res += truncateString(date === null ? '' : date[1].trim(), 10).padEnd(10, ' ') + '  |  ';
        const com = comment.match(/;.*?;(.*)$/);
        res += truncateString(date === null ? '' : com[1].trim(), 50).padEnd(50, ' ')
        console.log(res);
    }
}

function processCommand(command) {
    command = command.trim().split(/\s+/);
    switch (command[0]) {
        case 'show':
            printTable(getComments());
            break;
        case 'important':
            printTable(getComments().filter((c) => c.indexOf('!') !== -1));
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
            printTable(comments);
            break;
        case 'user':
            const findingName = command[1].toLowerCase();
            const a = [];
            for (let comment of getComments()){
                const name = comment.match(/\/\/\s*TODO (.*?);/);
                if (comment.split(';').length === 3 && name[1].trim().toLowerCase() === findingName){
                    a.push(comment);
                }
            }
            printTable(a);
            break;
            case 'date':
                const findingDate = new Date(command[1]);
                const b = [];
                for (let comment of getComments()){
                    if (comment.split(';').length === 3){
                        const commentDate = new Date(comment.match(/\/\/\s*TODO.*; (.*);/)[1]);
                        if (commentDate >= findingDate){
                            b.push(comment);
                        }
                    }
                }
                printTable(b);
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
