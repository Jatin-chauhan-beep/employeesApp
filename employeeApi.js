let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header(
"Access-Control-Allow-Methods",
"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
);
res.header(
"Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept"
);
next();
});
const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));
let mysql=require("mysql");
let connData={
    host : "localhost",
    user : "root",
    password:"",
    database:"testdb3",
};

app.get("/svr/employees",(req,res)=>{
    let department = req.query.department;
  let designation = req.query.designation;
  let gender = req.query.gender;
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM employees";
  let params = [];

  if (department) {
    sql += " WHERE department = ?";
    params.push(department);
  }

  if (designation) {
    if (params.length === 0) {
      sql += " WHERE designation = ?";
    } else {
      sql += " AND designation = ?";
    }
    params.push(designation);
  }

  if (gender) {
    if (params.length === 0) {
      sql += " WHERE gender = ?";
    } else {
      sql += " AND gender = ?";
    }
    params.push(gender);
  }

  connection.query(sql, params, (err, result) => {
    if (err) res.status(404).send(err);
    else {
      let employees = JSON.parse(JSON.stringify(result));
      res.send(employees);
    }
  });
});

app.get("/svr/employees/department/:department",(req,res)=>{
    let dep=req.params.department;
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM employees WHERE department=?";
    connection.query(sql,dep,(err,result)=>{
        if(err) res.status(404).send(err);
        else {
            let employees=JSON.parse(JSON.stringify(result));
            res.send(employees);
        }
    });
})

app.get("/svr/employees/designation/:designation",(req,res)=>{
    let dep=req.params.designation;
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM employees WHERE designation=?";
    connection.query(sql,dep,(err,result)=>{
        if(err) res.status(404).send(err);
        else {
            let employees=JSON.parse(JSON.stringify(result));
            res.send(employees);
        }
    });
});

app.post("/svr/employees",(req,res)=>{
    let body=req.body;
    let connection=mysql.createConnection(connData);
    let sql="INSERT INTO employees(empCode, name, department, designation, salary, gender) VALUES(?,?,?,?,?,?)";
    connection.query(sql,[body.empCode,body.name,body.department,body.designation,body.salary,body.gender],(err)=>{
        if(err) res.status(404).send(err);
        else res.send(body);
    });
});

app.put("/svr/employees/:empCode",(req,res)=>{
    let body=req.body;
    let id=+req.params.empCode;
    let connection=mysql.createConnection(connData);
    let sql="UPDATE employees SET name = ?, department = ?, designation = ?, salary = ?, gender=? WHERE empCode = ?";
    connection.query(sql,[body.name,body.department,body.designation,body.salary,body.gender,id],(err)=>{
        if(err) res.status(404).send(err);
        else res.send(body);
    });
});

app.delete("/svr/employees/:empCode",(req,res)=>{
    let id=+req.params.empCode;
    let connection=mysql.createConnection(connData);
    let sql="DELETE FROM employees WHERE empCode=?";
    connection.query(sql,id,(err)=>{
        if(err) res.status(404).send(err);
        else res.send("deleted");
    });
});
