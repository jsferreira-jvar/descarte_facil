#!/bin/bash
# Script de monitoramento

LOG_FILE="/home/josafa/descarte_facil/logs/monitoramento.log"
ALERT_EMAIL="josafajva@gmail.com"

# Função para log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
}

# Verificar serviços
services=("postgresql" "nginx" "descarte-api")

for service in "${services[@]}"; do
    if ! systemctl is-active --quiet $service; then
        log "ALERTA: Serviço $service está parado"
        # systemctl restart $service
        # echo "Serviço $service reiniciado" | mail -s "ALERTA: $service parado" $ALERT_EMAIL
    fi
done

# Verificar espaço em disco
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    log "ALERTA: Uso de disco acima de 80%"
fi

# Verificar memória
MEM_USAGE=$(free | awk '/Mem:/ {printf("%.0f"), $3/$2 * 100}')
if [ $MEM_USAGE -gt 90 ]; then
    log "ALERTA: Uso de memória acima de 90%"
fi