import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = () => {
    if (email && password) {
      signIn({ id: 'dummy', email, fullName: 'AMAYA MEMBER', phone: 'REGISTERED CONTACT' });
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
            <Text style={styles.welcomeText}>WELCOME{'\n'}BACK</Text>
            <Text style={styles.subtitleText}>Sign in to your private portfolio to manage your interests and exclusive properties.</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#A1A1A1"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#A1A1A1"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <View style={styles.inputLine} />
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>FORGOT PASSWORD?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.loginButtonText}>SIGN IN</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>NEW TO THE COLLECTION? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.signupLink}>CREATE ACCOUNT</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    letterSpacing: -1,
    lineHeight: 48,
  },
  subtitleText: {
    fontSize: 14,
    color: '#A1A1A1',
    marginTop: 16,
    lineHeight: 22,
  },
  formContainer: {
    marginTop: 20,
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
    height: 40,
    fontSize: 16,
    color: '#FFFFFF',
    padding: 0,
  },
  inputLine: {
    height: 1,
    backgroundColor: '#333333',
    marginTop: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotPasswordText: {
    color: '#A1A1A1',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  loginButton: {
    backgroundColor: '#C6A75E',
    height: 60,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  signupText: {
    color: '#A1A1A1',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  signupLink: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
});
