import { auth, db } from './src/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { cleanUsername, formatAuthError } from './src/lib/auth';
import { isUidAuthorizedAdmin } from './src/lib/firestore';

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

// Appearance Theme Toggle
const themeButton = document.getElementById('themeButton');
if (themeButton) {
  themeButton.addEventListener('click', () => {
    document.body.classList.toggle('light-preview');
    const isLight = document.body.classList.contains('light-preview');
    const icon = document.querySelector('#themeButton i');
    if (icon) {
      icon.className = isLight ? 'fa-regular fa-moon' : 'fa-regular fa-sun';
    }
  });
}

// Service Card Search Filter
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', event => {
    const query = event.target.value.toLowerCase().trim();
    document.querySelectorAll('.service-card').forEach(card => {
      const searchable = (card.innerText + ' ' + (card.dataset.search || '')).toLowerCase();
      card.style.display = searchable.includes(query) ? '' : 'none';
    });
  });
}

// Password Eye Toggles
function setupPasswordToggle(buttonId, inputId) {
  const btn = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  if (btn && input) {
    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      }
    });
  }
}

setupPasswordToggle('togglePassword', 'password');
setupPasswordToggle('toggleRegPassword', 'regPassword');
setupPasswordToggle('toggleRegConfirmPassword', 'regConfirmPassword');

// Feedback Banner Helper
const authBanner = document.getElementById('authBanner');
const authBannerIcon = document.getElementById('authBannerIcon');
const authBannerText = document.getElementById('authBannerText');

function showMessage(type, message) {
  if (!authBanner || !authBannerIcon || !authBannerText) return;
  authBanner.className = `auth-banner ${type}`;
  authBannerText.textContent = message;

  if (type === 'error') {
    authBannerIcon.className = 'fa-solid fa-triangle-exclamation';
  } else if (type === 'success') {
    authBannerIcon.className = 'fa-solid fa-circle-check';
  } else if (type === 'loading') {
    authBannerIcon.className = 'fa-solid fa-circle-notch fa-spin';
  } else {
    authBannerIcon.className = 'fa-solid fa-circle-info';
  }
}

function clearMessage() {
  if (authBanner) {
    authBanner.className = 'auth-banner';
    authBanner.style.display = 'none';
  }
}

// Form Switcher States: 'login' | 'register' | 'forgot'
let currentAuthView = 'login';
let selectedRole = 'User'; // 'User' | 'Admin'

const formHeading = document.getElementById('formHeading');
const formSubheading = document.getElementById('formSubheading');
const roleSwitchContainer = document.getElementById('roleSwitchContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotForm = document.getElementById('forgotForm');
const createAccountBtn = document.getElementById('createAccount');
const orDivider = document.getElementById('orDivider');

function setAuthMode(mode) {
  currentAuthView = mode;
  clearMessage();

  if (mode === 'login') {
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
    if (forgotForm) forgotForm.style.display = 'none';
    if (roleSwitchContainer) roleSwitchContainer.style.display = 'flex';

    if (selectedRole === 'Admin') {
      if (formHeading) formHeading.textContent = 'Admin Portal';
      if (formSubheading) formSubheading.textContent = 'Sign in with verified administrator credentials';
      if (createAccountBtn) createAccountBtn.style.display = 'none';
      if (orDivider) orDivider.style.display = 'none';
    } else {
      if (formHeading) formHeading.textContent = 'Welcome Back';
      if (formSubheading) formSubheading.textContent = 'Login to access your account';
      if (createAccountBtn) createAccountBtn.style.display = 'block';
      if (orDivider) orDivider.style.display = 'flex';
    }
  } else if (mode === 'register') {
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
    if (forgotForm) forgotForm.style.display = 'none';
    if (roleSwitchContainer) roleSwitchContainer.style.display = 'none';
    if (formHeading) formHeading.textContent = 'Create Citizen Account';
    if (formSubheading) formSubheading.textContent = 'Register to apply and track online government schemes';
  } else if (mode === 'forgot') {
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (forgotForm) forgotForm.style.display = 'block';
    if (roleSwitchContainer) roleSwitchContainer.style.display = 'none';
    if (formHeading) formHeading.textContent = 'Reset Password';
    if (formSubheading) formSubheading.textContent = 'Receive a secure password reset email';
  }
}

// Role Switcher Buttons
const roleBtnUser = document.getElementById('roleBtnUser');
const roleBtnAdmin = document.getElementById('roleBtnAdmin');

if (roleBtnUser && roleBtnAdmin) {
  roleBtnUser.addEventListener('click', () => {
    selectedRole = 'User';
    roleBtnUser.classList.add('selected');
    roleBtnAdmin.classList.remove('selected');
    setAuthMode('login');
  });

  roleBtnAdmin.addEventListener('click', () => {
    selectedRole = 'Admin';
    roleBtnAdmin.classList.add('selected');
    roleBtnUser.classList.remove('selected');
    setAuthMode('login');
  });
}

// Navigation Triggers
if (createAccountBtn) {
  createAccountBtn.addEventListener('click', () => setAuthMode('register'));
}

const backToLoginFromReg = document.getElementById('backToLoginFromReg');
if (backToLoginFromReg) {
  backToLoginFromReg.addEventListener('click', () => setAuthMode('login'));
}

const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setAuthMode('forgot');
    // Prefill forgot email if entered in login field
    const loginIdentifier = document.getElementById('loginIdentifier');
    const forgotEmail = document.getElementById('forgotEmail');
    if (loginIdentifier && forgotEmail && loginIdentifier.value.includes('@')) {
      forgotEmail.value = loginIdentifier.value.trim();
    }
  });
}

