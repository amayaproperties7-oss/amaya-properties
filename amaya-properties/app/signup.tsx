import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSignup = () => {
    if (email && password && password === confirmPassword) {
      signIn({ id: 'dummy', email, fullName, phone });
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Image source={require('@/assets/images/amaya-logo.jpg')} style={styles.logoImg} resizeMode="contain" />
            <Text style={styles.welcomeText}>JOIN THE{'\n'}COLLECTION</Text>
            <Text style={styles.subtitleText}>Create your profile to access our most exclusive properties and track your dream homes.</Text>
          </View>

          <View style={styles.formContainer}>
            
            <SignupInput label="FULL NAME" value={fullName} onChangeText={setFullName} placeholder="John Doe" />
            <SignupInput label="EMAIL ADDRESS" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" />
            <SignupInput label="PHONE" value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" />
            <SignupInput label="PASSWORD" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
            <SignupInput label="CONFIRM" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" secureTextEntry />

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup} activeOpacity={0.8}>
              <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>ALREADY A MEMBER? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>LOGIN</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SignupInput({ label, ...props }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#A1A1A1"
        {...props}
      />
      <View style={styles.inputLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginBottom: 40,
  },
  headerContainer: {
    marginBottom: 60,
  },
  logoImg: {
    height: 120,
    width: '100%',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 40,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    lineHeight: 44,
  },
  subtitleText: {
    fontSize: 14,
    color: '#A1A1A1',
    lineHeight: 22,
  },
  formContainer: {
    // no box style for editorial feel
  },
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 2,
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 12,
  },
  inputLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#333333',
  },
  signupButton: {
    backgroundColor: '#C6A75E',
    borderRadius: 2,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  loginText: {
    color: '#A1A1A1',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  loginLink: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
});
