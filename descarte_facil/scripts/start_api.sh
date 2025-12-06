#!/bin/bash
# /var/www/html/descarte_facil/start_api.sh

PORT=8001
PID_FILE="/tmp/descarte_api.pid"

# Verificar se já está rodando
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if kill -0 $OLD_PID 2>/dev/null; then
        echo "⚠️ API já está rodando (PID: $OLD_PID)"
        echo "Parando processo antigo..."
        kill -9 $OLD_PID
        sleep 2
    fi
fi

# Iniciar nova instância
cd /var/www/html/descarte_facil/api
python3 api_producao.py &
echo $! > "$PID_FILE"
echo "✅ API iniciada na porta $PORT (PID: $!)"