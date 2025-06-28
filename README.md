# Chat Application Backend

This is a real-time chat application backend built with FastAPI. The application supports user authentication, chat rooms, and real-time messaging through WebSocket.

## Features

- User registration and authentication
- User profile management
- Chat room creation and management
- Real-time messaging with WebSocket
- Message storage and retrieval

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (for user data) and MongoDB (for messages)
- **ORM**: SQLAlchemy
- **WebSocket**: For real-time communication
- **Dependency Management**: pip and requirements.txt

## Project Structure

```
chat-backend
├── app
│   ├── main.py                # Entry point of the application
│   ├── api                    # API endpoints
│   ├── core                   # Core functionalities (config, database)
│   ├── models                 # Database models
│   ├── schemas                # Pydantic schemas for data validation
│   ├── services               # Business logic
│   └── utils                  # Utility functions
├── alembic                    # Database migration scripts
├── alembic.ini                # Alembic configuration
├── requirements.txt           # Project dependencies
└── README.md                  # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd chat-backend
   ```

2. **Create a virtual environment**:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

4. **Configure the database**:
   Update the database connection settings in `app/core/config.py`.

5. **Run database migrations**:
   ```
   alembic upgrade head
   ```

6. **Start the FastAPI application**:
   ```
   uvicorn app.main:app --reload
   ```

## Usage

- Access the API documentation at `http://localhost:8000/docs`.
- Use the `/auth` endpoints for user authentication.
- Use the `/users` endpoints for user management.
- Use the `/rooms` endpoints for chat room management.
- Use the `/messages` endpoints for message handling.
- Use the `/ws` endpoint for real-time WebSocket communication.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.