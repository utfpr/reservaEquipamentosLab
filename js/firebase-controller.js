// Initialize Firebase
var config = {
	apiKey: "AIzaSyANGX03FDeQ7X3dzsh_U3AzH6FS_teHZ6o",
	authDomain: "reservaequipamentoslab.firebaseapp.com",
	databaseURL: "https://reservaequipamentoslab.firebaseio.com",
	projectId: "reservaequipamentoslab",
	storageBucket: "reservaequipamentoslab.appspot.com",
	messagingSenderId: "276580770789"
};

var LabControl = firebase.initializeApp(config);
var database = firebase.database();
