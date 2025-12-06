#!/bin/bash
# /var/www/html/descarte_facil/api/start_api.sh

cd /var/www/html/descarte_facil/api

# Ativar virtual environment se existir
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Executar API
exec python3 api_producao.py