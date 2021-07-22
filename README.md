# nodeDB

nodeDB, a simple in-memory database written in node.js.

To run, make sure node is installed and run:

```
> node nodedb.js
```

You will be presented with a prompt. To get available commands, type:

```
> node nodedb.js
>> HELP

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

>> 
```