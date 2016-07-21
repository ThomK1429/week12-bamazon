// BamazonCustomer.js

//DEPENDANCY FOR inquirer NPM PACKAGE
var inquirer  = require('inquirer');    // prompt processing api
var mysql     = require('mysql');			 // MYSQL

//var clrScreen = true;
var clrScreen = false;
var connection;

// MANAGER VIEW - heading - display ALL PRODUCT table fields
var prodHdrView01  = "\t  " + "Item\tProduct\t\tDepartment\tPrice" +  "\t     " + "Qty In";
var prodHdrView02  = "\t  " + "ID\tName\t\tName\t \t" + "  $" + "\t     " + "Stock";
var prodHdrView03  = "\t  " + "---------------------------------------------------------";

// CUSTOMER VIEW - heading - display PRODUCT table fields
var prodHdrView04  = "\t\t  " + "Item\tProduct\t\tPrice" +  "\t     " + "Qty In";
var prodHdrView05  = "\t\t  " + "ID\tName" + "\t\t" +  "  $"  +  "\t     " + "Stock";
var prodHdrView06  = "\t  " + "---------------------------------------------------------";

function createConnection() {
// create connection  to the mysql Bamazon db
connection = mysql.createConnection({
   	host: "localhost",
   	port: 3306,
   	user: "root", //Your username//
   	password: "tom", //Your password//
   	database: "Bamazon"
})
    console.log('connection.host1=' + connection.host);
}

createConnection();
connectProductsCustView();
//connectProductsManView();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function connectProductsCustView() {
		//CREATES THE CONNECTION WITH THE SERVER AND MAKES THE TABLE UPON SUCCESSFUL CONNECTION//
		connection.connect(function(err) {
    		if (err) {
       		 console.error("error connecting: " + err.stack);
    		}

    selectProductsCust();
    console.log('connection.host2=' + connection.host);
    connection.end();
		})
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function connectProductsManView() {
		//CREATES THE CONNECTION WITH THE SERVER AND MAKES THE TABLE UPON SUCCESSFUL CONNECTION//
		connection.connect(function(err) {
    		if (err) {
       		 console.error("error connecting: " + err.stack);
    		}

    selectProductsMan();
    connection.end();
		})
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


//FUNCTION CONTAINING ALL CUSTOMER PROMPTS//
var promptCustomer = function(res) {

	console.log("res=" + res[0].ItemID)  + " " + res[0].ProductName;
        //PROMPTS USER FOR WHAT THEY WOULD LIKE TO PURCHASE//
        inquirer.prompt([{
            type: 'input',
            name: 'choice',
            message: 'What would you like to purchase?'
        }]).then(function(val) {
        	console.log("val.choice=" + val.choice);


                //SET THE VAR correct TO FALSE SO AS TO MAKE SURE THE USER INPUTS A VALID PRODUCT NAME//
                var correct = false;
                //LOOPS THROUGH THE MYSQL TABLE TO CHECK THAT THE PRODUCT THEY WANTED EXISTS//
                for (var i = 0; i < res.length; i++) {                    	
	                //1. TODO: IF THE PRODUCT EXISTS, SET correct = true and ASK THE USER TO SEE HOW MANY OF THE PRODUCT THEY WOULD LIKE TO BUY//
	               	//2. TODO: CHECK TO SEE IF THE AMOUNT REQUESTED IS LESS THAN THE AMOUNT THAT IS AVAILABLE//                       
	                //3. TODO: UPDATE THE MYSQL TO REDUCE THE StockQuanaity by the THE AMOUNT REQUESTED  - UPDATE COMMAND!
	                //4. TODO: SHOW THE TABLE again by calling the function that makes the table
                }

                //IF THE PRODUCT REQUESTED DOES NOT EXIST, RESTARTS PROMPT//
                if (i == res.length && correct == false) {
                    promptCustomer(res);
                }
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

//FUNCTION TO GRAB THE PRODUCTS TABLE FROM THE DATABASE AND PRINT RESULTS TO CONSOLE//
function selectProductsCust() {
    //SELECTS ALL OF THE DATA FROM THE MYSQL PRODUCTS TABLE - SELECT COMMAND!
    connection.query('SELECT ItemID, ProductName, Price, StockQuantity FROM products', function(err, res) {
        if (err) throw err;

        displayHdr();

        //PRINTS THE TABLE TO THE CONSOLE WITH MINIMAL STYLING//


        // CUSTOMER VIEW - start - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        console.log("\n"); 
        console.log(prodHdrView04);
        console.log(prodHdrView05);
        console.log(prodHdrView06);       
        //FOR LOOP GOES THROUGH THE MYSQL TABLE AND PRINTS EACH INDIVIDUAL ROW ON A NEW LINE//
        for (var i = 0; i < res.length; i++) {
            console.log("\t\t   " + res[i].ItemID + "\t"  + res[i].ProductName  + 
            					   "\t\t" + res[i].Price + "\t     " + res[i].StockQuantity);
        }
        console.log(prodHdrView06);  
        // CUSTOMER VIEW - end - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 




        //RUNS THE CUSTOMER'S PROMPTS AFTER CREATING THE TABLE. SENDS res SO THE promptCustomer FUNCTION IS ABLE TO SEARCH THROUGH THE DATA//
        //promptCustomer(res);
    });
};  


//FUNCTION TO GRAB THE PRODUCTS TABLE FROM THE DATABASE AND PRINT RESULTS TO CONSOLE//
function selectProductsMan() {
    //SELECTS ALL OF THE DATA FROM THE MYSQL PRODUCTS TABLE - SELECT COMMAND!
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;

        displayHdr();

        //PRINTS THE TABLE TO THE CONSOLE WITH MINIMAL STYLING//

        // MANAGER VIEW - start - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        console.log("\n"); 
        console.log(prodHdrView01);
        console.log(prodHdrView02);
        console.log(prodHdrView03);       
        //FOR LOOP GOES THROUGH THE MYSQL TABLE AND PRINTS EACH INDIVIDUAL ROW ON A NEW LINE//
        for (var i = 0; i < res.length; i++) {
            console.log("\t   " + res[i].ItemID + "\t"  + res[i].ProductName + "\t\t" + res[i].DepartmentName + 
            					   "\t\t" + res[i].Price + "\t     " + res[i].StockQuantity);
        }
        console.log(prodHdrView03);  
        // MANAGER VIEW - end - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

        
        //RUNS THE CUSTOMER'S PROMPTS AFTER CREATING THE TABLE. SENDS res SO THE promptCustomer FUNCTION IS ABLE TO SEARCH THROUGH THE DATA//
        //promptCustomer(res);
    });
};