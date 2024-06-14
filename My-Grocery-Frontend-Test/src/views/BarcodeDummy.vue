<template>
  <div></div>
</template>

<script>
import axios from "axios";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = "http://127.0.0.1:8081/api"; // Set your API base URL

export default {
  props: {
    currentUser: Object,
  },
  data() {
    return {
      selectedFile: "",
      localCurrentUser: this.currentUser,
    };
  },
  methods: {
    uploadImageProcessDummy(dummyFile = null) {
      const fileToUpload = dummyFile || this.selectedFile;
      console.log("File to upload:", fileToUpload);

      if (fileToUpload && this.localCurrentUser) {
        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("email", this.localCurrentUser.email);

        console.log(
          "FormData before sending:",
          formData.get("file"),
          formData.get("email")
        );

        axiosInstance
          .post("/image-process-upload-create", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Response data:", response.data);
          })
          .catch((error) => {
            console.log("Error:", error);
            if (error.response) {
              console.log("Response Status:", error.response.status);
              console.log("Response Data:", error.response.data);
            } else {
              console.log("Error Message:", error.message);
            }
          });
      } else {
        console.error(
          "Please select a file to upload and ensure you are logged in."
        );
      }
    },
    simulateUpload(user) {
      if (user) {
        this.localCurrentUser = user;
      }
      if (this.localCurrentUser) {
        this.uploadImageProcessDummy();
      } else {
        const dummyFile = new File(["dummy content"], "dummy.jpg", {
          type: "image/jpeg",
        });
        console.log("Simulating upload with dummy file:", dummyFile);
        this.uploadImageProcessDummy(dummyFile);
        console.log("simulateUpload function called!");
      }
    },
  },
  watch: {
    currentUser(newUser) {
      this.localCurrentUser = newUser;
    },
  },
};
</script>

<style scoped></style>
