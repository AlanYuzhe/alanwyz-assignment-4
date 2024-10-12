PYTHON=python3
VENV_DIR=backend/.venv

install:
	test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	$(PYTHON) -m pip install --upgrade pip  # 确保pip是最新版本
	$(VENV_DIR)/bin/python -m pip install -r backend/requirements.txt
	cd frontend && npm install

run:
	$(VENV_DIR)/bin/python backend/app.py &
	cd frontend && npm start

clean:
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -exec rm -r {} +
	rm -rf $(VENV_DIR)
	rm -rf frontend/node_modules

stop:
	pkill -f "app.py"

install-all: install

run-all: run