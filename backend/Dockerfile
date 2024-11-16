# Menggunakan Python versi slim sebagai base image
FROM python:3.9-slim

# Menentukan working directory di container
WORKDIR /app

# Menyalin semua file proyek ke dalam container
COPY ./backend /app
COPY ./.env /app/.env
COPY frontend/ ./frontend
COPY ./backend/staticfiles /app/staticfiles

# Menginstal dependensi
RUN pip install --no-cache-dir -r requirements.txt

# Menjalankan collectstatic tanpa input
RUN python manage.py collectstatic --noinput

# Menjalankan perintah untuk memulai server Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
