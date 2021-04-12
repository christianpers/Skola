var functions = require('firebase-functions');
var firebase_tools = require('firebase-tools');
var express = require('express');
var admin = require('firebase-admin');
var cors = require('cors');
var bodyParser = require('body-parser');

const { routesConfig } = require('./users/routes-config');

admin.initializeApp();

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));

routesConfig(app);

exports.api = functions.https.onRequest(app);

// export const updateCreatedTime = functions.firestore.document(`facts/{newFactId}`)
// .onUpdate(async (snap,context) => {
//   if(snap.before.data().time !== snap.after.data().time){
//     console.log(‘time Updated’);
//   }else{
//     await admin.firestore().doc(`facts/${context.params.newFactId}`).update({
//     time: snap.after.updateTime
//     }).then(()=>{
//     console.log(“Finish”);
//     }).catch(err =>{
//     console.error(err);
//     })
//   }
// });


  // Listen for updates to any `user` document.
// exports.countNameChanges = functions.firestore
//     .document('Users/{userId}/Drawings/{drawingId}')
//     .onUpdate((change, context) => {
//       // Retrieve the current and previous value
//       const data = change.after.data();
//       const previousData = change.before.data();

//       if (previousData.modified !== data.modified) {
//         console.log('time updated');
//         return null;
//       } else {
//         const timestamp = new Date().getTime();
//         return change.after.ref.set({
//           modified: timestamp
//         }, {merge: true});
//       }

//       // // We'll only update if the name has changed.
//       // // This is crucial to prevent infinite loops.
//       // if (data.name == previousData.name) {
//       //   return null;
//       // }

//       // // Retrieve the current count of name changes
//       // let count = data.name_change_count;
//       // if (!count) {
//       //   count = 0;
//       // }

//       // Then return a promise of a set operation to update the count
//       // 
      
//     });

// Listen for updates to any `user` document.
// exports.modifiedDateUpdate = functions.firestore
//     .document('/Users/{userId}/Drawings/{drawingId}')
//     .onUpdate((change, context) => {
//       const data = change.after.data();
//       console.log('data: ', data);
//       return change.after.ref.set({
//         modified_timestamp: new Date()
//       }, {merge: true});
//     });

// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })

/**
 * Initiate a recursive delete of documents at a given path.
 * 
 * The calling user must be authenticated and have the custom "admin" attribute
 * set to true on the auth token.
 * 
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 * 
 * @param {string} data.path the document or collection path to delete.
 */
exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .https.onCall((data, context) => {
    // Only allow admin users to execute this function.
    // if (!(context.auth && context.auth.token && context.auth.token.admin)) {
    //   throw new functions.https.HttpsError(
    //     'permission-denied',
    //     'Must be an administrative user to initiate delete.'
    //   );
    // }

    console.log('data: ', data, '  context: ', context);

    // Checking that the user is authenticated.
    // if (!context.auth) {
    // // Throwing an HttpsError so that the client gets the error details.
    // throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
    //     'while authenticated.');
    // }

    const path = data.path;
    // console.log(
    //   `User ${context.auth.uid} has requested to delete path ${path}`
    // );

    // Run a recursive delete on the given document or collection path.
    // The 'token' must be set in the functions config, and can be generated
    // at the command line by running 'firebase login:ci'.
    return firebase_tools.firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().fb.token
      })
      .then(() => {
        return {
          path: path 
        };
      });
  });

/**
 * Call the 'recursiveDelete' callable function with a path to initiate
 * a server-side delete.
 */
// function deleteAtPath(path) {
//     var deleteFn = firebase.functions().httpsCallable('recursiveDelete');
//     deleteFn({ path: path })
//         .then(function(result) {
//             logMessage('Delete success: ' + JSON.stringify(result));
//         })
//         .catch(function(err) {
//             logMessage('Delete failed, see console,');
//             console.warn(err);
//         });
// }
