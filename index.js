import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const listOfTasksForToday = [];
const listOfTasksForWork = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const day = new Date().getDay();
const month = new Date().getMonth();
const date = new Date().getDate();
const year = new Date().getFullYear();
const dayA =['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const monthA =['January','February','March','April','May','June','July','August','September','October','November','December'];



app.get("/", (req, res) => {
    res.render("index.ejs", { tasks: listOfTasksForToday, day : dayA[day] , date: date  ,month: monthA[month] , year: year});
});
  
  app.post("/", (req, res) => {
      if (listOfTasksForToday[listOfTasksForToday.length - 1] !== req.body["task"] && req.body["task"] !== "") {
        listOfTasksForToday.push(req.body["task"]);
      }
      console.log(listOfTasksForToday);
      res.render("index.ejs", { tasks: listOfTasksForToday, day : dayA[day] , date: date  ,month: monthA[month] , year: year});

    
  });
  
app.get("/work", (req, res) => {
    res.render("work.ejs", { tasks: listOfTasksForWork});
});
  app.post("/work", (req, res) => {
    if (listOfTasksForWork[listOfTasksForWork.length - 1] !== req.body["task"] && req.body["task"] !== "") {
        listOfTasksForWork.push(req.body["task"]);
      }
      console.log(listOfTasksForWork);
    res.render("work.ejs", { tasks: listOfTasksForWork, clickedButton: 'work' });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
