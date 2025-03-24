---
title: dify 实践
date: 2025-03-11
---

# Docker搭建

## 部署

```
cd dify/docker
cp .env.example .env
docker compose up -d
```

## 更新

```
cd dify/docker
docker compose down
git pull origin main
docker compose pull
docker compose up -d
```

- 如果 `.env.example` 文件有更新，请务必同步修改你本地的 `.env` 文件。
- 检查 `.env` 文件中的所有配置项，确保它们与你的实际运行环境相匹配。你可能需要将 `.env.example` 中的新变量添加到 `.env` 文件中，并更新已更改的任何

### 在 Windows 上设置环境变量

如果是docker环境，需要吧ollama暴露给docker，在 Windows 上，Ollama 继承了你的用户和系统环境变量。

1. 首先通过任务栏点击 Ollama 退出程序
2. 从控制面板编辑系统环境变量
3. 为你的用户账户编辑或新建变量，比如 `OLLAMA_HOST`、`OLLAMA_MODELS` 等。赋值为0.0.0.0
4. 点击 OK / 应用保存
5. 在一个新的终端窗口运行 `ollama`

## install转圈圈，502问题处理

```
docker ps -q | ForEach-Object { 
    docker inspect --format '{{ .Name }}: {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $_
}
```

在输出内容中找到这两行：

```
/docker-web-1: 172.18.0.2
/docker-api-1: 172.19.0.9
```

记住后面的IP地址。然后打开你存放dify源代码的地方，打开`dify/docker/nginx/conf.d`,将`http://api:5001`替换为`http://172.19.0.9:5001`,将`http://web:3000`替换为`http://172.19.0.2:3000`，随后重启Nginx容器或者重载配置。 这些IP地址是_**示例性**_ 的，你必须执行命令获取你自己的IP地址，不要直接填入。 你可能在重新启动相关容器时需要再次根据IP进行配置。

# 源码环境搭建

## windows

#### 第三方中间件配置

```shell
git clone https://github.com/langgenius/dify.git

cd docker
cp middleware.env.example middleware.env
docker compose -f docker-compose.middleware.yaml up -d
```

如果遇到网络问题报错：

> Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:5433 -> 127.0.0.1:0: listen tcp 0.0.0.0:5433: bind: An attempt was made to access a socket in a way forbidden by its access permissions.

需要重启主机网络解决，管理员运行shell，运行：

```shell
net stop hns
net start hns
```

#### 服务端配置

**python版本切换方案**

dify需要指定python版本3.12

```shell
# windows
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "./install-pyenv-win.ps1"; &"./install-pyenv-win.ps1"
# linux
pip install pyenv																			

# 安装并转换
pyenv install 3.12
pyenv global 3.12


```

启动服务

```
cd api
cp .env.example .env
```

生成密钥

```
# linux
awk -v key="$(openssl rand -base64 42)" '/^SECRET_KEY=/ {sub(/=.*/, "=" key)} 1' .env > temp_env && mv temp_env .env

# windows
$key = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(42))
(Get-Content .env) | ForEach-Object {
    if ($_ -match '^SECRET_KEY=') {
        "SECRET_KEY=$key"
    } else {
        $_
    }
} | Set-Content -Path temp_env
Move-Item -Path temp_env -Destination .env -Force
```

安装依赖

```
pip install poetry
poetry env use 3.12
poetry install
```

开启服务

```
# 安装shell插件并启动shell
poetry self add poetry-plugin-shell
poetry shell

# 初始化flask数据库
flask db upgrade
```

Start the API server

```
flask run --host 0.0.0.0 --port=5001 --debug
```

Start the Worker service

```
# linux
celery -A app.celery worker -P gevent -c 1 --loglevel INFO -Q dataset,generation,mail,ops_trace
# windows
celery -A app.celery worker -P solo --without-gossip --without-mingle -Q dataset,generation,mail,ops_trace --loglevel INFO

```

#### web配置

```
cd web
npm install -g pnpm
pnpm install
npm run build

# 修改 package.json让windows可用
"start": "xcopy /E /I /Y .next\\static .next\\standalone\\.next\\static && xcopy /E /I /Y public .next\\standalone\\public && cross-env PORT=%npm_config_port% HOSTNAME=%npm_config_host% node .next\\standalone\\server.js",

npm run start --host=localhost --port=3000
```

#### 访问

http://127.0.0.1:3000/