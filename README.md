# Metagross

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/BullMQ-FF0000?style=for-the-badge&logoColor=white" alt="BullMQ" />
  <img src="https://img.shields.io/badge/React_Flow-FF0072?style=for-the-badge&logo=react&logoColor=white" alt="React Flow" />
</p>

<p align="center">
  <strong>A Multi-Agent Workflow Execution Engine built on DAG-based orchestration</strong>
</p>

<p align="center">
  Drag. Connect. Execute. — Build intelligent multi-agent pipelines visually and run them at scale.
</p>

---

## Overview

**Metagross** is a Multi-Agent Workflow Execution Engine. Users compose AI agent pipelines on a visual canvas by dragging and dropping agents and connecting them into a **Directed Acyclic Graph (DAG)**. The backend resolves dependencies, executes agents in parallel where possible, and streams real-time status updates back to the frontend.

Each agent runs a **tool-calling loop** powered by OpenAI, allowing it to use external tools iteratively until its task is complete. Agents can be paired with **critic agents** that challenge their output before the workflow proceeds — and a **cost optimizer** dynamically routes tasks to cheaper or more capable models based on node stakes.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React Flow)                    │
│   Drag & drop canvas → builds workflow graph → calls REST API   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         NestJS Backend                           │
│                                                                  │
│  ┌─────────────┐    ┌──────────────────┐    ┌────────────────┐  │
│  │  Workflow   │    │   Orchestrator   │    │   Execution    │  │
│  │  Controller │───▶│    Service       │───▶│    Service     │  │
│  └─────────────┘    └────────┬─────────┘    └───────┬────────┘  │
│                              │                       │           │
│                    ┌─────────▼─────────┐             │           │
│                    │    DAG Service    │             │           │
│                    │  (dependency      │             │           │
│                    │   resolution)     │             │           │
│                    └─────────┬─────────┘             │           │
│                              │                       │           │
│                    ┌─────────▼──────────────────┐    │           │
│                    │     BullMQ Queue           │    │           │
│                    │  (orchestrator queue)      │    │           │
│                    └─────────┬──────────────────┘    │           │
│                              │                       │           │
│                    ┌─────────▼──────────────────┐    │           │
│                    │    Agent Consumer           │    │           │
│                    │  (worker processor)         │    │           │
│                    │  - Tool-calling loop        │    │           │
│                    │  - Critic agent pair        │    │           │
│                    │  - Model cost routing       │    │           │
│                    └─────────┬──────────────────┘    │           │
└──────────────────────────────┼───────────────────────┼───────────┘
                               │                       │
               ┌───────────────▼──────┐   ┌────────────▼──────────┐
               │  Redis Pub/Sub       │   │        MySQL           │
               │  agent-completed     │   │  workflows, executions │
               │  channel             │   │  agent_executions      │
               └───────────────┬──────┘   └───────────────────────┘
                               │
               ┌───────────────▼──────┐
               │  SSE Stream          │
               │  (real-time updates  │
               │   to frontend)       │
               └──────────────────────┘
