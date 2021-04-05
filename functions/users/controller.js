// import { Request, Response } from "express";
var admin = require('firebase-admin');

exports.create = async (req, res) => {
    try {
       const { displayName, password, email, role } = req.body

       if (!displayName || !password || !email || !role) {
           return res.status(400).send({ message: 'Missing fields' })
       }

       const { uid } = await admin.auth().createUser({
           displayName,
           password,
           email
       })
       await admin.auth().setCustomUserClaims(uid, { role })

       return res.status(201).send({ uid })
   } catch (err) {
       return handleError(res, err)
   }
}

exports.all = async (req, res) => {
    try {
        const listUsers = await admin.auth().listUsers()
        const users = listUsers.users.map(mapUser)
        return res.status(200).send({ users })
    } catch (err) {
        return handleError(res, err)
    }
}

const mapUser = (user) => {
    const customClaims = user.customClaims || { role: '' };
    const role = customClaims.role ? customClaims.role : 'N/A';
    return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime
    }
}

const handleError = (res, err) => {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

// export async function create(req, res) {
//    try {
//        const { displayName, password, email, role } = req.body

//        if (!displayName || !password || !email || !role) {
//            return res.status(400).send({ message: 'Missing fields' })
//        }

//        const { uid } = await admin.auth().createUser({
//            displayName,
//            password,
//            email
//        })
//        await admin.auth().setCustomUserClaims(uid, { role })

//        return res.status(201).send({ uid })
//    } catch (err) {
//        return handleError(res, err)
//    }
// }

// function handleError(res, err) {
//    return res.status(500).send({ message: `${err.code} - ${err.message}` });
// }