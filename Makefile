PYTHON=python3
VENV_DIR=backend/.venv

install:
	# 在backend目录中创建虚拟环境（如果不存在）
	test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	# 激活虚拟环境并安装依赖
	. $(VENV_DIR)/bin/activate && $(VENV_DIR)/bin/pip install -r backend/requirements.txt
	# 安装前端依赖项
	cd frontend && npm install

run:
	# 启动后端服务
	. $(VENV_DIR)/bin/activate && $(VENV_DIR)/bin/python backend/app.py &
	# 启动前端服务
	cd frontend && npm start

clean:
	# 删除Python缓存和依赖文件夹
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -exec rm -r {} +
	rm -rf $(VENV_DIR)
	rm -rf frontend/node_modules

stop:
	# 停止所有在后台运行的Flask服务
	pkill -f "app.py"

install-all: install

run-all: run