```

### Execution Flow

1. User submits a workflow graph (nodes + edges) via the API.
2. **DAG Service** resolves the dependency map from the graph edges.
3. **Orchestrator Service** identifies agents with no dependencies (root nodes) and enqueues them.
4. **Agent Consumer** processes each job: runs the tool-calling loop, optionally challenges output with a critic agent, and publishes an `agent-completed` event to Redis.
5. **Orchestrator** listens on the Redis `agent-completed` channel, checks if all dependencies for downstream agents are satisfied, and enqueues the next wave.
6. Real-time status updates are pushed to the frontend via **SSE**.
7. When all agents complete, the execution is marked `completed` in MySQL.

---

## Features

| Feature                     | Description                                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **DAG Execution**           | Workflows are modeled as directed acyclic graphs with full dependency resolution                                      |
| **Parallel Execution**      | Independent agents execute concurrently — no unnecessary waiting                                                      |
| **Tool-Calling Loop**       | Each agent runs an iterative OpenAI tool-calling loop until the task is complete                                      |
| **Adversarial Agent Pairs** | Every agent has an optional critic agent that challenges its output before the workflow proceeds                      |
| **Cost Optimizer**          | Dynamically routes low-stakes nodes to cheap models (e.g. Haiku) and high-stakes nodes to capable models (e.g. GPT-4) |
| **Real-Time Streaming**     | Execution status and agent output streamed to the frontend via Server-Sent Events (SSE)                               |
| **Visual Canvas**           | React Flow-based drag-and-drop interface to compose workflows without writing code                                    |
| **Workflow Persistence**    | Workflows and execution history stored in MySQL via TypeORM                                                           |

---

## Tech Stack

### Backend

| Layer          | Technology                                 |
| -------------- | ------------------------------------------ |
| Framework      | [NestJS](https://nestjs.com/) + TypeScript |
| Job Queue      | [BullMQ](https://docs.bullmq.io/)          |
| Message Broker | Redis Pub/Sub                              |
| Database       | MySQL + TypeORM                            |
| LLM            | OpenAI (GPT-4, Haiku)                      |
| Streaming      | Server-Sent Events (SSE)                   |

### Frontend

| Layer   | Technology                           |
| ------- | ------------------------------------ |
| Canvas  | [React Flow](https://reactflow.dev/) |
| Runtime | React + TypeScript                   |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Redis (running locally or via Docker)
- MySQL
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/metagross.git
cd metagross

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=metagross

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OpenAI
OPENAI_API_KEY=sk-...

# App
PORT=3000
NODE_ENV=development
```

### Database Migrations

```bash
# Run all pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert
```

### Running the App

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## API Overview

### Workflows

| Method   | Endpoint        | Description           |
| -------- | --------------- | --------------------- |
| `POST`   | `/workflow`     | Create a new workflow |
| `GET`    | `/workflow`     | List all workflows    |
| `GET`    | `/workflow/:id` | Get a workflow by ID  |
| `DELETE` | `/workflow/:id` | Delete a workflow     |

### Executions

| Method | Endpoint         | Description                      |
| ------ | ---------------- | -------------------------------- |
| `POST` | `/execution`     | Start a workflow execution       |
| `GET`  | `/execution/:id` | Get execution status and results |

### Streaming

| Method | Endpoint               | Description                                |
| ------ | ---------------------- | ------------------------------------------ |
| `GET`  | `/stream/:executionId` | SSE stream for real-time execution updates |

#### Example: Start an Execution

```bash
curl -X POST http://localhost:3000/execution \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": 1,
    "input": "Analyze the market trends for electric vehicles in 2025"
  }'
```

#### Example: Stream Execution Updates

```bash
curl -N http://localhost:3000/stream/42
```

---

## Project Structure

```
src/
├── modules/
│   ├── execution/          # Execution CRUD + status management
│   ├── workflow/           # Workflow CRUD
│   └── stream/             # SSE streaming controller
├── service/
│   ├── orchestrator/       # DAG orchestration + Redis pub/sub listener
│   ├── dag/                # Dependency resolution logic
│   ├── agent/              # OpenAI tool-calling loop + critic logic
│   └── hash/               # Utility hashing service
├── queue/
│   └── agentconsumer/      # BullMQ worker — processes individual agent jobs
├── database/
│   ├── entities/           # TypeORM entities (Workflow, Execution, AgentExecution)
│   └── migrations/         # Database migration files
└── config/
    └── typeorm.config.ts   # TypeORM datasource configuration
```

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add critic agent timeout handling"`
4. Push to your branch: `git push origin feat/your-feature-name`
5. Open a Pull Request and describe the motivation and implementation

### Guidelines

- Keep PRs focused — one feature or fix per PR
- Add or update tests where relevant
- Ensure `npm run lint` passes before submitting

---

## License

[MIT](LICENSE)
