# EvanAIRegPlatform — Production Dockerfile
FROM python:3.12-slim AS builder

WORKDIR /build
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /build/wheels -r requirements.txt

FROM python:3.12-slim AS runtime

RUN groupadd -r evan && useradd -r -g evan evan

WORKDIR /app
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONFAULTHANDLER=1

COPY --from=builder /build/wheels /tmp/wheels
COPY requirements.txt .
RUN pip install --no-cache-dir --find-links=/tmp/wheels -r requirements.txt && rm -rf /tmp/wheels

COPY backend/ ./backend/
COPY frontend/dist/ ./frontend/dist/
COPY evanaireg.db ./evanaireg.db
COPY .env ./.env

EXPOSE 8100

CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8100"]
