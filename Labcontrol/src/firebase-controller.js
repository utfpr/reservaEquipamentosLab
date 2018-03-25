import firebase from 'firebase'

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyANGX03FDeQ7X3dzsh_U3AzH6FS_teHZ6o',
  authDomain: 'reservaequipamentoslab.firebaseapp.com',
  databaseURL: 'https://reservaequipamentoslab.firebaseio.com',
  projectId: 'reservaequipamentoslab',
  storageBucket: 'reservaequipamentoslab.appspot.com',
  messagingSenderId: '276580770789'
}

firebase.initializeApp(config)
