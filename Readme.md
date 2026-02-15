# 🛒 E-Commerce Marketplace Demo

**Portfolio Project / Technical Demo for Recruiters**  

A full-stack online marketplace where users can register, list products, and purchase products from each other. This project demonstrates modern full-stack development, containerized architecture, asynchronous notifications, and real-time updates — designed to be **production-ready and scalable**.

---

## 🚀 Quick Start (Test the App)

Follow these simple steps to run the application locally:

1. **Install Docker**: [Get Docker](https://www.docker.com/get-started)  
2. **Clone the repository**:

```bash
git clone https://github.com/IustinDumitrescu/e-comerce-platform.git
cd e-comerce-platform

3. **Start the application: docker compose up --build

Everything runs automatically:

    ->PostgreSQL database initializes

    ->Doctrine migrations are applied

    ->Initial product categories are seeded

    ->Backend API (Symfony + PHP-FPM) starts

    ->Messenger worker starts consuming order notifications

    ->RabbitMQ and Mercure initialize

    ->Nginx reverse proxy routes all traffic

Open your browser to explore the platform.

🌐 Application URLs:
| Service             | URL                                              |
| ------------------- | ------------------------------------------------ |
| Frontend            | [http://localhost:5173](http://localhost:5173)   |
| Backend (via Nginx) | [http://localhost:8080](http://localhost:8080)   |
| RabbitMQ UI         | [http://localhost:15672](http://localhost:15672) |
| Mercure Hub         | [http://localhost:3000](http://localhost:3000)   |

Default RabbitMQ credentials:
    guest / guest

🧱 Tech Stack
Frontend

    ->Vite + React
      Handles user authentication, product browsing, order placement, and real-time updates.

Backend

    ->Symfony (PHP)
      Provides REST API for authentication, product management, synchronous order processing, and dispatching order notifications.

Database

    ->PostgreSQL
    Stores users, products, orders, categories, and related entities. Database migrations are applied automatically on startup.

Queue & Notifications

    ->RabbitMQ + Symfony Messenger – queues order-related notifications

    ->Mercure – delivers real-time notifications to connected users

Reverse Proxy

    ->Nginx – routes frontend, backend, and Mercure traffic, serving as the single entry point

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
Worker Container
      ↓
Mercure
      ↓
Frontend receives real-time notification

🐳 Dockerized Environment

Backend and frontend run in separate containers

Messenger worker runs in its own container, consuming notifications

PostgreSQL, RabbitMQ, and Mercure run in dedicated containers

Nginx acts as a reverse proxy for clean traffic routing

Stop the application: docker compose down

Remove volumes for a fresh start: docker compose down -v   

🎯 Project Highlights

Full-stack online marketplace demo

Users can register, list products, place orders

Synchronous order handling with asynchronous notifications

Real-time notifications via Mercure

Containerized architecture with Docker

Separate worker container for order notifications

Reverse proxy via Nginx for production-ready structure

Automated database migrations and seed data

Designed to showcase scalable and maintainable architecture