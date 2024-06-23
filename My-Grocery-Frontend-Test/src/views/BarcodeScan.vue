<template>
  <div>
    <router-link to="/" style="text-decoration: none">
      <el-page-header content="Barcode Scan"> </el-page-header>
    </router-link>

    <el-main class="main-content">
      <el-upload
        class="upload-demo"
        action="http://127.0.0.1:8081/api/image-process-upload-create"
        ref="fileInput"
        :auto-upload="false"
        :on-change="onFileChange"
        accept="image/*"
      >
        <el-button slot="trigger" size="small" type="primary" plain
          >Select File</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          plain
          @click="uploadImageProcess"
          >Upload to Server</el-button
        >
        <div class="el-upload__tip" slot="tip">
          JPG/PNG files with a size less than 500kb
          <p style="color: red">Use Google Lens for best quality pictures</p>
        </div>
      </el-upload>
      <div v-if="showStatus" class="status">Image Upload Processing...</div>
      <div v-if="completionStatus" class="status">
        Image Upload/Process Successful
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from "axios";
import { auth } from "../Firebase.js"; // Assuming this is your Firebase initialization file
import { onAuthStateChanged } from "firebase/auth";

// Create a custom Axios instance with a progress event
const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = "http://127.0.0.1:8081/api"; // Set your API base URL

export default {
  data() {
    return {
      selectedFile: null,
      showStatus: false,
      completionStatus: false,
      uploadProgress: 0,
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
    onFileChange(file) {
      // Verify the structure of the 'file' object
      console.log("File object:", file);
      // Access the file name and store it in 'selectedFile'
      if (file && file.raw && file.raw.name) {
        this.selectedFile = file.raw;
        console.log("File name:", this.selectedFile.name);
      } else {
        console.error("Invalid file object:", file);
      }
    },
    async uploadImageProcess() {
      if (this.selectedFile) {
        this.showStatus = true;
        this.completionStatus = false;
        this.uploadProgress = 0;
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        console.log("FormData before sending:", formData.get("file"));
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
        console.log("idToken", idToken);
        // Use the custom Axios instance with a progress event
        axiosInstance
          .post("/image-process-upload-create", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${idToken}`,
            },
            onUploadProgress: (progressEvent) => {
              this.uploadProgress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            },
          })
          .then((response) => {
            console.log(response.data);
            this.showStatus = false;
            this.completionStatus = true;
          })
          .catch((error) => {
            console.log(error);
            this.showStatus = false;
            this.completionStatus = false;
            if (error.response) {
              console.log("Response Status:", error.response.status);
              console.log("Response Data:", error.response.data);
            } else {
              console.log("Error Message:", error.message);
            }
          });
      } else {
        this.$message.error("Please select a file to upload.");
      }
    },
  },
};
</script>

<style scoped></style>