const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');
if (backToLoginFromForgot) {
  backToLoginFromForgot.addEventListener('click', () => setAuthMode('login'));
}

// Helper: Resolve Username or Email to Email
async function resolveEmail(identifier) {
  const trimmed = identifier.trim().toLowerCase();
  if (trimmed.includes('@')) {
    return trimmed;
  }
  const normalized = cleanUsername(trimmed);
  try {
    const snap = await getDoc(doc(db, 'usernames', normalized));
    if (snap.exists() && snap.data()?.email) {
      return snap.data().email.toLowerCase();
    }
  } catch (err) {
    console.warn('[Resolve Email] Username lookup notice:', err);
  }
  // Fallback for default admin identity
  if (normalized === 'admin' || normalized === 'satu') {
    return 'satyajitvala23@gmail.com';
  }
  return trimmed;
}

// 1. Handle Login Form Submit
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifierInput = document.getElementById('loginIdentifier');
    const passwordInput = document.getElementById('password');
    const rememberMeInput = document.getElementById('rememberMe');
    const submitBtn = document.getElementById('loginSubmitBtn');

    const identifier = identifierInput ? identifierInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';
    const rememberMe = rememberMeInput ? rememberMeInput.checked : true;

    if (!identifier) {
      showMessage('error', selectedRole === 'Admin' ? 'Please enter administrator username or email.' : 'Please enter your email or username.');
      return;
    }
    if (!password) {
      showMessage('error', 'Please enter your password.');
      return;
    }

    try {
      showMessage('loading', 'Authenticating with Firebase...');
      if (submitBtn) submitBtn.disabled = true;

      // Secure Remember Me without localStorage password storage
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (pErr) {
        console.warn('[Login] Persistence notice:', pErr);
      }

      const email = await resolveEmail(identifier);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore Profile & Role Verification
      let userRole = 'user';
      let userStatus = 'Active';
      let userName = user.displayName || 'User';

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.role === 'admin') userRole = 'admin';
          if (data.status) userStatus = data.status;
          if (data.name) userName = data.name;
        }
      } catch (fsErr) {
        console.warn('[Login] Profile fetch notice:', fsErr);
      }

      // Check if user is authorized admin
      const isConfirmedAdmin = (await isUidAuthorizedAdmin(user.uid)) || userRole === 'admin';
      if (isConfirmedAdmin) {
        userRole = 'admin';
      }

      // Role Check enforcement
      if (selectedRole === 'Admin') {
        if (!isConfirmedAdmin) {
          await signOut(auth);
          showMessage('error', 'Access Denied: This account does not have administrator privileges. Please sign in with an authorized admin account.');
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        showMessage('success', `Welcome Administrator! Redirecting to Admin Dashboard...`);
        setTimeout(() => {
          window.location.href = '/admin-dashboard.html';
        }, 800);
        return;
      }

      // Normal Citizen / User
      if (userStatus.toLowerCase() === 'inactive') {
        await signOut(auth);
        showMessage('error', 'Your account has been deactivated. Please contact Shiv Computer support.');
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      showMessage('success', `Welcome back, ${userName}! Redirecting to User Dashboard...`);
      setTimeout(() => {
        if (userRole === 'admin') {
          // Admin logged in via user form can access admin dashboard
          window.location.href = '/admin-dashboard.html';
        } else {
          window.location.href = '/user-dashboard.html';
        }
      }, 800);

    } catch (err) {
      console.error('[Login Error]', err);
      const friendlyMsg = formatAuthError(err);
      showMessage('error', friendlyMsg);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// 2. Handle Registration Form Submit
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('regFullName');
    const emailInput = document.getElementById('regEmail');
    const mobileInput = document.getElementById('regMobile');
    const passwordInput = document.getElementById('regPassword');
    const confirmPasswordInput = document.getElementById('regConfirmPassword');
    const submitBtn = document.getElementById('regSubmitBtn');

    const fullName = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const mobile = mobileInput ? mobileInput.value.trim().replace(/[^0-9]/g, '') : '';
    const password = passwordInput ? passwordInput.value : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

    if (!fullName) {
      showMessage('error', 'Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showMessage('error', 'Please enter a valid email address.');
      return;
    }
    if (!mobile || mobile.length !== 10) {
      showMessage('error', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      showMessage('error', 'Passwords do not match. Please re-enter your password.');
      return;
    }

    try {
      showMessage('loading', 'Creating your citizen account in Firebase...');
      if (submitBtn) submitBtn.disabled = true;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await updateProfile(user, { displayName: fullName });
      } catch (upErr) {
        console.warn('[Registration] Display name notice:', upErr);
      }

      // Save user profile in Firestore
      // Strictly assign role === 'user' (Users CANNOT register as admin!)
      const generatedUsername = cleanUsername(email.split('@')[0]) || `user_${Date.now().toString().slice(-4)}`;
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: fullName,
          email: email,
          mobile: mobile,
          phone: mobile,
          role: 'user', // NEVER ADMIN
          username: generatedUsername,
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
          totalApplications: 0,
          totalPaid: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await setDoc(doc(db, 'usernames', generatedUsername), {
          username: generatedUsername,
          uid: user.uid,
          email: email,
          role: 'user',
          createdAt: serverTimestamp(),
        });
      } catch (fsErr) {
        console.warn('[Registration] Firestore profile write notice:', fsErr);
      }

      showMessage('success', 'Registration successful! Redirecting to User Dashboard...');
      setTimeout(() => {
        window.location.href = '/user-dashboard.html';
      }, 1000);

    } catch (err) {
      console.error('[Registration Error]', err);
      const friendlyMsg = formatAuthError(err);
      showMessage('error', friendlyMsg);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// 3. Handle Forgot Password Form Submit
if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const forgotEmailInput = document.getElementById('forgotEmail');
    const submitBtn = document.getElementById('forgotSubmitBtn');
    const emailVal = forgotEmailInput ? forgotEmailInput.value.trim() : '';

    if (!emailVal) {
      showMessage('error', 'Please enter your registered email address.');
      return;
    }

    try {
      showMessage('loading', 'Sending Firebase password reset email...');
      if (submitBtn) submitBtn.disabled = true;

      const resolvedEmail = await resolveEmail(emailVal);
      await sendPasswordResetEmail(auth, resolvedEmail);

      showMessage('success', `Password reset link sent to ${resolvedEmail}! Please check your email inbox and spam folder.`);
      if (forgotEmailInput) forgotEmailInput.value = '';

    } catch (err) {
      console.error('[Forgot Password Error]', err);
      const friendlyMsg = formatAuthError(err);
      showMessage('error', friendlyMsg);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
