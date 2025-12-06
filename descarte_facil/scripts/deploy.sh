#!/bin/bash
# deploy.sh - Script de deploy automatizado

set -e  # Para em caso de erro

echo "🚀 INICIANDO DEPLOY - DESCARTE FÁCIL"
echo "========================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está como root
if [ "$EUID" -eq 0 ]; then
    log_error "Não execute como root/sudo!"
    exit 1
fi

# 1. Atualizar sistema
log_info "Atualizando sistema..."
sudo apt update
sudo apt upgrade -y

# 2. Verificar/Instalar dependências
log_info "Verificando dependências..."

# PostgreSQL
if ! systemctl is-active --quiet postgresql; then
    log_warn "PostgreSQL não está rodando. Instalando..."
    sudo apt install postgresql postgresql-contrib -y
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# Nginx
if ! command -v nginx &> /dev/null; then
    log_warn "Nginx não encontrado. Instalando..."
    sudo apt install nginx -y
fi

# Python e dependências
if ! command -v python3 &> /dev/null; then
    log_warn "Python3 não encontrado. Instalando..."
    sudo apt install python3 python3-pip -y
fi

# 3. Configurar PostgreSQL
log_info "Configurando PostgreSQL..."

sudo -u postgres psql << EOF 2>/dev/null || true
CREATE DATABASE ecoponto;
CREATE USER ecouser WITH PASSWORD 'ecoponto@2025';
GRANT ALL PRIVILEGES ON DATABASE ecoponto TO ecouser;
\q
EOF

# 4. Configurar estrutura do projeto
log_info "Configurando estrutura do projeto..."

PROJECT_DIR="/home/$(whoami)/descarte_facil"

# Criar diretórios
mkdir -p $PROJECT_DIR/{api,web/{css,js,img},database,scripts,logs,backup}

# 5. Configurar API
log_info "Configurando API..."

# Copiar arquivos da API (assumindo que estão no diretório atual)
cp api_producao.py $PROJECT_DIR/api/
cp -r web/* $PROJECT_DIR/web/

# Instalar dependências Python
pip3 install psycopg2-binary

# 6. Configurar Systemd
log_info "Configurando Systemd service..."

sudo tee /etc/systemd/system/descarte-api.service > /dev/null << EOF
[Unit]
Description=API Descarte Fácil Guarulhos
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$PROJECT_DIR
Environment="PYTHONPATH=$PROJECT_DIR"
ExecStart=/usr/bin/python3 $PROJECT_DIR/api/api_producao.py
Restart=always
RestartSec=10
StandardOutput=append:$PROJECT_DIR/logs/api.out.log
StandardError=append:$PROJECT_DIR/logs/api.err.log

[Install]
WantedBy=multi-user.target
EOF

# 7. Configurar Nginx
log_info "Configurando Nginx..."

sudo tee /etc/nginx/sites-available/descarte-facil > /dev/null << EOF
server {
    listen 80;
    server_name _;
    
    root $PROJECT_DIR/web;
    index index.html;
    
    # API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    }
    
    # Interface web
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Logs
    access_log $PROJECT_DIR/logs/nginx-access.log;
    error_log $PROJECT_DIR/logs/nginx-error.log;
}
EOF

# Ativar site
sudo ln -sf /etc/nginx/sites-available/descarte-facil /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# 8. Configurar firewall
log_info "Configurando firewall..."

sudo ufw allow 80/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable

# 9. Iniciar serviços
log_info "Iniciando serviços..."

sudo systemctl daemon-reload
sudo systemctl enable descarte-api
sudo systemctl restart descarte-api
sudo systemctl restart nginx

# 10. Verificar status
log_info "Verificando status dos serviços..."

echo ""
echo "🔍 STATUS DOS SERVIÇOS:"
echo "----------------------"

services=("postgresql" "nginx" "descarte-api")
for service in "${services[@]}"; do
    if systemctl is-active --quiet $service; then
        echo -e "  $service: ${GREEN}✅ ATIVO${NC}"
    else
        echo -e "  $service: ${RED}❌ INATIVO${NC}"
    fi
done

# 11. Testar endpoints
log_info "Testando endpoints..."

sleep 3  # Aguardar inicialização

echo ""
echo "🌐 TESTANDO CONEXÕES:"
echo "-------------------"

# Testar API
if curl -s http://localhost/api/health | grep -q "healthy"; then
    echo -e "  API Health: ${GREEN}✅ OK${NC}"
else
    echo -e "  API Health: ${RED}❌ FALHOU${NC}"
fi

# Testar interface web
if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -q "200"; then
    echo -e "  Interface Web: ${GREEN}✅ OK${NC}"
else
    echo -e "  Interface Web: ${RED}❌ FALHOU${NC}"
fi

# 12. Informações finais
echo ""
echo "========================================"
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "========================================"
echo ""
echo "📋 INFORMAÇÕES DO SISTEMA:"
echo "-------------------------"
echo "• URL da aplicação: http://$(hostname -I | awk '{print $1}')"
echo "• API Backend: http://localhost:8000"
echo "• Interface Web: http://localhost"
echo "• Logs da API: $PROJECT_DIR/logs/"
echo "• Banco de dados: PostgreSQL (ecoponto)"
echo ""
echo "🔧 COMANDOS ÚTEIS:"
echo "-----------------"
echo "• Ver logs da API: tail -f $PROJECT_DIR/logs/api.out.log"
echo "• Reiniciar API: sudo systemctl restart descarte-api"
echo "• Ver status: sudo systemctl status descarte-api"
echo "• Ver logs Nginx: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "========================================"