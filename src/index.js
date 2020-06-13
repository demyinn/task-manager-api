const express = require('express')
require('./db/mongoose')   // connects to database
// const User = require('./models/user') // accesses user module
// const Task = require('./models/task') // accesses task module
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT

app.use(express.json())    // parse to json file
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})













// /******************
//  * Creating Users
//  ******************/
//                 // req input from postman 
//                 // res output from database
// app.post('/users', async (req, res) => {
//     const user = new User(req.body)

//     try 
//     {
//         await user.save()
//         res.status(201).send(user)
//     } 
//     catch (error)
//     {
//         res.status(400).send(error)
//     }

//     // user.save().then(() => {
//     //     res.status(201).send(user);
//     // }).catch((error) => {
//     //     // res.status(400);
//     //     // res.send(error);
//     //     res.status(400).send(error);
//     // });
// })

// /******************
//  * Reading users
//  ******************/
// app.get('/users',  async (req, res) => {
//     try
//     {
//         const users = await User.find({})
//         res.send(users)
//     }
//     catch
//     {
//         res.status(500).send()
//     }
//     // User.find({}).then((users) => {
//     //     res.send(users);
//     // }).catch((error) => {
//     //     res.status(500).send();
//     // });
// })

// app.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     /* Option 1: using async/await */
//     try
//     {
//         const user = await User.findById(_id)
//         if (!user)
//         {
//             res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch (error)
//     {
//         res.status(500).send()
//     }
//     /* Option 2: using promise chaining */
//     // User.findById(_id).then((user) => {
//     //     if (!user)
//     //     {
//     //         return res.status(404).send();
//     //     }

//     //     res.send(user);
//     // }).catch((error) => {
//     //     res.status(500).send();
//     // });
// })

// /*******************
//  * Updating user
//  *******************/
// app.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((element) => 
//         allowedUpdates.includes(element))

//     if (!isValidOperation)
//     {
//         return res.status(400).send({error: 'Invalid updates!'})
//     }
//     try
//     {
//         const user = await User.findByIdAndUpdate(
//                                     req.params.id,
//                                     req.body,
//                                     {new: true,
//                                     runValidators: true})
//         if (!user)
//         {
//             return res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch (error)
//     {
//         res.status(400).send(error)
//     }
// })

// /*****************
//  * Delete user
//  *****************/
// app.delete('/users/:id', async (req, res) => {
//     try
//     {
//         const user = await User.findByIdAndDelete(req.params.id)
//         if (!user)
//         {
//             return res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch (error)
//     {
//         res.status(500).send()
//     }
// })

//  /*******************
//  * Creating tasks
//  *******************/
// app.post('/tasks', async (req, res) => {
//     const task = new Task(req.body)

//     try 
//     {
//         await task.save()
//         res.status(201).send(task)
//     }
//     catch (error)
//     {
//         res.status(400).send(error)
//     }

//     // task.save().then(() => {
//     //     res.status(201).send(task);
//     // }).catch((error) => {
//     //     res.status(400).send(error);
//     // });
// })

// /*****************
//  * Reading tasks
//  *****************/
// app.get('/tasks', async (req, res) => {
//     try 
//     {
//         const tasks = await Task.find({})
//         res.send(tasks)
//     }
//     catch (error)
//     {
//         res.status(500).send()
//     }

//     // Task.find({}).then((tasks) => {
//     //     res.send(tasks);
//     // }).catch((error) => {
//     //     res.status(500).send();
//     // });
// })

// app.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id

//     try 
//     {
//         const task = await Task.findById(_id)
//         if (!task)
//         {
//             return res.status(404).send()
//         }
//         res.send(task)
//     }
//     catch (error)
//     {
//         res.status(500).send()
//     }

//     // Task.findById(_id).then((task) => {
//     //     if (!task)
//     //     {
//     //         return res.status(404).send();
//     //     }

//     //     res.send(task);
//     // }).then((error) => {
//     //     res.status(500).send();
//     // });
// })

// /***************
//  * Update task
//  ***************/
// app.patch('/tasks/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every(
//         (element) => allowedUpdates.includes(element))

//     if (!isValidOperation)
//     {
//         return res.status(400).send({error: 'Invalid updates!'})
//     }
//     try
//     {
//         const task = await Task.findByIdAndUpdate(
//                                 req.params.id,
//                                 req.body,
//                                 {new: true, 
//                                 runValidators: true})
//         if (!task)
//         {
//             return res.status(404).send()
//         }
//         res.send(task)
//     }
//     catch (error)
//     {
//         res.status(400).send(error)
//     }
// })
 
// /**************
//  * Delete task
//  **************/
// app.delete('/tasks/:id', async (req, res) => {
//     try
//     {
//         const task = await Task.findByIdAndDelete(req.params.id)
//         if (!task)
//         {
//             return res.status(404).send()
//         }
//         res.send(task)
//     }
//     catch (error)
//     {
//         res.status(500).send()
//     }
// })

// app.listen(port, () => {
//     console.log('Server is up on port ' + port)
// })