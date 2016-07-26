// Week of 12 HW: Node.js & MySQL
// Tom Keel - due 7/24/2016
//
// NPM, MySQL, Javascript
// Challenge #2 - Manager View 
//
//


//INITIALIZES THE NPM PACKAGES USED//
var mysql    = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var clrScreen = true;

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

    dispHdrAndMenu();
    //clearTheScreen();
    //displayHdr();
    //displayMenu();

    promptManager();



    //process.exit();
})  // connect end

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

    //FUNCTION CONTAINING ALL CUSTOMER PROMPTS//
		var promptManager = function(res) {
    //PROMPTS USER FOR WHAT THEY WOULD LIKE TO PURCHASE//
        inquirer.prompt([{
          type: 'input',
          name: 'choice',
          message: "Enter your selection (1-5) to process..." 
          
        }]).then(function(val) {

        	switch(parseInt(val.choice)) {
    				case 1:
        			option01();		// View products for sale
        			break;
    				case 2:
        			option02();		// Display products w/ inventory less than 5 items
        			break;
        		case 3:
        			option03();		// Update product inventory amount
        			break
        		case 4:
        			option04();		// Add a new product
        			break;        		
            case 5:
            	option05();		// end the program - return to the os
        			break;
     				default:
     					console.log("\n   " + val.choice + " is an invalid selection. \n   Enter a number between 1 - 5.\n")
        			promptManager();
					}  
					//promptManager();     	
        });	

    }  // inquire end 


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function clearTheScreen() { 
// give the appearance of screen driven app rather than cmd line app
    if (clrScreen) {
      process.stdout.write('\033c'); // clear the screen 
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function displayHdr( ) {    
    //clearTheScreen();       // make app look less like command line interaction

    console.log("\n"); 
    console.log("Bamazon - BamazonManager.js");
 
    console.log("\n"); 
    console.log("          *********************************************************");
    console.log("          *                                                       *");
    console.log("          *                   B A M A Z O N                       *");
    console.log("          *                                                       *");
    console.log("          *           - - A Command Line Version - -              *");
    console.log("          *                                                       *");
    console.log("          *********************************************************");
    //console.log("\n");
         
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function dispHdrAndMenu( ) {
    clearTheScreen();
    displayHdr();
    displayMenu();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


function displayMenu( ) {    

    console.log("          *                                                       *");
    //console.log("          *                                                       *");
    console.log("          *                                                       *");
    console.log("          *             M A N A G E R ' S    M E N U              *");
    console.log("          *                                                       *");
    console.log("          *                                                       *");
    console.log("          *              1) View Products for Sale                *");
    console.log("          *                                                       *");
    console.log("          *              2) View Low Inventory                    *");
    console.log("          *                                                       *");
    console.log("          *              3) Add to Inventory                      *");
    console.log("          *                                                       *");
    console.log("          *              4) Add new product                       *");
    console.log("          *                                                       *");
    console.log("          *              5) Quit / End / Finish / Go West         *");
    console.log("          *                                                       *");
    console.log("          *                                                       *");
    console.log("          *********************************************************");
    console.log("\n");
         
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function option01() {					// View products for sale
	connection.query('SELECT * FROM products', function(err, res) {
      if (err) throw err;
      dispHdrAndMenu( );
      console.log("\n              - - Products for sale - - \n");
      console.table(res);
      promptManager();
  })
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function option02() {					// Display products w/ inventory less than 5 items
	connection.query('SELECT * FROM products where StockQuantity < 5', function(err, res) {
      if (err) throw err;
      dispHdrAndMenu( );
      console.log("\n           - - Products w/ inventory < 5 - - \n");
      console.table(res);
      promptManager();
  })
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function option03() {					// Update the inventory amount
	console.log("\n      - - Update a product inventory amount, follow the prompts ... - - \n");
	inquirer.prompt([{
        type: 'input',
        name: 'ItemID',
        message: "Enter item id : "}, 

       {
        type: 'input',
        name: 'prodInvAmt',
        message: "Enter product inventory amount : "  
          
        }]).then(function(val) {
        	 connection.query("UPDATE products SET StockQuantity='"+val.prodInvAmt+"' WHERE ItemID='"+val.ItemID+"' ", function(err, res) {
        	 if (err) throw err;
        	 console.log("Product Inventory updated. ");
        	 promptManager();
        	 })

        })

	
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function option04() {					// Add a new product

	console.log("\n      - - Add a new product, follow the prompts ... - - \n");
	inquirer.prompt([{
          type: 'input',
          name: 'prodName',
          message: "Enter product name : "}, 
           
          {
          type: 'input',
          name: 'prodDept',
          message: "Enter department name : "}, 

          {
          type: 'input',
          name: 'prodPrice',
          message: "Enter product price n: "},  

          {
          type: 'input',
          name: 'prodInvAmt',
          message: "Enter product inventory amount : "
          
        }]).then(function(val) {

        	var post  = {
  						ProductName: val.prodName,
  						DepartmentName: val.prodDept,
 							Price: parseFloat(val.prodPrice),
 							StockQuantity: parseInt(val.prodInvAmt)
					};


					console.log("val.prodPrice type=" + (typeof val.prodPrice) );
					// validate the input amounts - start
					if (val.prodPrice >= 0) { 
					} else {
						 console.log("The product price was INVALID.  Its value was set to zero. ")
						 val.prodPrice  = "0.0";
						}

					if (val.prodInvAmt >= 0) {
					} else {
						console.log("The product inventory amt.  was INVALID. Its value was set to zero. ");
							val.prodInvAmt = "0.0";
					}
				 
					// validate the input amounts - end

					// Add/Insert a new product
					connection.query('INSERT INTO products SET ?', post, function (err, result) {
        		if (err) throw err;
       				//console.log("\n    Item #" + typeof(res[0].ItemID) );
       				//console.log("b");
    				}) 

        	    //dispHdrAndMenu( );
      
      //console.table(res);
      promptManager();

   			})
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function option05() {					// End the program, return to the OS
	  console.log("\nThank you for using BamazonManager. ");
    console.log("Manager's View end. "); 
    process.exit();		// End this javascript program
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 