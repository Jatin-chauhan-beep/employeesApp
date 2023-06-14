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

const { Client }=require("pg"); 
const client = new Client({
user: "postgres",
password: "EmployeeApp@123", 
database: "postgres",
port: 5432,
host: "db.drdhgvscnbtukqgrcdrq.supabase.co",
ssl: { rejectUnauthorized: false },
}); 
client.connect(function (res, error) {
console.log("Connected!!!");
});

app.get("/svr/employees",(req,res)=>{
    let department = req.query.department;
  let designation = req.query.designation;
  let gender = req.query.gender;
  let sql = "SELECT * FROM employees";
  let params = [];

  if (department) {
    sql += " WHERE department = $1";
    params.push(department);
  }

  if (designation) {
    if (params.length === 0) {
      sql += " WHERE designation = $1";
    } else {
      sql += " AND designation = $2";
    }
    params.push(designation);
  }

  if (gender) {
    if (params.length === 0) {
      sql += " WHERE gender = $1";
    } else {
      sql += " AND gender = $2";
    }
    params.push(gender);
  }

  client.query(sql, params, (err, result) => {
    if (err) res.status(404).send(err);
    else {
      res.send(result.rows);
    }
  });
});

app.get("/svr/employees/department/:department",(req,res)=>{
    let dep=req.params.department;
    let sql="SELECT * FROM employees WHERE department=$1";
    client.query(sql,[dep],(err,result)=>{
        if(err) res.status(404).send(err);
        else {
            res.send(result.rows);
        }
    });
})

app.get("/svr/employees/designation/:designation",(req,res)=>{
    let dep=req.params.designation;
    let sql="SELECT * FROM employees WHERE designation=$1";
    client.query(sql,[dep],(err,result)=>{
        if(err) res.status(404).send(err);
        else {
            res.send(result.rows);
        }
    });
});

app.post("/svr/employees",(req,res)=>{
    let body=Object.values(req.body);
    console.log(body);
    let sql=`INSERT INTO employees(empCode, name, department, designation, salary, gender) VALUES ($1,$2,$3,$4,$5,$6)`;
    client.query(sql,body,(err,result)=>{
        if(err) res.status(404).send(err);
        else res.send("insertion successful");
    });
});

app.put("/svr/employees/:empcode",(req,res)=>{
    let body=req.body;
    let id=+req.params.empcode;
    let sql="UPDATE employees SET name = $1, department = $2, designation = $3, salary = $4, gender=$5 WHERE empcode =$6";
    client.query(sql,[body.name,body.department,body.designation,body.salary,body.gender,id],(err)=>{
        if(err) res.status(404).send(err);
        else res.send(body);
    });
});

app.delete("/svr/employees/:empcode",(req,res)=>{
    let id=+req.params.empcode;
    let sql="DELETE FROM employees WHERE empcode=$1";
    client.query(sql,[id],(err)=>{
        if(err) res.status(404).send(err);
        else res.send("deleted");
    });
});
