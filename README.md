# Backend


```
backend

├── src  

│   ├── app.js  
│   │   └── Main server entry point  

│   ├── config  
│   │   └── database.js (Database connection setup)  

│   ├── middlewares  
│   │   ├── auth.js (Authentication middleware)  
│   │   └── upload.js (File upload handling)  

│   ├── models  
│   │   ├── user.js  
│   │   ├── chats.js  
│   │   └── connectionRequest.js  
│   │   └── (MongoDB schemas)  

│   ├── routes  
│   │   ├── auth.js (Authentication routes)  
│   │   ├── profile.js (User profile APIs)  
│   │   ├── request.js (Connection requests)  
│   │   ├── users.js (User-related APIs)  
│   │   └── texts.js (Messaging APIs)  

│   ├── utils  
│   │   ├── cloudinary.js (Image upload service)  
│   │   ├── socket.js (Real-time communication)  
│   │   └── validation.js (Input validation)  
```
