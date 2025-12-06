#!/bin/bash
# /var/www/html/descarte_facil/toggle_api_mode.sh

API_FILE="/var/www/html/descarte_facil/api/api_producao.py"

if grep -q "HOST = '127.0.0.1'" "$API_FILE"; then
    echo "🌍 Mudando para MODO REDE (0.0.0.0)..."
    sed -i "s/HOST = '127.0.0.1'/HOST = '0.0.0.0'/" "$API_FILE"
    echo "✅ Agora acessível por toda a rede"
else
    echo "🔒 Mudando para MODO LOCAL (127.0.0.1)..."
    sed -i "s/HOST = '0.0.0.0'/HOST = '127.0.0.1'/" "$API_FILE"
    echo "✅ Agora apenas acesso local"
fi

# Reiniciar API
sudo fuser -k 8001/tcp 2>/dev/null
cd /var/www/html/descarte_facil/api
python3 api_producao.py &