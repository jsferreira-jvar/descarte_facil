#!/bin/bash
# Script de monitoramento da API

API_URL="http://localhost:8000/health"
LOG_FILE="/var/log/descarte-facil/api-monitor.log"
MAX_RETRIES=3
RETRY_DELAY=5

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

check_api() {
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL" --max-time 10)
    
    if [ "$response" = "200" ]; then
        log_message "✅ API está respondendo (HTTP $response)"
        return 0
    else
        log_message "❌ API não respondeu (HTTP $response)"
        return 1
    fi
}

restart_api() {
    log_message "🔄 Reiniciando serviço da API..."
    sudo systemctl restart descarte-facil-api.service
    sleep 10
}

# Verificar API
check_api
if [ $? -ne 0 ]; then
    log_message "⚠️ Tentando recuperar a API..."
    
    for i in $(seq 1 $MAX_RETRIES); do
        log_message "Tentativa $i de $MAX_RETRIES..."
        restart_api
        
        if check_api; then
            log_message "✅ API recuperada com sucesso na tentativa $i"
            exit 0
        fi
        
        sleep $RETRY_DELAY
    done
    
    log_message "❌ Falha ao recuperar API após $MAX_RETRIES tentativas"
    exit 1
fi

exit 0