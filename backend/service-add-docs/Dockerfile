# service-add-docs/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Cassandra driver
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app directory into /app/app
COPY ./app ./app

# Expose port 8001
EXPOSE 8001

# Run uvicorn (we point to app.main because main.py is inside the app folder)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]