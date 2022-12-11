const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express();

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));
app.use(cors({ origin: 'http://localhost:3000' }))

mongoose
.connect("mongodb+srv://spike:npoog0101@cluster0.52okq1r.mongodb.net/?retryWrites=true&w=majority")
.catch((err) => console.log(err));

//checkout



//accountcreation and login

const accountSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    profilepicture: { type: String },
})

const Account = mongoose.model("Account", accountSchema)

app.get("/", (req, res) => {
    return("test")
});

app.post("/register", (req, res) => {
    Account.create({
        username: req.body.username,
        password: req.body.password
    }). then(doc => console.log(doc))
    .catch(err => console.log(err));
})

app.post("/isnameregistered", (req, res) => {
    const findname = req.body.username
    Account.find({username: findname}, (error, data) => {
        if(error) {
            console.log(error)
        } else {
            console.log(data)
            if (data.length < 1) {
                res.json(true)
            } else {
                res.json(false)
            }
        }
    })
})

app.post("/login", (req, res) => {
    const findname = req.body.username
    const checkpass = req.body.password
    Account.find({username: findname, password: checkpass}, (error, data) => {
        if(error) {
            console.log(error)
        } else {
            console.log(data)
            if (data.length < 1) {
                console.log("Incorrect Password or Username")
                res.json(false)
            } else {
                console.log("Logged in")
                res.json(true)
            }
        }
    })
})

app.post("/changebio", (req, res) => {
    const finduser = req.body.user
    const newbio = req.body.bio
    console.log(finduser, newbio)
    Account.findOneAndUpdate({username: finduser}, {bio: newbio}, {new: true})
    .then(user => {
        
    })
    .catch(err => {
        console.log(err);
    })
})

app.post("/getbio", (req, res) => {
    const finduser = req.body.user

    Account.find({username: finduser}).select('bio').then(results => {
        res.json(results);
    })
})

app.post("/changeprofilepic", (req, res) => {
    
    const finduser = req.body.user
    const newpfp = req.body.profilepicture
    
    Account.findOneAndUpdate({username: finduser}, {profilepicture: newpfp}, {new: true})
    .catch(err => {
        console.log(err);
    }) 
})

app.post("/getprofilepic", (req, res) => {
    const finduser = req.body.user
    Account.find({username: finduser}).select('profilepicture').then(results => {
        res.json(results);
    })
})



//chatschmea creation/read/update/delete

const messageSchema = mongoose.Schema({
    from: { type: String, required: true},
    messagecontent: { type: String, required: true },
})

const Message = mongoose.model("Message", messageSchema)

// const ChatroomMessage = mongoose.model("")

app.post("/sendmessage", (req, res) => {
    Message.create({
        from: req.body.from,
        messagecontent: req.body.chat
    }). then(doc => console.log(doc))
    .catch(err => console.log(err));
});


app.post("/sendmessage/:room", (req, res) => {
    const room = req.params.room
    try {
    const NewChatroom = mongoose.model(room, messageSchema)
    NewChatroom.create({
        from: req.body.from,
        messagecontent: req.body.chat
    }). then(doc => console.log(doc))
    .catch(err => console.log(err));
    }
    catch {
        db.room.create({
            from: req.body.from,
            messagecontent: req.body.chat
        }). then(doc => console.log(doc))
        .catch(err => console.log(err));
    }
});


app.get("/messages", (req, res) => {
    Message.find()
    .then((items) => res.json(items))
    .catch((err) => console.log(err))
});

app.get("/messages/:room", (req, res) => {
    const room = req.params.room
    try {
    const NewChatroom = mongoose.model(room, messageSchema)
    NewChatroom.find()
    .then((items) => res.json(items))
    .catch((err) => console.log(err)) 
    } catch {
    const db = mongoose.connection;
    db.room.find()
    .then((items) => res.json(items))
    .catch((err) => console.log(err)) 
    }
});

const chatroomSchema = mongoose.Schema({
    chatroomname: { type: String, required: true},
})

const Chatroom = mongoose.model("Chatroom", chatroomSchema)

app.post("/createchatroom", (req, res) => {
    console.log(req.body)

    const messageSchema = mongoose.Schema({
        from: { type: String, required: true},
        messagecontent: { type: String, required: true }
    })
    const NewChatroom = mongoose.model(`${req.body.chatroomname}`, messageSchema)


    Chatroom.create({
        chatroomname: req.body.chatroomname
    }). then(doc => console.log(doc))
    .catch(err => console.log(err));
});


app.get("/chatrooms", (req, res) => {
    Chatroom.find()
    .then((items) => res.json(items))
    .catch((err) => console.log(err))
});

const postSchema = mongoose.Schema({
    sender: { type: String, required: true},
    title: { type: String, required: true, unique: true},
    description: { type: String, required: true},
    image: String,
    likes: Number,
    peoplewholiked: [String],
})

const Post = mongoose.model("Post", postSchema)

app.get("/", (req, res) => {
    res.send("Express is here");
});

app.post("/create", (req, res) => {
    Post.create({
        sender: req.body.sender,
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
    }). then(doc => console.log(doc))
    .catch(err => console.log(err));
});


app.post("/likepost", (req, res) => {
    const poster = req.body.sender
    const finduser = req.body.user
    const title = req.body.title
    console.log('test')

    Post.findOne({sender: poster, title: title}, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            if (data) {
                // finduser is in peoplewholiked
                if (data.peoplewholiked) {
                    console.log("people who liked:", data.peoplewholiked)
                    if (data.peoplewholiked.includes(finduser)) {
                        res.json(false);
                    } else {
                        console.log('liked')
                Post.findOneAndUpdate({sender: poster, title: title}, {$inc:{likes: 1}}, {new: true})
                .catch(err => {
                    console.log(err);
                }) 
                Post.findOneAndUpdate({sender: poster, title:title}, {$push: {peoplewholiked: finduser}}, {new: true})
                .catch(err => {
                    console.log(err);
                }) 
                    }  
                }
            }
            else {
                
            }
        }
    });
});


app.delete("/delete/:id", (req, res) => {
    Post.findByIdAndDelete({_id: req.params.id})
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
    });

app.get("/posts", (req, res) => {
    Post.find()
    .then((items) => res.json(items))
    .catch((err) => console.log(err))
});


app.listen(3001, () =>
  console.log('Example app listening on port 3001!'),
);