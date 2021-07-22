/////
// nodeDB, a simple in-memory database written in node.js.
/////

// Create readline interface
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Data store
const db = {};

// Transaction store
const transactionStore = {
    count: 0,
    get latestTransaction() {
        return this[transactionStore.count];
    }
};

const newTransaction = () => {
    transactionStore.count++;
    transactionStore[transactionStore.count] = { commandCount: 0, commands: {} };
};

const addCommandToLatestTransaction = (command) => {
    if (transactionStore.count === 0) {
        return;
    }
    transactionStore.latestTransaction.commandCount++;
    transactionStore.latestTransaction.commands[transactionStore.latestTransaction.commandCount] = command;
};

const rollbackLatestTransaction = () => {
    while (transactionStore.latestTransaction.commandCount > 0) {
        const command = transactionStore.latestTransaction.commands[transactionStore.latestTransaction.commandCount];
        db[command.name] = command.previousValue;
        transactionStore.latestTransaction.commandCount--;
    }
    delete transactionStore[transactionStore.count];
    transactionStore.count--;
};

const commitAllTransactions = () => {
    while (transactionStore.count > 0) {
        delete transactionStore[transactionStore.count];
        transactionStore.count--;
    }
};

// Set constants
const HELP_TEXT = `
SET [name] [value] 
Sets the name in the database to the given value 
 
GET [name] 
Prints the value for the given name. If the value is not in the database, prints ​NULL 
 
DELETE [name] 
Deletes the value from the database 
 
COUNT [value] 
Returns the number of names that have the given value assigned to them. If that value is not assigned anywhere, prints ​0 
 
BEGIN 
Begins a new transaction 
 
ROLLBACK 
Rolls back the most recent transaction. If there is no transaction to rollback, prints ​TRANSACTION NOT FOUND 
 
COMMIT 
Commits ​all​ of the open transactions 
 
END 
Exits the database 
`
const INVALID_ARG_LENGTH = 'Invalid number of arguments!';

/////
// Create functions for each db command
/////

// SET
const dbSet = (inputs) => {
    if (inputs.length !== 3) {
        console.log(INVALID_ARG_LENGTH);
        return;
    }
    const name = inputs[1];
    const value = inputs[2];
    addCommandToLatestTransaction({name, previousValue: db[name]});
    db[name] = value;
}

// GET
const dbGet = (inputs) => {
    if (inputs.length !== 2) {
        console.log(INVALID_ARG_LENGTH);
        return;
    }
    const name = inputs[1];
    const value = db[name];
    console.log(value || 'NULL');
}

// DELETE
const dbDelete = (inputs) => {
    if (inputs.length !== 2) {
        console.log(INVALID_ARG_LENGTH)
        return;
    }
    const name = inputs[1];
    addCommandToLatestTransaction({name, previousValue: db[name]});
    delete db[name];
}

// COUNT
const dbCount = (inputs) => {
    if (inputs.length !== 2) {
        console.log(INVALID_ARG_LENGTH);
        return;
    }
    const value = inputs[1];
    const count = Object.values(db).filter(v => v === value).length;
    console.log(count);
}

// Set input prompt
rl.setPrompt('>> ');

// Begin reading input
rl.prompt();

// Read input one line at a time and process it
rl.on('line', function (line) {
    const inputs = line.trim().split(' ');
    const command = inputs[0];
    switch (command) {
        case 'SET':
            dbSet(inputs);
            break;
        case 'GET':
            dbGet(inputs);
            break;
        case 'DELETE':
            dbDelete(inputs);
            break;
        case 'COUNT':
            dbCount(inputs);
            break;
        case 'BEGIN':
            newTransaction();
            break;
        case 'ROLLBACK':
            rollbackLatestTransaction();
            break;
        case 'COMMIT':
            commitAllTransactions();
            break;
        case 'END':
            rl.close();
            break;
        case 'HELP':
            console.log(HELP_TEXT);
            break;
        default:
            console.log('Command not recognized. Available commands:', HELP_TEXT);
            break;
    }
    rl.prompt();
}).on('close', function() {
    console.log('Thanks for using nodeDB!');
    process.exit(0);
});