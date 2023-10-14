import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import _ from 'lodash'
const app = express();
const port = 3000;
// const listOfTasksForToday = [];
const listOfTasksForWork = [];
//?retryWrites=true&w=majority
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
await mongoose.connect("mongodb+srv://admin-Nikol:Test123@cluster0.rszk58p.mongodb.net/todoListDB", { useNewUrlParser: true });
console.log("Connected to MongoDB");


const day = new Date().getDay();
const month = new Date().getMonth();
const date = new Date().getDate();
const year = new Date().getFullYear();
const dayA =['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const monthA =['January','February','March','April','May','June','July','August','September','October','November','December'];

const ItemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", ItemSchema);

const item1 = new Item({
  name: "Welcome to yout todolist",
});

const item2 = new Item({
  name: "Hit the + button to aff a new item.",
});

const item3 = new Item({
  name: "--> hit this to delete an item",
});

const Items = [item1,item2,item3];

const listSchema ={
  name:String,
  items:[ItemSchema]
}

const List=mongoose.model("List",listSchema);


app.get("/", async (req, res) => {
  console.log("Found the following items:");
  const items = await Item.find();
  console.log(items);
  if(items.length===0)
  {
    try {
        await Item.insertMany(Items);
        console.log("Successfully saved all the items.");
    } catch (error) {
        console.error("Error saving items:", error);
    }
    res.redirect("/");

  }
  else{
    res.render("index.ejs", {listTitle: "Today", tasks: items, day : dayA[day] , date: date  ,month: monthA[month] , year: year});
  }

});
  
  app.post("/", async(req, res) => {
  const itemName= req.body.task;
  const listName=req.body.list;
  const item = new Item({
    name: itemName,
  });
  if(listName === "Today")
  {
    item.save();
    res.redirect("/");
  }
  else{

    try {
      const foundList = await List.findOne({ name: listName });
      if (foundList) {
        foundList.items.push(item);
        await foundList.save();
        res.redirect("/" + listName);
      } else {
        console.log("List not found");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }



      // if (listOfTasksForToday[listOfTasksForToday.length - 1] !== req.body["task"] && req.body["task"] !== "") {
      //   listOfTasksForToday.push(req.body["task"]);
      // }
      // console.log(listOfTasksForToday);
      //res.render("index.ejs", { tasks: listOfTasksForToday, day : dayA[day] , date: date  ,month: monthA[month] , year: year});

    
  });

  app.post("/delete", async function (req, res) {
    const checkItemId = req.body.taskCheckBox;
    const listName = req.body.listName;
  
    if (listName === "Today") {
      try {
        const removedItem = await Item.findByIdAndRemove(checkItemId);
        if (removedItem) {
          console.log(`Item with ID ${checkItemId} removed successfully.`);
          res.redirect("/");
        } else {
          console.log(`Item with ID ${checkItemId} not found.`);
        }
      } catch (err) {
        console.error("Error removing item:", err);
        res.redirect("/");
      }
    } else {
      try {
        const foundList = await List.findOne({ name: listName });
        if (foundList) {
          foundList.items.pull(checkItemId);
          await foundList.save();
          res.redirect("/" + listName);
        } else {
          console.log(`List with name ${listName} not found.`);
          res.redirect("/");
        }
      } catch (err) {
        console.error("Error updating list:", err);
        res.redirect("/");
      }
    }
  });
  
  
  app.get("/:customListName", async (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
  
    try {
      const result = await List.findOne({ name: customListName });
      if (result) {
        res.render("index.ejs", { listTitle: result.name , tasks: result.items, day : dayA[day] , date: date  ,month: monthA[month] , year: year})
      } else {
        const list = new List({
          name: customListName,
          items: Items // Make sure `Items` is defined.
        });
        await list.save();
        res.redirect("/" + customListName)
      }
  
      // Further processing or rendering here.
    } catch (err) {
      console.error("Error:", err);
    }
  });
  


// app.get("/work", (req, res) => {
//     res.render("work.ejs", { tasks: listOfTasksForWork});
// });

//   app.post("/work", (req, res) => {
//     if (listOfTasksForWork[listOfTasksForWork.length - 1] !== req.body["task"] && req.body["task"] !== "") {
//         listOfTasksForWork.push(req.body["task"]);
//       }
//       console.log(listOfTasksForWork);
//     res.render("work.ejs", { tasks: listOfTasksForWork, clickedButton: 'work' });
//   });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
