# Intelligent File Deduplication & Storage Optimization System

An intelligent full-stack file management and storage optimization platform that detects duplicate files based on file content, organizes duplicate files into groups, calculates potential storage savings, and provides safe mechanisms for managing redundant files.

The system is designed to handle file uploads efficiently, process hashing asynchronously using Celery and Redis, provide detailed file and duplicate analytics, and maintain secure deletion and audit history.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [Functional Requirements](#functional-requirements)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Application Flow](#application-flow)
- [Project Structure](#project-structure)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Design](#database-design)
- [Duplicate Detection](#duplicate-detection)
- [Asynchronous Processing](#asynchronous-processing)
- [Authentication and Authorization](#authentication-and-authorization)
- [File Management](#file-management)
- [Safe Deletion](#safe-deletion)
- [Search and Filtering](#search-and-filtering)
- [Dashboard and Analytics](#dashboard-and-analytics)
- [Audit Logging](#audit-logging)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Local Development Setup](#local-development-setup)
- [Environment Configuration](#environment-configuration)
- [Docker Setup](#docker-setup)
- [Docker Services](#docker-services)
- [Running the Application with Docker](#running-the-application-with-docker)
- [Running the Backend Locally](#running-the-backend-locally)
- [Running the Frontend Locally](#running-the-frontend-locally)
- [Testing](#testing)
- [Postman Testing](#postman-testing)
- [Duplicate Detection Testing](#duplicate-detection-testing)
- [File Storage](#file-storage)
- [Security Considerations](#security-considerations)
- [Performance Considerations](#performance-considerations)
- [Database Migrations](#database-migrations)
- [Troubleshooting](#troubleshooting)
- [Production Considerations](#production-considerations)
- [Project Verification](#project-verification)
- [Future Enhancements](#future-enhancements)
- [Conclusion](#conclusion)

---

# Project Overview

The Intelligent File Deduplication & Storage Optimization System is a full-stack web application designed to help users manage files and identify redundant storage consumption.

The system does not depend on filenames to identify duplicates. Instead, uploaded files are processed using content hashing. When two or more files have identical content, they produce the same hash value and can therefore be identified as duplicates even when:

- Their filenames are different.
- They were uploaded at different times.
- They exist in different logical locations.
- Their metadata differs.

The application provides users with a centralized interface to:

- Upload files.
- View uploaded files.
- Search and filter files.
- View file metadata.
- Download files.
- Identify duplicate files.
- View duplicate groups.
- Calculate potential storage savings.
- Review deletion impact before deleting files.
- Safely delete redundant files.
- Review deletion history.
- Review audit logs.
- Monitor storage usage through dashboard analytics.

The application uses FastAPI for the backend, React with TypeScript for the frontend, MySQL for persistent data, Redis as the message broker, and Celery for asynchronous file-processing operations.

---

# Objectives

The main objectives of the system are:

1. Detect files with identical content using cryptographic hashing.
2. Identify duplicates independently of filenames.
3. Organize duplicate files into meaningful duplicate groups.
4. Calculate the amount of storage consumed by redundant files.
5. Calculate potential storage savings.
6. Process large-file hashing asynchronously.
7. Avoid loading entire files into application memory.
8. Provide secure file upload and download functionality.
9. Provide search, filtering, sorting, and pagination.
10. Prevent unsafe deletion of protected files.
11. Provide deletion impact information before deletion.
12. Maintain deletion history and audit logs.
13. Provide dashboard-level storage analytics.
14. Provide REST APIs documented through Swagger/OpenAPI.
15. Provide a containerized deployment using Docker Compose.

---

# Key Features

## File Management

The system supports:

- File upload.
- File listing.
- File details.
- File metadata.
- File download.
- File deletion.
- Search.
- Filtering.
- Sorting.
- Pagination.

---

## Content-Based Duplicate Detection

Duplicate detection is based on file content rather than filename.

For example:

```text
report.pdf
report-copy.pdf
final-report.pdf



Application Flow
File Upload Flow
User selects file
       |
       v
React upload interface
       |
       v
POST /files/upload
       |
       v
FastAPI validates request
       |
       v
File stored in storage
       |
       v
File metadata persisted
       |
       v
Background processing triggered
       |
       v
Celery Worker
       |
       v
Content hash calculated
       |
       v
Hash stored in database
       |
       v
Existing matching hash checked
       |
       v
Duplicate relationship detected
       |
       v
Dashboard and duplicate groups updated

Project Structure
The project is organized into backend, frontend, database migration, infrastructure, and documentation components.
intelligent-file-deduplication/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   ├── core/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── tasks/
│   │   └── utils/
│   │
│   ├── alembic/
│   │   └── versions/
│   │
│   ├── storage/
│   │   ├── uploads/
│   │   └── temp/
│   │
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── alembic.ini
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── theme/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── README.md
└── Postman collection/environment files

Backend Architecture
The backend follows a layered architecture.
API Layer
    |
    v
Schema Validation
    |
    v
Service Layer
    |
    v
Repository Layer
    |
    v
SQLAlchemy Models
    |
    v
MySQL

Background processing is handled separately:
API
 |
 v
Celery Task
 |
 v
Redis
 |
 v
Celery Worker
 |
 v
Hashing / Deduplication
 |
 v
Database

This separation keeps API request handling independent from potentially expensive file-processing operations.
Frontend Architecture
The frontend is implemented using React and TypeScript.
Major areas include:
Authentication
Dashboard
File Management
Duplicate Groups
Deletion History
Audit Logs
Error Pages
Shared Components
API Services
Application Routing
Theme

The frontend communicates with the FastAPI backend using Axios.
Protected routes require an authenticated user session.
Database Design
The application uses MySQL 8.0 as its persistent relational database.
The main logical entities are:
users
files
file_hashes
duplicate_groups
file_metadata
deletion_history
audit_logs