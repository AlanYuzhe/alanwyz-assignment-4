PYTHON=python3

install:
	$(PYTHON) -m pip install -r backend/requirements.txt
	cd frontend && npm install

run:
	$(PYTHON) backend/app.py &
	cd frontend && npm start

clean:
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -exec rm -r {} +
	rm -rf frontend/node_modules

stop:
	pkill -f "app.py"

install-all: install

run-all: run