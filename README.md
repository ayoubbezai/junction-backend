# FISHTA: Digitizing Aquaculture in Algeria

**FISHTA** is an integrated platform designed to digitize and modernize aquaculture management in Algeria. It provides smart, responsive tools for monitoring and managing fish ponds, enabling data-driven decisions, real-time alerts, and efficient resource management for aquaculture professionals.

---

## Project Structure

This repository contains two main folders:

- `backend/` – Laravel 12 REST API for data, authentication, real-time updates, and business logic.
- `frontend/` – Modern Vite + React SPA for dashboards, CRUD, and real-time visualization.
- `junction-front/` – (Legacy) Old Next.js + TypeScript frontend. **Not maintained**; see [VanguardIT/junction-front](https://github.com/VanguardIT/junction-front).

---

## Backend (Laravel) Treeview

```text
backend/
  app/
    Events/
      DashboardUpdated.php
      SensorReadingCreated.php
      StatUpdated.php
    Http/
      Controllers/
        AlertController.php
        AuthController.php
        Controller.php
        PondController.php
        RegionController.php
        Sensor_readingController.php
        SensorController.php
        SMSController2.php
        StatController.php
        StorePdfController.php
        TipController.php
    Models/
      Alert.php
      Pond.php
      Region.php
      Sensor.php
      Sensor_reading.php
      Tip.php
      User.php
    Providers/
      AppServiceProvider.php
    Services/
      InfobipSMSService.php
  routes/
    api.php
    console.php
    web.php
  database/
    migrations/
    ...
```

---

## Frontend (Vite + React) Treeview

```text
frontend/
  src/
    App.jsx
    App.css
    index.css
    main.jsx
    assets/
      fishtaLogo.webp
      react.svg
    components/
      NavBar.jsx
      ui/
        button.jsx
        modals/
          AddPondModal.jsx
    hooks/
      useSensorReadings.js
    lib/
      echo.js
      utils.js
    lingo/
      dictionary.js
      meta.json
    pages/
      Alerts.jsx
      Dashboard.jsx
      PondDetails.jsx
      Ponds.jsx
      Reports.jsx
      Tips.jsx
    services/
      AlertServices.js
      PondServices.js
      ReportServices.js
      SensorServices.js
      StatServices.js
      TipsServices.js
    utils/
      api.js
    vite-env.d.ts
```

---

## Backend API Endpoints

### Authentication

- `POST /api/login` – User login
- `POST /api/register` – User registration

### Statistics

- `GET /api/stat` – Dashboard statistics (ponds, regions, sensors, latest alerts, latest tasks, weekly pH/DO data)

### Resource CRUD

#### Regions (`/api/regions`)

- `GET /api/regions` – List all regions
- `POST /api/regions` – Create a new region
- `GET /api/regions/{id}` – Get a specific region
- `PUT/PATCH /api/regions/{id}` – Update a region
- `DELETE /api/regions/{id}` – Delete a region

#### Ponds (`/api/ponds`)

- `GET /api/ponds` – List all ponds
- `POST /api/ponds` – Create a new pond
- `GET /api/ponds/{id}` – Get a specific pond
- `PUT/PATCH /api/ponds/{id}` – Update a pond
- `DELETE /api/ponds/{id}` – Delete a pond

#### Sensors (`/api/sensors`)

- `GET /api/sensors` – List all sensors
- `POST /api/sensors` – Create a new sensor
- `GET /api/sensors/{id}` – Get a specific sensor
- `PUT/PATCH /api/sensors/{id}` – Update a sensor
- `DELETE /api/sensors/{id}` – Delete a sensor

#### Sensor Readings (`/api/sensor_reading`)

- `GET /api/sensor_reading` – List all sensor readings
- `POST /api/sensor_reading` – Create a new sensor reading
- `GET /api/sensor_reading/{id}` – Get a specific sensor reading
- `PUT/PATCH /api/sensor_reading/{id}` – Update a sensor reading
- `DELETE /api/sensor_reading/{id}` – Delete a sensor reading

#### Alerts (`/api/alerts`)

- `GET /api/alerts` – List all alerts
- `POST /api/alerts` – Create a new alert
- `GET /api/alerts/{id}` – Get a specific alert
- `PUT/PATCH /api/alerts/{id}` – Update an alert
- `DELETE /api/alerts/{id}` – Delete an alert

#### Tips (`/api/tips`)

- `GET /api/tips` – List all tips
- `POST /api/tips` – Create a new tip
- `GET /api/tips/{id}` – Get a specific tip
- `PUT/PATCH /api/tips/{id}` – Update a tip
- `DELETE /api/tips/{id}` – Delete a tip

#### Reports

- Endpoints for reports are available (see `ReportServices.js` and `Reports.jsx` in frontend for usage).

---

## Real-Time Updates

- **WebSocket**: Real-time updates are powered by Laravel Reverb (backend) and Pusher/Laravel Echo (frontend).
- **Events**: Backend events like `DashboardUpdated`, `SensorReadingCreated`, and `StatUpdated` are broadcasted for live dashboard and alert updates.

---

## Legacy Frontend

- The `junction-front/` folder contains the old Next.js + TypeScript frontend, now deprecated due to data structure issues. The new Vite + React frontend is the recommended client.

---

## Getting Started

### Backend

```sh
cd backend
composer install
cp .env.example .env # and configure your environment variables
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```sh
cd frontend
npm install
npm run dev
```

## Landing Page

A dedicated landing page introduces FISHTA, its features, and value proposition.

- **Source code:** [amnabb5/fishta (GitHub)](https://github.com/amnabb5/fishta)
- **Live demo:** [fishta.vercel.app](https://fishta.vercel.app/)

The landing page highlights:

- Real-time sensor tracking
- Offline capability
- Expert dashboards
- AI-powered insights
- Multi-language support

It serves as the main entry point for users and stakeholders to learn about the platform and access the application.

---

## AI Modules & Agents

In addition to the main backend and frontend, the FISHTA ecosystem includes several AI and automation components, each maintained in its own repository:

- **2 AI Modules:**

  - [Model 1: Fish Pond Management (FastAPI)](https://github.com/Rostomgh/junction_fastAPI)
  - [Model 2: Management of Fish Ponds](https://github.com/Rostomgh/Model_Management-of-Fish-Ponds-)
  - [YOLOv8 Water Bacteria Detection](https://github.com/Rostomgh/Yollov8_Water_Bacteria_Detection)

- **1 FastAPI Service:**

  - [Junction Mobile (FastAPI)](https://github.com/ayoubbezai/junction-mobile)

- **3 Python Agents:**
  - [Junction Agents](https://github.com/ayoubbezai/junction-agents)

> **Note:**  
> These AI modules and agents are maintained in separate repositories.  
> Please refer to the respective links above for source code, setup, and documentation.

### Demo Videos

- **Mobile Video Demo:** [YouTube Shorts](https://youtube.com/shorts/pO7QjbrD2hw?feature=share)
- **Web Platform Video Demo:** [YouTube](https://youtu.be/9JELW9FjuiE)

### Integration

- The main Laravel backend communicates with the FastAPI services and agents via HTTP APIs.
- The frontend may also interact with these services for real-time AI-driven features.

### Integration

- The main Laravel backend communicates with the FastAPI services and agents via HTTP APIs.
- The frontend may also interact with these services for real-time AI-driven features.
