const express = require('express')
const bodyParser = require('body-parser');
const _ = require('lodash')
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://vinodbhati3326:vinodbhati001@cluster0.o7t49zz.mongodb.net/todolistDB");

const itemsSchema = ({name: String})

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item({name: "Welcome To Our Todo List"})
const item2 = new Item({name: "Hit + Button To Add Task"})

const item3 = new Item({name: "--Hit To Delete Task"})

const defaultitems = [item1, item2, item3];


const ListSchema = ({name: String, items: [itemsSchema]});

const List = new mongoose.model("List", ListSchema);


app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.get('/', async (req, res) => { /*let today = new Date()

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }

    let day = today.toLocaleDateString("en-US", options);*/


    const items = await Item.find({})


    if (items.length === 0) {

        const update = async function () {
            await Item.insertMany(defaultitems)
        }
        update();
        console.log(update);

        res.redirect("/");

    } else {
        res.render('list.ejs', {
            listTitle: 'Today',
            newlistItems: items
        })
        console.log(items[0].name);
    }


});


app.get("/:customListName", async (req, res) => {
    var customListName = _.capitalize(req.params.customListName)

    var listitems = await List.findOne({name: customListName})

    if (listitems) { // console.log("Variable is null")

        res.render('list.ejs', {
            listTitle: customListName,
            newlistItems: listitems.items
        })

        // res.render('list', {
        //     listTitle: customListName,
        //     newlistItems:
        // })


    } else { // console.log("Variable is not null");

        const NewItem = new List({name: customListName, items: defaultitems});

        await NewItem.save()
        // console.log(NewItem)

        const NewListitems = await List.findOne({name: customListName})

        // /    console.log(NewListitems.items);
        res.render('list.ejs', {
            listTitle: customListName,
            newlistItems: NewListitems.items
        })


    }

})


//       //Create a new list
//       const list = new List({
//         name: customListName,
//         items: defaultItems
//       });
//       list.save();
//       res.redirect("/" + customListName);
//     } else {
//       //Show an existing list

//       res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
//     }
// }
// });


app.post('/', async function (req, res) {

    const newTask = req.body.newItem
    const list = req.body.list;

    console.log(list);
    console.log(newTask);


    const ListItem = new Item({name: newTask})
    console.log(ListItem);

    if (req.body.list === "Today") {
        await ListItem.save()
        res.redirect("/")

    } else {
        const foundList = await List.updateMany({name: list},{$addToSet:{items:ListItem}});
        console.log(foundList);
        // await foundList.save();
        res.redirect("/" + list);


     } 


    /*

    items.push(item)

    console.log(items);

    res.redirect("/")*/
})


//     res.render("list", { listTitle: "Work List", newlistItems: workItems})

// })

// app.post("/work", function (req, res) {

//     const item = req.body.newItem;
//     workItems
// })


app.post("/delete", async function (req, res) {

    const checkedItemId = req.body.checkbox
    const checkpara = req.body.listName;
    console.log(checkpara);

    console.log(checkedItemId);

    if (checkpara === "Today"){
         const deleteed = await Item.findByIdAndRemove(checkedItemId);
         console.log(deleteed)
    }else{
        const deleteed = await List.updateMany({name:checkpara},{$pull:{items:{_id:checkedItemId}}});
        console.log(deleteed);
    } 

  

    res.redirect("/" + checkpara);


});


app.listen(5000, function () {
    console.log('server started on port 5000');
})
