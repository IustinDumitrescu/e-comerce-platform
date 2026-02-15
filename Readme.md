🛒 E-Commerce Marketplace

A full-stack online marketplace where users can register, list products, and purchase products from each other.

Each user can act as both a buyer and a seller. Orders are processed synchronously, while order-related notifications are handled asynchronously via a queue and delivered in real time. The entire application is containerized and reverse-proxied through Nginx.

🚀 Quick Start (Test the App)

Follow these simple steps to run the application locally:

Install Docker: Get Docker

Clone the repository:

git clone https://github.com/IustinDumitrescu/e-comerce-platform.git
cd e-comerce-platform

Start the application:

docker-compose up --build

Everything runs automatically:

PostgreSQL database is created

Doctrine migrations are executed

Initial product categories are seeded

Backend (Symfony) starts

Frontend (Vite + React) starts

RabbitMQ and Mercure initialize

Nginx reverse proxy routes traffic

Open your browser to explore the platform.

🌐 Application URLs
Service	URL

Backend (via Nginx)	http://localhost:8080

Default RabbitMQ credentials:

guest / guest
🧱 Tech Stack
Frontend

Vite + React
Handles user authentication, product browsing, order placement, and real-time notifications.

Backend

Symfony (PHP)
Provides REST API for authentication, product management, synchronous order processing, and dispatching order notifications.

Database

PostgreSQL
Stores users, products, orders, categories, and related entities. Migrations run automatically on startup.

Queue & Notifications

RabbitMQ + Symfony Messenger – queues order notifications

Mercure – pushes real-time notifications to connected users

Reverse Proxy

Nginx – routes traffic to frontend, backend, and Mercure, serving as the single entry point.

🏗 Architecture Overview
Client Browser
      ↓
     Nginx (Reverse Proxy)
      ↓
 ┌───────────────┬───────────────┐
 │               │               │
Frontend      Backend        Mercure
(React)      (Symfony)       (Hub)
                    ↓
               PostgreSQL

Async Notification Flow:
Order Created (Sync)
      ↓
Symfony Messenger
      ↓
RabbitMQ
      ↓
Worker
      ↓
Mercure
      ↓
Frontend receives real-time update
🎯 Project Highlights

Full-stack online marketplace

Users can register, list products, place orders

Synchronous order handling

Asynchronous order notifications via RabbitMQ + Mercure

Real-time notifications for users

Containerized architecture with Docker

Reverse proxy with Nginx

Automated database migrations and seed data

Developer-friendly startup: one command to run the entire app

🧹 Stop the Application
docker compose down

Remove containers and database volume for a clean start:

docker compose down -v
📝 Notes for Developers

Backend container waits for the database to be ready before running migrations

Initial product categories are seeded automatically

Orders are handled synchronously; only notifications are asynchronous

Nginx ensures all traffic is routed correctly to the appropriate services

RabbitMQ handles queueing of notification messages, which are published to Mercure for real-time delivery