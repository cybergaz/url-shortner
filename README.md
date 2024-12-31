# URL Shortener API

A robust URL shortener service that allows users to create short links, track analytics, and manage their links efficiently.

## Features
- Generate short URLs with custom aliases.
- Detailed analytics for each short URL, including total clicks, unique users, OS, and device types.
- Topic-based analytics for managing URLs by category.
- Comprehensive overall analytics for user performance.
- Google OAuth integration for secure login.

---

## Table of Contents
1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Usage](#usage)
4. [API Documentation](#api-documentation)
    - [Google Login API](#google-login-api)
    - [Create Short URL API](#create-short-url-api)
    - [Redirect API](#redirect-api)
    - [Get URL Analytics API](#get-url-analytics-api)
    - [Get Topic-Based Analytics API](#get-topic-based-analytics-api)
    - [Get Overall Analytics API](#get-overall-analytics-api)
5. [Testing](#testing)
6. [License](#license)

---

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/url-shortener.git
    cd url-shortener
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up the environment variables by creating a `.env` file in the root directory:
    ```env
    DATABASE_URL=<your-database-url>
    GOOGLE_CLIENT_ID=<your-google-client-id>
    GOOGLE_CLIENT_SECRET=<your-google-client-secret>
    JWT_SECRET=<your-jwt-secret>
    ```

---

## Configuration

Ensure you have the following tools installed:
- Node.js v18 or above
- PostgreSQL or any compatible database

Run database migrations if needed:
```bash
npm run migrate

### 3. Redirect API

**Endpoint:** `/api/shorten/{alias}`  
**Method:** `GET`

#### Path Parameters:
- **alias**: The custom alias of the short URL.

#### Response:
- **301 Redirect**: Redirects to the original long URL.
- **404 Not Found**: Alias not found.

---

### 4. Get URL Analytics API

**Endpoint:** `/api/analytics/{alias}`  
**Method:** `GET`

#### Headers:
- **Authorization:** `Bearer <JWT_TOKEN>`

#### Path Parameters:
- **alias**: The custom alias of the short URL.

#### Response:
```json
{
    "totalClicks": 100,
    "uniqueUsers": 80,
    "clicksByDate": [
        { "date": "2025-01-01", "clicks": 20 },
        { "date": "2025-01-02", "clicks": 30 }
    ],
    "osType": [
        { "osName": "Windows", "uniqueClicks": 50, "uniqueUsers": 40 },
        { "osName": "macOS", "uniqueClicks": 20, "uniqueUsers": 15 }
    ],
    "deviceType": [
        { "deviceName": "mobile", "uniqueClicks": 70, "uniqueUsers": 60 },
        { "deviceName": "desktop", "uniqueClicks": 30, "uniqueUsers": 20 }
    ]
}

### 5. Get Topic-Based Analytics API

**Endpoint:** `/api/analytics/topic/{topic}`  
**Method:** `GET`

#### Headers:
- **Authorization:** `Bearer <JWT_TOKEN>`

#### Path Parameters:
- **topic**: The topic under which the URLs are grouped.

#### Response:
```json
{
    "totalClicks": 500,
    "uniqueUsers": 300,
    "clicksByDate": [
        { "date": "2025-01-01", "clicks": 100 },
        { "date": "2025-01-02", "clicks": 150 }
    ],
    "urls": [
        {
            "shortUrl": "http://short.ly/abc123",
            "totalClicks": 200,
            "uniqueUsers": 150
        },
        {
            "shortUrl": "http://short.ly/xyz456",
            "totalClicks": 300,
            "uniqueUsers": 200
        }
    ]
}

### 6. Get Overall Analytics API

**Endpoint:** `/api/analytics/overall`  
**Method:** `GET`

#### Headers:
- **Authorization:** `Bearer <JWT_TOKEN>`

#### Response:
```json
{
    "totalUrls": 10,
    "totalClicks": 2000,
    "uniqueUsers": 1000,
    "clicksByDate": [
        { "date": "2025-01-01", "clicks": 400 },
        { "date": "2025-01-02", "clicks": 600 }
    ],
    "osType": [
        { "osName": "Linux", "uniqueClicks": 1000, "uniqueUsers": 800 },
        { "osName": "iOS", "uniqueClicks": 600, "uniqueUsers": 400 }
    ],
    "deviceType": [
        { "deviceName": "tablet", "uniqueClicks": 500, "uniqueUsers": 300 },
        { "deviceName": "desktop", "uniqueClicks": 1500, "uniqueUsers": 700 }
    ]
}