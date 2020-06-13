const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')
const router = new express.Router()

/******************
 * Creating users
 ******************/
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try 
    {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } 
    catch (error)
    {
        res.status(400).send(error)
    }
})

/*****************
 * Login
 *****************/
router.post('/users/login', async (req, res) => {
    try
    {
        const user = await User.findByCredentials(req.body.email,
                                                    req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch (error)
    {
        res.status(400).send()
    }
})

/***************
 * Log out
 ***************/
router.post('/users/logout', auth, async (req, res) => {
    try 
    {
        req.user.tokens = req.user.tokens.filter((element) => {
            return element.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch (error)
    {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try 
    {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (error)
    {
        res.status(500).send()
    }
})

/******************
 * Reading users
 * Now repurposed 
 * to find profile
 ******************/
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    // try
    // {
    //     const users = await User.find({})
    //     res.send(users)
    // }
    // catch
    // {
    //     res.status(500).send()
    // }
})

// No longer need this
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
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
// })

/*******************
 * Updating user
 *******************/
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((element) => 
        allowedUpdates.includes(element))

    if (!isValidOperation)
    {
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try
    {
        //const user = await User.findById(req.params.id)
        
        updates.forEach((element) => req.user[element] = req.body[element])

        await req.user.save()

        // const user = await User.findByIdAndUpdate(
        //                             req.params.id,
        //                             req.body,
        //                             {new: true,
        //                             runValidators: true})

        res.send(req.user)
    }
    catch (error)
    {
        res.status(404).send(error)
    }
})

/*****************
 * Delete user
 *****************/
router.delete('/users/me', auth, async (req, res) => {
    try
    {
        // const user = await User.findByIdAndDelete(req.params._id)
        // if (!user)
        // {
        //     return res.status(404).send()
        // }
        
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }
    catch (error)
    {
        res.status(500).send()
    }
})

/************************
 * Upload profile picutre
 ************************/
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        // Regular expression
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            callback(new Error ('Please upload an image'))
        }
        callback(undefined, true)
    }  
})

router.post('/users/me/avatar', auth, upload.single('avatar'), 
async (req, res) => {
    // This allows us to standardize the photos
    // Photos will be converted to png and resized
    const buffer = await sharp(req.file.buffer)
            .resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})
 
/*****************
 * Delete avatar
 *****************/
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

/**************************************
 * Fetch avatar
 * 
 * can be search by link
 * localhost:3000/user/<some id>/avatar
 **************************************/
router.get('/users/:id/avatar', async (req, res) => {
    try 
    {
        const user = await User.findById(req.params.id)
        
        if (!user || !user.avatar)
        {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch(error)
    {
        res.status(404).send()
    }
})


module.exports = router
