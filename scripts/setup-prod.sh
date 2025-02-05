#!/bin/bash

echo "Setting up production environment..."

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Check if PM2 is installed
if ! command -v pm2 >/dev/null 2>&1; then
    echo "Installing PM2..."
    npm install -g pm2 || handle_error "Failed to install PM2"
fi

# Check if nginx is installed
if ! command -v nginx >/dev/null 2>&1; then
    echo "Installing nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx || handle_error "Failed to install nginx"
fi

# Build projects
echo "Building projects..."
./rebuild.sh || handle_error "Failed to build projects"

# Setup nginx configuration
echo "Setting up nginx configuration..."
sudo tee /etc/nginx/sites-available/battle-arena << EOF
server {
    listen 80;
    server_name battle-arena.com;

    # Frontend
    location / {
        root /var/www/battle-arena;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/battle-arena /etc/nginx/sites-enabled/
sudo nginx -t || handle_error "Invalid nginx configuration"
sudo systemctl restart nginx

# Copy frontend build to nginx directory
sudo mkdir -p /var/www/battle-arena
sudo cp -r frontend/build/* /var/www/battle-arena/

# Start backend with PM2
cd backend || handle_error "Backend directory not found"
pm2 start dist/index.js --name battle-arena-backend || handle_error "Failed to start backend"
pm2 save

echo "Production environment setup completed!"
echo "Please ensure you have set up your domain DNS to point to this server"
echo "and configured SSL certificates using certbot or similar tool."
