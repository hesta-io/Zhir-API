function initApp() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // we dont care about signed in user
      // when user signs in we create custom session from out bakcend using idToken
      user.getIdToken().then(function (idToken) {
        // <------ Check this line
        console.log(idToken); // It shows the Firebase token now
      });
      console.log(user);
    } else {
      // User is signed out.
      alert("user signed out");
    }
  });
}
let logout = () => {
  firebase.auth().signOut();
};
let signInWithGoogle = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      console.log(result.credential);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(error);
    });
};

onMount(async () => {
  initApp();
});
{
  /* <button on:click="{signInWithGoogle}">Sign In Google</button>
<button on:click="{logout}">Sign Out</button> */
}
