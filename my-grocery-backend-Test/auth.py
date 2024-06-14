from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth
from google.cloud import storage
from flask_cors import CORS
import os

# Initialize Firebase Admin SDK (if not already done)
cred = credentials.Certificate("/Users/jalaljanjua/Desktop/my-grocery-home-test/my-grocery-backend-Test/my-grocery-home-firebase-adminsdk-hdtde-64859d9f5e.json")
firebase_admin.initialize_app(cred)

app = Flask(__name__)
CORS(app, methods=["GET", "POST"], supports_credentials=True)

client = storage.Client()
bucket_name = "grocery-bucket"  # Name of your cloud storage bucket

@app.route('/api/login', methods=['POST'])
def link_gcs():
    
    data = request.get_json()
    user_email = data.get('email')

    if not user_email:
        return jsonify({'message': 'Email is required'}), 400

    try:
        # Define the folder path based on the email
        folder_name = f'users/{user_email}/'

        # Create an empty file to represent the folder (GCS doesn't have actual folders)
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(f'{folder_name}placeholder.txt')
        blob.upload_from_string('')

        return jsonify({'message': 'User folder created or exists'}), 200
    except Exception as e:
        print('Error creating folder:', e)
        return jsonify({'message': 'Internal server error'}), 500
       # Verify the user's email with Firebase Authentication
    #     try:
    #         user = auth.get_user_by_email(user_email)
    #     except auth.UserNotFoundError:
    #         return jsonify({'error': 'User not found'}), 404

    #     # Set up GCS access control (using user's email for identification)
    #     bucket = client.bucket(bucket_name)
    #     folder_path = f"users/{user.uid}/"

    #     # Create a blob to ensure the folder exists
    #     folder_blob = bucket.blob(folder_path)
    #     folder_blob.upload_from_string('')

    #     # Modify ACL to grant owner permissions
    #     acl = bucket.acl
    #     acl.user(user_email).grant_owner()
    #     acl.save()

    #     return jsonify({'message': 'GCS access configured'}), 200

    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8082)))
