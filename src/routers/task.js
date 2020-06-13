const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

/*******************
 * Creating tasks
 *******************/
router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try 
    {
        await task.save()
        res.status(201).send(task)
    }
    catch (error)
    {
        res.status(400).send(error)
    }

})

/*******************************
 * Reading tasks
 * GET /tasks?completed=<param>
 * 
 * Pagination
 * limit skip
 * GET /tasks?limit=10&skip=0
 * ^^first page^^
 * GET /tasks?limit=10&skip=10
 * ^^second page^^
 * 
 * Sorting
 * GET /tasks?sortBy=createdAt_asc
 *    _ and : are the same   or :desc
 *******************************/
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed)
    {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':') // or '_'
        // parts is an array of the split up query

        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }   

    try 
    {
        // 2 ways to do this:

        // 1: find by user id
        //const tasks = await Task.find({owner: req.user._id})
        //res.send(tasks)

        // 2: populating the user with the tasks
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort  // ascending 1 descending -1
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }
    catch (error)
    {
        res.status(500).send()
    }

})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try 
    {
        //const task = await Task.findById(_id) // before adding authentication
        const task = await Task.findOne({_id, owner: req.user._id})

        if (!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (error)
    {
        res.status(500).send()
    }


})

/***************
 * Update task
 ***************/
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(
        (element) => allowedUpdates.includes(element))

    if (!isValidOperation)
    {
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try
    {
        const task = await Task.findOne({_id: req.params.id, 
                                        owner: req.user._id})
        //const task = await Task.findById(req.params.id)


        // const task = await Task.findByIdAndUpdate(
        //                         req.params.id,
        //                         req.body,
        //                         {new: true, 
        //                         runValidators: true})

        if (!task)
        {
            return res.status(404).send()
        }
        updates.forEach((element) => task[element] = req.body[element])
        await task.save()

        res.send(task)
    }
    catch (error)
    {
        res.status(400).send(error)
    }
})
 
/**************
 * Delete task
 **************/
router.delete('/tasks/:id', auth, async (req, res) => {
    try
    {
        const task = await Task.findOneAndDelete({_id: req.params.id, 
                                                owner: req.user._id})
        //const task = await Task.findByIdAndDelete(req.params.id)
        if (!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (error)
    {
        res.status(500).send()
    }
})

module.exports = router