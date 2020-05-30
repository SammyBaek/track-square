#!/usr/bin/env bash

installSoftware() {
    printf '****************************** install software ****************************** \n'
    cd /home/ubuntu
    sudo apt-get update
    sudo add-apt-repository -y ppa:deadsnakes/ppa
    sudo add-apt-repository -y ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install software-properties-common python-certbot-nginx build-essential
    sudo apt-get install nginx python-pip python3-pip nodejs npm gunicorn python3-venv
}

setupNginx() {
    printf '****************************** setup nginx ****************************** \n'
    sudo rm -rf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
    sudo bash -c 'cat > /etc/nginx/sites-available/track-square.nginx <<EOF
    server {
        listen 80;
        server_name tracksquare.app www.tracksquare.app;
        root /home/ubuntu/track-square/build;
        index index.html;

        location / {
            try_files $uri $uri/ =404;
            add_header Cache-Control "no-cache";
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_cache_bypass \$http_upgrade;
            proxy_redirect off;

        }

        location /static {
            expires 1y;
            add_header Cache-Control "public";
        }

        location /api {
            include proxy_params;
            proxy_pass http://localhost:5000;
        }
    }
    '

    sudo ln -s /etc/nginx/sites-available/track-square.nginx /etc/nginx/sites-enabled/track-square.nginx
    sudo systemctl reload nginx
}

installRepoDependencies() {
    printf '****************************** install repo dependencies ****************************** \n'
    cd /home/ubuntu/track-square
    sudo npm install -g npm@latest
    sudo npm install
    npm run build

    cd /home/ubuntu/track-square/server
    python3 -m venv venv
    source venv/bin/activate
    sudo pip3 install -r requirements.txt
    sudo pip3 install gunicorn
    sudo pip install gunicorn
}

startGunicorn() {
    printf '****************************** start gunicorn ****************************** \n'
    cd /home/ubuntu/track-square
    sudo gunicorn -b 127.0.0.1:5000 "server:create_app()"

    sudo bash -c 'cat > /etc/systemd/system/track-square.service <<EOF
    [Unit]
    Description=A simple Flask API
    After=network.target

    [Service]
    User=ubuntu
    WorkingDirectory=/home/ubuntu/track-square
    ExecStart=/home/ubuntu/track-square/server/venv/bin/gunicorn -b 127.0.0.1:5000 "server:create_app()"
    Restart=always

    [Install]
    WantedBy=multi-user.target
    '

    sudo systemctl daemon-reload
    sudo systemctl start track-square

    sudo systemctl reload nginx
}

run() {
    installSoftware
    setupNginx
    installRepoDependencies
    startGunicorn
}

run