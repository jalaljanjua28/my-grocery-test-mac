<template>
  <div>
    <router-link to="/" style="text-decoration: none">
      <el-page-header content="Sign In / Sign Out"></el-page-header>
    </router-link>
    <el-main class="main-content">
      <h2>Login / Signup</h2>
      <div v-if="!currentUser">
        <el-input
          style="margin-bottom: 20px"
          v-model="email"
          placeholder="Email"
        ></el-input>
        <br />
        <el-input
          v-model="password"
          placeholder="Password"
          show-password
          style="margin-bottom: 20px"
        ></el-input>
        <el-button @click="signUpWithEmailPassword"
          >Sign up with Email</el-button
        >
        <el-button @click="signInWithGoogle">Sign in with Google</el-button>
      </div>
      <el-button v-if="currentUser" @click="signOut">Sign Out</el-button>
      <div v-if="users.length">
        <h3>Switch Users</h3>
        <ul>
          <li v-for="user in users" :key="user.uid">
            <el-button
              style="margin-bottom: 10px"
              @click="switchUser(user.uid)"
              >{{ user.email }}</el-button
            >
          </li>
        </ul>
      </div>
    </el-main>
  </div>
</template>

<script>
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../Firebase.js"; // Assuming this is your Firebase initialization file

export default {
  name: "LoginSignup",
  data() {
    return {
      email: "",
      password: "",
      users: JSON.parse(localStorage.getItem("users")) || [],
      currentUser: null,
    };
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = user;
          console.log("User is logged in:", user);
        } else {
          console.log("No user is logged in");
        }
      });
    },
    async signUpWithEmailPassword() {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        console.log("User signed up:", user);
        // Add user to the users array if not already present
        if (!this.users.some((u) => u.uid === user.uid)) {
          this.users.push(user);
          localStorage.setItem("users", JSON.stringify(this.users));
        }
        // Send the ID token to the server
        const idToken = await user.getIdToken();
        await fetch("http://127.0.0.1:8081/api/set-email-create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, idToken }),
        });
        this.currentUser = user;
      } catch (error) {
        console.error("Error signing up:", error);
      }
    },
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("User signed in:", user);
        // Add user to the users array if not already present
        if (!this.users.some((u) => u.uid === user.uid)) {
          this.users.push(user);
          localStorage.setItem("users", JSON.stringify(this.users));
        }
        // Send the ID token to the server
        const idToken = await user.getIdToken();
        await fetch("http://127.0.0.1:8081/api/set-email-create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, idToken }),
        });
        this.currentUser = user;
      } catch (error) {
        console.error("Error signing in:", error);
      }
    },
    async switchUser(uid) {
      const user = this.users.find((u) => u.uid === uid);
      if (user) {
        this.currentUser = user;
        console.log("Switched to user:", user);
      } else {
        console.error("User not found");
      }
    },
    async signOut() {
      try {
        await firebaseSignOut(auth);
        this.currentUser = null;
        console.log("User signed out successfully");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
  },
};
</script>
