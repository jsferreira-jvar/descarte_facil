#!/bin/bash
# /var/www/html/descarte_facil/scripts/backup_database.sh

BACKUP_DIR="/var/backups/descarte-facil"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Criar diretório se não existir
mkdir -p "$BACKUP_DIR"

# Backup do banco de dados (ajuste para seu banco)
# Exemplo para SQLite:
if [ -f "/var/www/html/descarte_facil/database/descarte_facil.db" ]; then
    cp "/var/www/html/descarte_facil/database/descarte_facil.db" "$BACKUP_DIR/descarte_facil_$DATE.db"
    
    # Compactar
    gzip "$BACKUP_DIR/descarte_facil_$DATE.db"
    
    # Manter apenas últimos 7 backups
    ls -t "$BACKUP_DIR"/*.db.gz | tail -n +8 | xargs rm -f
    
    echo "Backup criado: $BACKUP_DIR/descarte_facil_$DATE.db.gz"
fi

# Backup dos logs
if [ -d "/var/log/descarte-facil" ]; then
    tar -czf "$BACKUP_DIR/logs_$DATE.tar.gz" -C /var/log descarte-facil
fi

# Manter backups por 30 dias
find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete