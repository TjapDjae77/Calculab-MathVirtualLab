FROM python:3.9-slim
WORKDIR /app
COPY backend/ .  
COPY frontend/ ./frontend
COPY ./backend/staticfiles /app/staticfiles
RUN pip install --no-cache-dir -r requirements.txt
CMD ["gunicorn", "-b", "0.0.0.0:8000", "backend_calculab.wsgi:application"]
