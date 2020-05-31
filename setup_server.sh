#!/usr/bin/env bash

# OTHER INSTRUCTIONS:
# make sure to have .env file
#
# this is required for SSL cert
# create public ip from ec2 (elastic public ip4)
# setup custom resource records to the following
#   name: @    type: A   data: public_ip_addr
#   name: www  type: A   data: public_ip_addr


installSoftware() {
    printf '****************************** install software ****************************** \n'
    cd /home/ubuntu
    sudo apt-get update
    sudo add-apt-repository -y ppa:deadsnakes/ppa
    sudo add-apt-repository -y ppa:certbot/certbot
    sudo add-apt-repository universe
    sudo apt-get update
    sudo apt-get install software-properties-common python-certbot-nginx build-essential
    sudo apt-get install nginx python-pip python3-pip nodejs npm python3-venv certbot python3-certbot-nginx
}

setupNginx() {
    printf '****************************** setup nginx ****************************** \n'
    sudo rm -rf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
    sudo bash -c 'cat > /etc/nginx/sites-available/track-square.nginx <<EOF
server {
    listen 80;
    root /home/ubuntu/track-square/build;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
        add_header Cache-Control "no-cache";
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
    pip install -r requirements.txt
    pip install gunicorn
}

startGunicorn() {
    printf '****************************** start gunicorn ****************************** \n'
    cd /home/ubuntu/track-square

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

enableSSL() {
    printf '****************************** enable SSL ****************************** \n'
    sudo rm -rf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
    sudo rm /etc/nginx/sites-available/track-square.nginx
    sudo rm /etc/nginx/sites-enabled/track-square.nginx
    sudo bash -c 'cat > /etc/nginx/sites-available/track-square.nginx <<EOF
server {
    listen 80;
    server_name tracksquare.app www.tracksquare.app;
    location ~ /.well-known {
        root /home/ubuntu/cert;
    }
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name tracksquare.app www.tracksquare.app;
    ssl_certificate /etc/letsencrypt/live/tracksquare.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tracksquare.app/privkey.pem;
    root /home/ubuntu/track-square/build;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-cache";
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

    sudo certbot certonly --webroot -w /home/ubuntu/track-square/build -d tracksquare.app -d www.tracksquare.app
    sudo systemctl daemon-reload
    sudo systemctl start track-square
    sudo systemctl start nginx
    sudo systemctl reload nginx
}

run() {
    installSoftware
    setupNginx
    installRepoDependencies
    startGunicorn
    # enableSSL
}

run