# 🐳 Docker CRUD Demo — Task Management App

A full-stack Task Management application built with **React, Node.js, Express, PostgreSQL, Docker, and Docker Compose**. This project demonstrates how to containerize a multi-service application, manage service communication, persist database data, and prepare Docker images for publishing to Docker Hub.

## 🚀 Features

- **Create Tasks:** Add new tasks to your list.
- **Read Tasks:** View all saved tasks.
- **Update Tasks:** Edit task titles and mark tasks as completed.
- **Delete Tasks:** Remove tasks you no longer need.
- **Persistent Storage:** PostgreSQL stores tasks using a Docker named volume.
- **Containerized Architecture:** Frontend, backend, and database run in separate containers.
- **Service Networking:** Docker Compose connects services through a private network.
- **Health Checks:** The backend waits for PostgreSQL to become healthy before starting.
- **Docker Hub Ready:** Backend and frontend images can be published and pulled from Docker Hub.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend tooling and build |
| Node.js | JavaScript runtime |
| Express.js | REST API development |
| PostgreSQL | Relational database |
| `pg` | PostgreSQL client for Node.js |
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |
| Docker Hub | Container image registry |

## 🏗️ Architecture

```text
                 User / Browser
                       |
                       | http://localhost:8081
                       v
              +-------------------+
              | React + Vite      |
              | Frontend          |
              | Container :80     |
              +-------------------+
                       |
                       | /api/tasks
                       v
              +-------------------+
              | Node.js + Express |
              | Backend           |
              | Container :3000   |
              +-------------------+
                       |
                       | SQL queries
                       v
              +-------------------+
              | PostgreSQL        |
              | Database          |
              | Container :5432   |
              +-------------------+
                       |
                       v
                Docker Volume
                  (pgdata)
```

The frontend communicates with the backend through the `/api` proxy configured in Vite. The backend connects to PostgreSQL using the Compose service hostname `db`.

## 📁 Project Structure

```text
hello-app/
├── backend/
│   ├── server.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── package-lock.json
├── .env
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 🔌 REST API Endpoints

Base URL: `http://localhost:8081`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Retrieve all tasks |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### Example: Create a Task

```http
POST /api/tasks
Content-Type: application/json
```

Request body:

```json
{
  "title": "Learn Docker"
}
```

Example response:

```json
{
  "id": 1,
  "title": "Learn Docker",
  "done": false
}
```

## ⚙️ Prerequisites

Install the following before running the project:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Docker Compose V2
- [Git](https://git-scm.com/)
- A GitHub account for source-code hosting
- A Docker Hub account for publishing images

Node.js is needed on the host if you want to install dependencies or work on the frontend locally. The Dockerfiles provide Node.js inside the containers.

## 🧑‍💻 Run Locally with Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/docker-crud-demo.git
cd docker-crud-demo
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username.

### 2. Configure environment variables

Create a `.env` file in the project root:

```dotenv
DOCKERHUB_USER=YOUR_DOCKERHUB_USERNAME
TAG=1.0
POSTGRES_USER=demo
POSTGRES_PASSWORD=change_me_for_local_use
POSTGRES_DB=taskdb
```

Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username.

**Security:** This example is for local development. Never commit `.env` or real credentials to GitHub. For production, use strong credentials and an appropriate secrets-management solution.

### 3. Build the Docker images

From the project root, run:

```bash
docker build -t YOUR_DOCKERHUB_USERNAME/hello-backend:1.0 ./backend
docker build -t YOUR_DOCKERHUB_USERNAME/hello-frontend:1.0 ./frontend
```

The image names must match `DOCKERHUB_USER` and `TAG` in `.env`.

### 4. Start the application

```bash
docker compose up -d
```

This starts the PostgreSQL database, backend API, and frontend.

### 5. Verify the containers

```bash
docker compose ps
```

Check that all three services are running and the database reports a healthy status.

### 6. Open the application

Visit:

**http://localhost:8081**

The frontend uses host port `8081` in this setup because port `8080` was already in use. To change it, update the left side of the frontend port mapping in `docker-compose.yml`.

### 7. View application logs

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

### 8. Stop the application

```bash
docker compose down
```

The named database volume is retained, so tasks remain available when the application starts again.

To remove the containers and delete the database volume as well:

```bash
docker compose down -v
```

**Warning:** The `-v` option permanently deletes the project's persisted database data.

## 📦 Publish Images to Docker Hub

Log in to Docker Hub:

```bash
docker login
```

Push the backend and frontend images:

```bash
docker push YOUR_DOCKERHUB_USERNAME/hello-backend:1.0
docker push YOUR_DOCKERHUB_USERNAME/hello-frontend:1.0
```

Replace the placeholder with your actual Docker Hub username.

To verify that the application can run using registry images rather than locally built images, remove the local application images after stopping the stack, then run:

```bash
docker compose pull
docker compose up -d
docker compose ps
```

Do not delete the database volume unless you intentionally want to reset your data.

## 🔒 Security Notes

- Keep `.env` out of version control.
- Do not publish database passwords, API keys, or other secrets.
- PostgreSQL and the backend are not directly published to the host in this Compose configuration.
- Use strong credentials and restrict allowed hosts for production deployments.
- The default demo credentials are not suitable for production.

## 🎯 Learning Outcomes

Through this project, I practiced:

- Building RESTful CRUD APIs with Express.
- Connecting a Node.js application to PostgreSQL.
- Writing Dockerfiles for frontend and backend services.
- Creating and managing multi-container applications with Docker Compose.
- Configuring service discovery, health checks, networks, and persistent volumes.
- Building, tagging, and publishing Docker images.
- Managing environment variables and protecting secrets.
- Using Git and GitHub for version control.

## 🔮 Future Improvements

- Add input validation and improved error handling.
- Introduce automated tests for API endpoints.
- Add authentication and authorization.
- Improve frontend styling and responsive design.
- Add CI/CD using GitHub Actions.
- Use a multi-stage frontend build and a production-grade static web server.
- Deploy the application to a cloud platform.

## 👨‍💻 Author

**Harsh Aditya**

- GitHub: [Harshaditya1](https://github.com/Harshaditya1)

---

⭐ If you find this project useful for learning Docker and full-stack development, feel free to explore the repository and suggest improvements.
