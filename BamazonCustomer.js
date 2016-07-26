//INITIALIZES THE NPM PACKAGES USED//
var mysql    = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var clrScreen = true;

var msg1Prompt = "Enter the Item Id to order (or 'e' to exit) ==> ";
var msg2Prompt = 'Enter next Item Id to order? ==> ';
var msgPrompt  =  msg1Prompt;    // default

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// CREATE DB CONNECTION
//
//INITIALIZES THE CONNECTION VARIABLE TO SYNC WITH A MYSQL DATABASE//
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",                      //Your username//
    password: "tom",                   //Your password//
    database: "Bamazon"
})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

//CREATES THE CONNECTION WITH THE SERVER AND MAKES THE TABLE UPON SUCCESSFUL CONNECTION//
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }

    clearTheScreen();
    displayHdr();
    makeTable();
})

//FUNCTION TO GRAB THE PRODUCTS TABLE FROM THE DATABASE AND PRINT RESULTS TO CONSOLE//
var makeTable = function() {
    //SELECTS ALL OF THE DATA FROM THE MYSQL PRODUCTS TABLE - SELECT COMMAND!
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        //PRINTS THE TABLE TO THE CONSOLE
        printTbl(res);
 
        //RUNS THE CUSTOMER'S PROMPTS AFTER CREATING THE TABLE. SENDS res SO THE promptCustomer FUNCTION IS ABLE TO SEARCH THROUGH THE DATA//
        console.log("\n");
        promptCustomer(res);
    });
};

//FUNCTION CONTAINING ALL CUSTOMER PROMPTS//
var promptCustomer = function(res) {
        //PROMPTS USER FOR WHAT THEY WOULD LIKE TO PURCHASE//
         inquirer.prompt([{
            type: 'input',
            name: 'choice',
            message: msgPrompt},
            {
            type: 'input',       
            name: 'qty',
            message: '                            order quantity? ==> '    
        }]).then(function(val) {

                //SET THE VAR correct TO FALSE SO AS TO MAKE SURE THE USER INPUTS A VALID PRODUCT NAME//
                var correct = false;

                if(val.choice=="e" || val.choice=="exit"){
                    process.exit();
                } 

                //LOOPS THROUGH THE MYSQL TABLE TO CHECK THAT THE PRODUCT THEY WANTED EXISTS//
                for (var i = 0; i < res.length; i++) {  
                    correct = false;             	
	                //1. TODO: IF THE PRODUCT EXISTS, SET correct = true and ASK THE USER TO SEE HOW MANY OF THE PRODUCT THEY WOULD LIKE TO BUY//
	               	if (res[i].ItemID == parseInt(val.choice)) {
                        correct = true;         // item found
                        console.log("\n        Item Id '" + res[i].ItemID + "' - " + res[i].ProductName + " found.\n");
                    } 

                    //2. TODO: CHECK TO SEE IF THE AMOUNT REQUESTED IS LESS THAN THE AMOUNT THAT IS AVAILABLE//                       
	                 if (correct == true && (res[i].StockQuantity -val.qty) <  0) {
                         console.log("\n        Item #" + res[i].ItemID + " - " + res[i].ProductName + 
                            " - quantity " + val.qty + " is temporarily out of stock.\n" );
                        correct = false;
                        promptCustomer(res);
                        break;
                     }

                    //3. TODO: UPDATE THE MYSQL TO REDUCE THE StockQuanaity by the THE AMOUNT REQUESTED  - UPDATE COMMAND!
	                if (correct == true && res[i].StockQuantity >= 0) {
                        
                        perfUpdate(res, i, val.qty);
                        //console.log("\n   #3 Item #" + res[0].ItemID + " - " + res[0].ProductName + " quantity updated.\n");
                        //var newQty = res[i].StockQuantity - val.qty;
                        //    newQty = res[i].StockQuantity;


                        clearTheScreen();
                        displayHdr();                  
                        makeTable(); 
                        
                        console.log("\n          Item #" + res[i].ItemID + " - " + res[i].ProductName 
                            + " - qty " + val.qty + " * $" + res[i].Price +  " = " 
                            + "$" + (val.qty * res[i].Price) + " has been ordered." + "\n");

                        //makeTable(); 
                        break;
                    }


                    //4. TODO: SHOW THE TABLE again by calling the function that makes the table
                    // pgm will show table at end of loop

                    //IF THE PRODUCT REQUESTED DOES NOT EXIST, RESTARTS PROMPT//
                    //console.log("i=" + i + "  correct=" + correct + " res.length=" + res.length)
                    if (i == res.length - 1 && correct == false) {
                        console.log("\n      Item Id '" + val.choice + "' requested does not exist.  Please try again.\n");
                        promptCustomer(res);
                    }


                
                }  //  end of for loop

                correct = false;

            });
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function clearTheScreen() { 
// give the appearance of screen driven app rather than cmd line app
    if (clrScreen) {
      process.stdout.write('\033c'); // clear the screen 
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function displayHdr( ) {    
    clearTheScreen();       // make app look less like command line interaction

    //console.log("\n"); 
    console.log("Bamazon - BamazonCustomer.js");
 
    console.log("\n"); 
    console.log("          *********************************************************");
    console.log("          *                                                       *");
    console.log("          *                   B A M A Z O N                       *");
    console.log("          *                                                       *");
    console.log("          *           - - A Command Line Version - -              *");
    console.log("          *                                                       *");
    console.log("          *********************************************************");
    console.log("\n");
         
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function printTbl(res) {
    //var tab = "\t";
    //PRINTS THE TABLE TO THE CONSOLE WITH MINIMAL STYLING//
    //console.log("ItemID\tProduct Name\tDepartment Name\tPrice\t# In Stock");
    //console.log("--------------------------------------------------------");
    //FOR LOOP GOES THROUGH THE MYSQL TABLE AND PRINTS EACH INDIVIDUAL ROW ON A NEW LINE//
    //for (var i = 0; i < res.length; i++) {
    //    console.log(res[i].ItemID + tab + res[i].ProductName + tab + res[i].DepartmentName + tab + res[i].Price + tab + res[i].StockQuantity);
    //}
    //console.log("--------------------------------------------------------" );

    console.table(res);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function perfUpdate(res, index, qty) {
    //console.log("stock qty=" + res[index].StockQuantity);
    //console.log("qty=" + qty);

    //console.log("a");
    //var newQty = res[i].StockQuantity - val.qty;
    //    var newQty = res[i].StockQuantity;
    //console.log("newQty=" + newQty);
    connection.query("UPDATE products SET StockQuantity='"+(res[index].StockQuantity - qty)+"' WHERE ItemID='"+res[index].ItemID+"'", function(err, res) {
       if (err) throw err;
       //console.log("\n    Item #" + typeof(res[0].ItemID) );
       //console.log("b");
    }) 

}
