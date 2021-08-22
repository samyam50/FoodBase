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
import { auth, registerWithEmail, saveRestaurant } from '../components/Firebase/firebase';
import useStatusBar from '../hooks/useStatusBar';

const validationSchema = Yup.object().shape({

  name: Yup.string()
    .required('Please enter the name of your restaurant')
    .label('Restaurant Name'),
  // image: Yup.string()
  //   .required('Please enter a valid email')
  //   .email()
  //   .label('Image'),
  description: Yup.string()
    .required('You should enter a description for your restaurant')
    .label('Restaurant Description'),
  email: Yup.string()
    .required('Please enter a valid email')
    .email()
    .label('Restaurant Email'),
  password: Yup.string()
    .required()
    .min(6, 'Password must have at least 6 characters')
    .label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match Password')
    .required('Confirm Password is required')
});

export default function RegisterScreen({ navigation }) {
  useStatusBar('light-content');

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye');
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState('eye');
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(
    true
  );
  const [registerError, setRegisterError] = useState('');

  function handlePasswordVisibility() {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  }

  function handleConfirmPasswordVisibility() {
    if (confirmPasswordIcon === 'eye') {
      setConfirmPasswordIcon('eye-off');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    } else if (confirmPasswordIcon === 'eye-off') {
      setConfirmPasswordIcon('eye');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    }
  }

  async function handleOnSignUp(values, actions) {
    const { name, description, email, password } = values;
    console.log('test');
    try {
      await saveRestaurant(name, description, email, password);
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
          description: '',
          email: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={validationSchema}
        onSubmit={values => handleOnSignUp(values)}
      >
        <FormField
          name="name"
          leftIcon="account"
          placeholder="Enter Restaurant Name"
          autoFocus={true}
        />
        <FormField
          name="description"
          leftIcon="box"
          placeholder="Enter Restaurant Description"
        />
        <FormField
          name="email"
          leftIcon="email"
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <FormField
          name="password"
          leftIcon="lock"
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={passwordVisibility}
          textContentType="password"
          rightIcon={rightIcon}
          handlePasswordVisibility={handlePasswordVisibility}
        />
        <FormField
          name="confirmPassword"
          leftIcon="lock"
          placeholder="Confirm password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={confirmPasswordVisibility}
          textContentType="password"
          rightIcon={confirmPasswordIcon}
          handlePasswordVisibility={handleConfirmPasswordVisibility}
        />
        <FormButton title={'Register Restaurant'} />
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
