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
        <el-button @click="signInWithEmailPassword"
          >Sign in with Email</el-button
        >
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
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "./Firebase.js"; // Assuming this is your Firebase initialization file

export default {
  name: "LoginSignup",
  data() {
    return {
      email: "",
      password: "",
      users: JSON.parse(localStorage.getItem("users")) || [],
      currentUser: null,
      initialAuthCheck: true,
    };
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      setPersistence(auth, browserSessionPersistence)
        .then(() => {
          // In this case, signInWithPopup will use the persistence set by setPersistence
        })
        .catch((error) => {
          console.error("Error setting persistence:", error);
        });
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = user;
          console.log("User is logged in:", user);
        } else {
          console.log("No user is logged in");
        }
        this.initialAuthCheck = false;
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
        await fetch("http://127.0.0.1:8081/api/set-email", {
          email: user.email,
        });
        this.currentUser = user;
        this.createUserFolder();
      } catch (error) {
        console.error("Error signing up:", error);
      }
    },
    async signInWithEmailPassword() {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        console.log("User signed in:", user);
        // Add user to the users array if not already present
        if (!this.users.some((u) => u.uid === user.uid)) {
          this.users.push(user);
          localStorage.setItem("users", JSON.stringify(this.users));
        }
        await fetch("http://127.0.0.1:8081/api/set-email", {
          email: user.email,
        });
        this.currentUser = user;
      } catch (error) {
        console.error("Error signing in:", error);
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
        // Send the email to the server to store it in the session
        await fetch("http://127.0.0.1:8081/api/set-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
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
    async createUserFolder() {
      const user = this.currentUser;
      if (user) {
        const userEmail = user.email;
        try {
          const formData = new FormData();
          formData.append("email", userEmail);
          formData.append(
            "file",
            new Blob([""], { type: "text/plain" }),
            "dummy.jpg"
          ); // dummy file
          const response = await fetch(
            "http://127.0.0.1:8081/api/image-process-upload-create",
            {
              method: "POST",
              body: formData,
            }
          );
          if (response.ok) {
            const data = await response.json();
            console.log(data.message);
          } else {
            console.error("Error creating user folder:", response.status);
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      } else {
        console.error("User not logged in");
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
