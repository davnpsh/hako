#!/bin/sh

# Run Docker daemon
dockerd &

# Start development server
npm start
