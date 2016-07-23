//INITIALIZES THE NPM PACKAGES USED//
var mysql    = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var clrScreen = true;

//INITIALIZES THE CONNECTION VARIABLE TO SYNC WITH A MYSQL DATABASE//
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username//
    password: "tom", //Your password//
    database: "Bamazon"
})


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
        console.table(res);
        //PRINTS THE TABLE TO THE CONSOLE WITH MINIMAL STYLING//
        //var tab = "\t";
        //console.log("ItemID\tProduct Name\tDepartment Name\tPrice\t# In Stock");
        //console.log("--------------------------------------------------------");
        //FOR LOOP GOES THROUGH THE MYSQL TABLE AND PRINTS EACH INDIVIDUAL ROW ON A NEW LINE//
        //for (var i = 0; i < res.length; i++) {
        //    console.log(res[i].ItemID + tab + res[i].ProductName + tab + res[i].DepartmentName + tab + res[i].Price + tab + res[i].StockQuantity);
        //}
        //console.log("--------------------------------------------------------");
        console.log("\n");
        //RUNS THE CUSTOMER'S PROMPTS AFTER CREATING THE TABLE. SENDS res SO THE promptCustomer FUNCTION IS ABLE TO SEARCH THROUGH THE DATA//
        promptCustomer(res);
    });
};

//FUNCTION CONTAINING ALL CUSTOMER PROMPTS//
var promptCustomer = function(res) {
        //PROMPTS USER FOR WHAT THEY WOULD LIKE TO PURCHASE//
        inquirer.prompt([{
            type: 'input',
            name: 'choice',
            message: 'What item would you like to order? ==> '},
            {
            type: 'input',       
            name: 'qty',
            message: '          and your order quantity? ==> '    
        }]).then(function(val) {

                //SET THE VAR correct TO FALSE SO AS TO MAKE SURE THE USER INPUTS A VALID PRODUCT NAME//
                var correct = false;

                //console.log("res.length1=" + res.length);
                //console.log("val.choice="  + val.choice);
                //console.log("val.qty="     + val.qty);

                //LOOPS THROUGH THE MYSQL TABLE TO CHECK THAT THE PRODUCT THEY WANTED EXISTS//
                for (var i = 0; i < res.length; i++) {     
                    correct = false;

	                //1. TODO: IF THE PRODUCT EXISTS, SET correct = true and ASK THE USER TO SEE HOW MANY OF THE PRODUCT THEY WOULD LIKE TO BUY//
                    //console.log(typeof res[i].ItemID);
                    if (res[i].ItemID == parseInt(val.choice)) {
                        correct = true;
                        //console.log("Item Id=" + res[i].ItemID + " - " + res[i].ProductName + " found.");
                    } 
	               	//2. TODO: CHECK TO SEE IF THE AMOUNT REQUESTED IS LESS THAN THE AMOUNT THAT IS AVAILABLE// 
                    //console.log( typeof res[i].StockQuantity);
                    //console.log("correct=" + correct);
                    //console.log("val.qty=" + val.qty);
                    if (correct == true && res[i].StockQuantity >= parseInt(val.qty)) {
                        console.log("\n");
                        console.log("    Item #" + res[i].ItemID + " - " + res[i].ProductName 
                            + " - quantity " + val.qty + " has been ordered.");


                        var newQty = res[i].StockQuantity - val.qty;
                        connection.query("UPDATE products SET StockQuantity='"+newQty+"' WHERE ItemId='"+val.choice+"'", function(err, res) {
                            if (err) throw err;
                        });
                        connection.query('SELECT * FROM `products` WHERE `ItemID` = ?', [val.choice], function (err, res) {
                            if (err) throw err;
                            console.table(res);
                        });

                        //"UPDATE MyGuests SET lastname='Doe' WHERE id=2";
                        
                    }

                    if (correct == true && res[i].StockQuantity <= 0) {
                        console.log("\n");
                        console.log("    Item #" + res[i].ItemID + " - " + res[i].ProductName 
                            + " - quantity " + val.qty + " is temporarily out of stock.");
                        // console.log("  Item StockQuanaity is sufficient : i=" + i + " " + res[i].ProductName );
                    }

	                //3. TODO: UPDATE THE MYSQL TO REDUCE THE StockQuanaity by the THE AMOUNT REQUESTED  - UPDATE COMMAND!
	                //4. TODO: SHOW THE TABLE again by calling the function that makes the table
                    //console.log(res[i].ItemID + tab + res[i].ProductName + tab + res[i].DepartmentName + tab + res[i].Price + tab + res[i].StockQuantity);
                    //console.log("i=" + i + res[i].ProductName
                   //console.log("i=" + i  + " NF");
                }

                //IF THE PRODUCT REQUESTED DOES NOT EXIST, RESTARTS PROMPT//
               //if (i == res.length && correct == false) {
                    console.log("\n");
                    promptCustomer(res);
                //}
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
    //console.log("Bamazon - BamazonCustomer.js" + hintWord);
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