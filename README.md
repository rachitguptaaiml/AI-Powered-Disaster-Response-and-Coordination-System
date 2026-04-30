# AI Disaster Response and Coordination System

This project is a full stack system that simulates how disaster monitoring and response can work using AI-based predictions, real-time updates, and SOS request handling.

The aim is to combine prediction, live tracking, and emergency communication into a single platform to improve situational awareness during disasters.

---

## Features

- AI-based disaster severity prediction using multiple environmental factors  
- Real-time disaster monitoring using WebSockets (no page refresh required)  
- Live map visualization with dynamic markers (Leaflet.js)  
- SOS request system with MongoDB storage  
- Real-time SOS alerts on dashboard  
- SOS status tracking (NEW → UPDATED/RESOLVED)  
- Input validation for safer request handling  
- Fallback handling if AI or backend fails  
- Full CRUD API for SOS management  
- Simple API documentation endpoint  

---

## Tech Stack

Frontend: HTML, CSS, JavaScript (Leaflet.js)  
Backend: Node.js, Express  
Database: MongoDB  
Real-time: WebSocket (ws)  
AI Module: Python (FastAPI)  

---

## Project Structure

project/  
│  
├── frontend/  
│   └── index.html  
│  
├── backend/  
│   ├── app.js  
│   └── server.js  
│  
├── ai/  
│   ├── prediction.py  
│   └── model.py  
│  
└── README.md  

---

## How to Run

1. Start Backend

cd backend  
node server.js  

2. Start AI Service (optional)

cd ai  
uvicorn prediction:app --reload  

3. Open Frontend

Open frontend/index.html in browser  

---

## API Endpoints

POST   /sos        → Create SOS request  
GET    /sos        → Get all SOS  
PUT    /sos/:id    → Update status  
DELETE /sos/:id    → Delete SOS  
GET    /docs       → View API routes  

---

## Real-Time System

- WebSocket connection is used to push live updates  
- New SOS requests instantly appear on the dashboard and map  
- Updates happen without refreshing the page  
- Backend broadcasts events to all connected clients  

---

## AI Model

The AI module predicts disaster severity using factors like:

- rainfall  
- wind speed  
- temperature  
- population  
- river level  

Steps used:

- Input normalization  
- Weighted scoring  
- Probability estimation (sigmoid-like behavior)  
- Severity classification (LOW / MEDIUM / HIGH)  

The model is simplified but structured similar to real ML pipelines.

---

## Map Integration

- Built using Leaflet.js  
- Displays disaster locations with markers  
- Color-coded severity levels  
- Updates dynamically from real-time data  
- Supports both simulated and backend-driven data  

---

## SOS Request System

- Users can submit SOS requests from frontend  
- Requests are stored in MongoDB  
- Each request includes name, message, status, and timestamp  
- Status can be updated (for response tracking)  
- All changes are pushed in real-time using WebSockets  

---

## Error Handling

- Input validation for required fields  
- Message length checks  
- Proper HTTP status codes  
- Try-catch handling in backend routes  
- Fallback responses if services fail  

---

## Notes

- Coordinates are randomly generated for demo purposes  
- AI prediction is simulated but designed like a real model  
- WebSocket data can be replaced with real APIs  
- Project is focused on learning and system design  

---

## Future Improvements

- Integration with real disaster/weather APIs  
- Authentication for users and admins  
- Advanced dashboard with analytics  
- Notification system (SMS / Email)  
- Deployment on cloud  

---

## Purpose

This project was built to understand:

- full stack development  
- real-time systems using WebSockets  
- backend API design  
- database integration  
- basic AI-based decision making  
- handling emergency response workflows  

---

## Author

Rachit Gupta
Yashi Rajoriya
Devansh Mishra
