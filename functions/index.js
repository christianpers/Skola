var functions = require('firebase-functions');
var firebase_tools = require('firebase-tools');

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
