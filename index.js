// Import stylesheets
import "./style.css";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from "firebaseui";

// Document elements
const loginButton = document.getElementById("login");
const usersContainer = document.getElementById("users-container");

const form = document.getElementById("leave-message");
const input = document.getElementById("message");
const users = document.getElementById("users");
const numberAttending = document.getElementById("number-attending");
const rsvpYes = document.getElementById("rsvp-yes");
const rsvpNo = document.getElementById("rsvp-no");

var loginListener = null;
var usersListener = null;

async function main() {
  // Add Firebase project configuration object here
  var firebaseConfig = {
    apiKey: "AIzaSyDbXvjdlmcnpVuwzfv0zyNmUwNyYfA9QXY",
    authDomain: "smartcart-184ed.firebaseapp.com",
    databaseURL: "https://smartcart-184ed.firebaseio.com",
    projectId: "smartcart-184ed",
    storageBucket: "smartcart-184ed.appspot.com",
    messagingSenderId: "43516075002",
    appId: "1:43516075002:web:4431e314cdf65aab41e243",
    measurementId: "G-12KJ3PTD3P"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };

  const ui = new firebaseui.auth.AuthUI(firebase.auth());

  // Listen to login button clicks
  loginButton.addEventListener("click", () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      firebase.auth().signOut();
      
      
    } else {
      // No user is signed in; allows user to sign in
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  });

  // Listen to the current Auth state
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      loginButton.textContent = "Logout";
      // Show users to logged-in users
      usersContainer.style.display = "block";
      subscribeUsers();
    } else {
      loginButton.textContent = "Login";
      // Hide users for non-logged-in users
      usersContainer.style.display = "none";
      unsubscribeUsers();
    }
  });

  // Listen to the form submission
  form.addEventListener("submit", e => {
    // Prevent the default form redirect
    e.preventDefault();
    // Write a new message to the database collection "users"
    firebase
      .firestore()
      .collection("users")
      .add({
        text: input.value,
        timestamp: Date.now(),
        name: firebase.auth().currentUser.displayName,
        userId: firebase.auth().currentUser.uid
      });
    // clear message input field
    input.value = "";
    // Return false to avoid redirect
    return false;
  });
}
main();

// Listen to users updates
function subscribeUsers() {
  // Create query for messages
  usersListener = firebase
    .firestore()
    .collection("users")
    .orderBy("timestamp", "desc")
    .onSnapshot(snaps => {
      // Reset page
      users.innerHTML = "";
      // Loop through documents in database
      snaps.forEach(doc => {
        // Create an HTML entry for each document and add it to the chat
        const entry = document.createElement("p");
        entry.textContent = doc.data().name + ": " + doc.data().text;
        users.appendChild(entry);
      });
    });
}

// Unsubscribe from users updates
function unsubscribeUsers() {
  if (usersListener != null) {
    usersListener();
    usersListener = null;
  }
}


