FROM python:3.9-slim
WORKDIR /app
COPY ./backend /app
RUN pip install --no-cache-dir -r requirements.txt
COPY ./backend/staticfiles /app/staticfiles
RUN python manage.py collectstatic --noinput
EXPOSE 8080
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
