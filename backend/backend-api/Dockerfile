FROM python:3.12-slim

WORKDIR /app

# Install setuptools which includes distutils (required for Poetry in Python 3.12)
RUN pip install setuptools && \
    pip install poetry==1.4.2

COPY pyproject.toml poetry.lock* ./
RUN poetry config virtualenvs.create false && \
    poetry install --no-dev --no-interaction --no-ansi

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
