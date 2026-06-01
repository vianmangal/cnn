FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL=https://
ENV VITE_API_URL=$VITE_API_URL

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend ./
RUN npm run build
