# CardBill

A FastAPI-based backend for a financial platform that enables users to trade cryptocurrencies and gift cards, manage their profile, and engage with admin support.

## Features

- **Authentication System**
  - Login/Signup
  - Email verification
  - Password recovery
  - JWT token-based authentication

- **User Features**
  - Buy/Sell cryptocurrencies
  - Buy/Sell gift cards
  - Profile management
  - Withdrawal processing
  - Chat support
  - VTU (Virtual Top-Up) services

- **Admin Features**
  - User management
  - Transaction oversight
  - Crypto and gift card management
  - Withdrawal approval
  - Customer support

## Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd cardbill
```

2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
# Edit .env file with your configuration
```

5. Run database migrations
```bash
alembic upgrade head
```

6. Start the server
```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

API documentation is automatically generated and available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

- `app/`: Main application
  - `api/`: API endpoints
  - `core/`: Core functionality (config, security)
  - `crud/`: Database operations
  - `db/`: Database initialization and session
  - `models/`: SQLAlchemy models
  - `schemas/`: Pydantic schemas
  - `utils/`: Utility functions
- `migrations/`: Alembic migrations

## License

This project is licensed under the MIT License - see the LICENSE file for details.