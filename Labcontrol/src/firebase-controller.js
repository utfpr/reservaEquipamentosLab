import firebase from 'firebase'

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDBsU8g_Qo_TolceLqnw2LOdpM6qjBlcjA',
  authDomain: 'test-app-reserva.firebaseapp.com',
  databaseURL: 'https://test-app-reserva.firebaseio.com',
  projectId: 'test-app-reserva',
  storageBucket: 'test-app-reserva.appspot.com',
  messagingSenderId: '304574833448',
  appId: '1:304574833448:web:d2d9aae65895dffcf7261d',
  measurementId: 'G-JV7CRXK6QD'
}

const firebaseApp = firebase.initializeApp(config)

export default firebaseApp
