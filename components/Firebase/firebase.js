import React, { useState } from 'react';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

import firebaseConfig from './firebaseConfig';



// Initialize Firebase App

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Instance of DB
const dbh = firebase.firestore();
export const auth = firebase.auth();

// Restaurant Functions



export const saveRestaurant = async (restaurantName, restaurantDescription, restaurantEmail, restaurantPassword) => {

  const auth = firebase.auth();
  const authResponse = await auth.createUserWithEmailAndPassword(restaurantEmail, restaurantPassword);
  const uid = authResponse.user.uid;
  return await dbh.collection('restaurant').doc(uid).set({
    restaurantUID: uid,
    restaurantEmail: restaurantEmail,
    restaurantName: restaurantName,
    //restaurantImage: restaurantImage,
    restaurantDescription: restaurantDescription
  });
};

// Food Functions

export const saveFood = async (foodName, foodNote, foodRestaurant, coordinate) => {
  console.log(coordinate)

  return await dbh.collection("food").add({
    foodUID: '',
    foodName: foodName,
    foodNote: foodNote,
    foodRestaurant: foodRestaurant,
    coordinate: coordinate
    
    
    
  }).then(ref => {
    console.log("Document written with ID: ", ref.id);
    dbh.collection("food").doc(ref.id).update({foodUID: ref.id});
  });
};






export const loginWithEmail = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

export const registerWithEmail = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

export const loginAnonymously = () =>
  auth.signInAnonymously();

export const logout = () => auth.signOut();



export const passwordReset = email => auth.sendPasswordResetEmail(email);
