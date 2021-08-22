import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';

import Colors from '../utils/colors';
import SafeView from '../components/SafeView';
import Form from '../components/Forms/Form';
import FormField from '../components/Forms/FormField';
import FormButton from '../components/Forms/FormButton';
import IconButton from '../components/IconButton';
import FormErrorMessage from '../components/Forms/FormErrorMessage';
import { auth, registerWithEmail, saveFood, saveRestaurant } from '../components/Firebase/firebase';
import useStatusBar from '../hooks/useStatusBar';

const validationSchema = Yup.object().shape({

  name: Yup.string()
    .required('Please enter the name of the Food')
    .label('Food'),
  // image: Yup.string()
  //   .required('Please enter a valid email')
  //   .email()
  //   .label('Image'),
  note: Yup.string()
    .required('Please enter a description')
    .label('Food Description'),

});

export default function FoodPost({ route, navigation }) {
  useStatusBar('light-content');

  const [registerError, setRegisterError] = useState('');








  async function handleOnSignUp(values, actions) {
    const { name, note } = values;
    try {
      const uid = await auth.currentUser.uid;
 
      await saveFood(name, note, uid, route.params);
      navigation.goBack();
    } catch (error) {
      setRegisterError(error.message);
      console.log(error.message);
    }
  }

  return (
    <SafeView style={styles.container}>
      <Form
        initialValues={{
          name: '',
          note: ''
        }}
        validationSchema={validationSchema}
        onSubmit={values => handleOnSignUp(values)}
      >
        <FormField
          name="name"
          leftIcon="food"
          placeholder="Enter Food Name"
          autoFocus={true}
        />
        <FormField
          name="note"
          leftIcon="note"
          placeholder="Enter Food Description"
        />

        <FormButton title={'Create Listing'} />
        {<FormErrorMessage error={registerError} visible={true} />}
      </Form>
      <IconButton
        style={styles.backButton}
        iconName="keyboard-backspace"
        color={Colors.white}
        size={30}
        onPress={() => navigation.goBack()}
      />
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.lightBlue
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5
  }
});
