PYTHON := python3.11
VENV := backend/venv

.PHONY: help install install-client install-backend dev dev-client dev-backend build lint clean

help:
	@echo "make install         install both client and backend deps"
	@echo "make dev-client      run the Vite dev server"
	@echo "make dev-backend     run the FastAPI dev server (reload)"
	@echo "make build           build the client for production"
	@echo "make lint            lint the client"
	@echo "make clean           remove venv, node_modules, build output"

install: install-client install-backend

install-client:
	cd client && npm install

install-backend:
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/pip install -r backend/requirements.txt

dev: dev-backend dev-client

dev-client:
	cd client && npm run dev

dev-backend:
	cd backend && venv/bin/uvicorn app.main:app --reload --port 8000

build:
	cd client && npm run build

lint:
	cd client && npm run lint

clean:
	rm -rf $(VENV) client/node_modules client/dist
