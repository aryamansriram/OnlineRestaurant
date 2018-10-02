var express = require("express")
var mysql = require("mysql")
var cors = require("cors");
app = express()

app.use(cors());

connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "Super1man2",
  database : "4Rivers"
})

connection.connect(function(err)
{
  if(err) throw err;
  console.log("Connected!");
  })

var username;

app.get("/selecteddishes",function(req,res){
  const data = req.query;

//  response_list = {}

count=0
for(x in data){


    connection.query("insert into customerorders set ?",{uname : username,dish: x, qty: data[x]},(err,result)=>{
      if(err) throw err;
    });
    console.log("Success");

}
console.log('data',data);
  var i =0;
  var promises = [];
  var upromises = [];
  for(x in data){

    connection.query("update menu set qty = ? where item = ?",[data[x],x]);
      //console.log(result);
      promises.push(new Promise((resolve, reject) => {
        connection.query("select * from menu where item = ?",[x], (err, result) => {
          if(err){
             reject(err);
           }else{
             resolve(result);
             console.log(result);
           }
        })
      })
    );

  }
  promises.push(new Promise((resolve, reject) => {
    connection.query("select sum(qty*price) as total from menu where qty > 0",(err,result)=>{
      if(err) throw reject(err);
      console.log(result);
      resolve(result);
    })
  }));

  console.log(promises.length);

  Promise.all(promises).then((result) => {
    res.send(result);
    // console.log(result);
  });

  connection.query("update menu set qty = NULL"),(err,result) =>{
    if(err) throw err;
  //  console.log(result);
  }
  //console.log(response_list)

})
app.get("/signup",function(req,res){
  console.log(req.query)
  connection.query("select count(email) as mailcount from customer where email = ?",req.query.email,function(err,result){
    if(err) throw err;
    console.log(result)
    if(result[0].mailcount==0)
    {
      connection.query("insert into customer set ?",req.query,function(err,result){
        if(err) throw err;
        console.log(result);



      })




    }
    else
    {

      res.send("Already a user please log in");
    }



  })



})

app.get("/login",function(req,res){
  //console.log(req.query)
  connection.query("select count(email) as mailcount from customer where email = ?",req.query.email,function(err,result){
    username = req.query.email;
    user = result[0].mailcount
    if(user>0)
    {
      connection.query("select password from customer where email = ?",req.query.email,function(err,result){
        console.log(result[0].password);
        pwd = result[0].password
        if(pwd == req.query.password)
        {
          res.send("Valid User");
        }
        else
        {
          res.send("Invalid Username/Password")
        }
      })
      //res.send("Valid User");
    }
    else
    {
      res.send("Invalid Username/Password")
    }

  })
})




// Data : {
// milkshake: 1,
//  asda: 2
// }
//


  //res.send(data);








app.listen(3000,function(){
  console.log("Listening to port 3000");
})
