import firebase from 'firebase'

// Initialize Firebase
const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: ''
}

const firebaseApp = firebase.initializeApp(config)

export default firebaseApp
