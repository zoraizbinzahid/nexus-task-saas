# Use an official Python image 
FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffer stdout/siderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container 
WORKDIR /app

# Install dependencies
# We copy them irst so Docker caches them (makes builds faster)
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code
COPY . /app/

# Expose the port Django runs on 
EXPOSE 8000

# Start the server
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]

