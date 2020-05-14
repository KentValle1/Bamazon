var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password: "TreeHugger10!",
    database:"bamazon"
})

connection.connect(function(err){
    if (err) throw err;
    console.log("connection successful");
    makeTable();
})

var makeTable = function(){
    connection.query("SELECT*FROM products", function(err,res){
        for(var i=0; i<res.length; i++){
            console.log(res[i].itemid+ " || "+res[i].productname+" || "+res[i].departmentname+" || "+res[i].price+" || "+res[i].stockquantity+" \n");
        }
    promptCustomer(res);
    }
    )
}

var promptCustomer = function(res){
    inquirer.prompt([{
        type:"input",
        name:"choice",
        message:"What're you buy'n, Stranger? ('Q' quits the app)"
    }]).then(function(answer){
        var correct = false;
        if(answer.choice.toUpperCase()=="Q"){
            process.exit();
        }
        for(var i=0;i<res.length;i++){
            if(res[i].productname==answer.choice){
                correct=true;
                var product=answer.choice;
                var id=i;
                inquirer.prompt({
                    type:"input",
                    name:"quantity",
                    message:"How many you want, Stranger?",
                    validate: function(value){
                        if(isNaN(value)==false){
                            return true;
                        } else{
                            return false;
                        }
                    }
                }).then(function(answer){
                    if((res[id].stockquantity-answer.quantity)>0){
                        connection.query("UPDATE procucts SET stockquantity='"+(res[id].stockquantity-answer.quantity)+ "' WHERE productname='"+product+"'",function(err,res2){
                            console.log("HEH HEH HEH HEH, Thank ya!");
                            makeTable();
                        })   
                    } else{
                        console.log("Don't have any of that, Stranger!")
                    }
                })
            }
          
        }
        if(i==res.length && correct==false){
            console.log("Not here, Staranger! ");
            promptCustomer(res);
        }
    })
}