#!/usr/bin/env python3
"""
API DESCARTE FÁCIL - VERSÃO SQLITE
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3
import sys
import logging
from datetime import datetime
from urllib.parse import urlparse, parse_qs
from pathlib import Path

# Configurações
BASE_DIR = Path('/var/www/html/descarte_facil')
DB_PATH = BASE_DIR / 'database' / 'descarte_facil.db'
LOG_PATH = BASE_DIR / 'logs' / 'api.log'

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_PATH),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class Database:
    """Classe para gerenciar o banco SQLite"""
    
    @staticmethod
    def get_connection():
        """Retorna uma conexão com o banco"""
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    
    @staticmethod
    def init_database():
        """Inicializa o banco de dados com tabelas e dados iniciais"""
        if not DB_PATH.parent.exists():
            DB_PATH.parent.mkdir(parents=True)
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Tabela de pontos de coleta
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS pontos_coleta (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                tipo TEXT NOT NULL,
                endereco TEXT,
                bairro TEXT,
                cidade TEXT DEFAULT 'Guarulhos',
                estado TEXT DEFAULT 'SP',
                latitude REAL,
                longitude REAL,
                telefone TEXT,
                horario_funcionamento TEXT,
                verificado BOOLEAN DEFAULT 0,
                observacoes TEXT,
                avaliacao REAL,
                status TEXT DEFAULT 'ativo',
                data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabela de materiais
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS materiais (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                categoria TEXT NOT NULL,
                descricao TEXT
            )
        ''')
        
        # Tabela de relacionamento ponto-material
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ponto_material (
                ponto_id INTEGER,
                material_id INTEGER,
                FOREIGN KEY (ponto_id) REFERENCES pontos_coleta (id),
                FOREIGN KEY (material_id) REFERENCES materiais (id),
                PRIMARY KEY (ponto_id, material_id)
            )
        ''')
        
        # Inserir dados iniciais se estiver vazio
        cursor.execute("SELECT COUNT(*) FROM pontos_coleta")
        if cursor.fetchone()[0] == 0:
            Database._insert_initial_data(cursor)
        
        conn.commit()
        conn.close()
        logger.info("Banco de dados inicializado")
    
    @staticmethod
    def _insert_initial_data(cursor):
        """Insere dados iniciais no banco"""
        # Pontos de coleta
        pontos = [
            (1, "Ecoponto - PEV Paraventi", "ecoponto_oficial", 
             "R. Apolônia Viêira de Jesus, 91", "Paraventi", -23.4268, -46.5102,
             "(11) 2468-7260", "Seg-Sex: 8h-19h | Sáb: 8h-17h", 1, 4.6,
             "Local organizado com atendimento atencioso"),
            (2, "Ecoponto - PEV Cabrália", "ecoponto_oficial",
             "R. Cabrália, 100", "Cabrália", -23.4412, -46.5254,
             "(11) 2468-7206", "Seg-Sex: 8h-19h", 1, 4.4,
             "Ótimo para descarte consciente de móveis velhos"),
            (3, "Ecoponto - PEV Gopoúva", "ecoponto_oficial",
             "R. Guarulhos, 60", "Gopoúva", -23.4325, -46.5401,
             "(11) 2468-7206", "Seg-Sex: 8h-19h", 1, 4.5,
             "Super recomendado pelos usuários"),
            (4, "Ponto de Doação Vila Galvão", "ponto_doacao",
             "Rua das Flores, 250", "Vila Galvão", -23.445, -46.528,
             "(11) 2408-5555", "Ter-Sáb: 9h-18h", 1, None,
             "Apenas móveis em bom estado para doação"),
            (5, "Cooperativa Recicla Mais", "cooperativa",
             "Rua da Reciclagem, 789", "Jardim São Paulo", -23.448, -46.532,
             "(11) 2456-7890", "Seg-Sex: 7h-16h", 0, None,
             "Retira o gás de geladeiras e freezers")
        ]
        
        cursor.executemany('''
            INSERT OR REPLACE INTO pontos_coleta 
            (id, nome, tipo, endereco, bairro, latitude, longitude, 
             telefone, horario_funcionamento, verificado, avaliacao, observacoes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', pontos)
        
        # Materiais
        materiais = [
            (1, "Sofá", "Móveis Grandes", "Sofás de todos os tamanhos"),
            (2, "Cama/Colchão", "Dormitório", "Camas box, colchões de espuma, molas"),
            (3, "Armário", "Móveis Grandes", "Guarda-roupas, armários de cozinha e banheiro"),
            (4, "Mesa", "Móveis", "Mesas de jantar, escritório, centro, madeira e vidro"),
            (5, "Cadeira", "Móveis", "Cadeiras, poltronas, banquetas"),
            (6, "Geladeira", "Eletrodomésticos", "Geladeiras, freezers, refrigeradores"),
            (7, "Televisão", "Eletrônicos", "TVs de todos os tamanhos, monitores"),
            (8, "Entulho", "Resíduos", "Resíduos de construção civil, pequenas reformas"),
            (9, "Madeira", "Materiais", "Madeiras, portas, janelas, móveis quebrados"),
            (10, "Metais", "Recicláveis", "Ferro, alumínio, cobre, peças metálicas"),
            (11, "Plástico", "Recicláveis", "Plásticos diversos, embalagens"),
            (12, "Papel", "Recicláveis", "Papelão, jornais, revistas, papel misto")
        ]
        
        cursor.executemany('''
            INSERT OR REPLACE INTO materiais (id, nome, categoria, descricao)
            VALUES (?, ?, ?, ?)
        ''', materiais)
        
        # Relacionamento ponto-material (exemplos)
        ponto_materiais = [
            (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 8),
            (2, 1), (2, 2), (2, 3), (2, 4), (2, 8), (2, 9),
            (3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 7), (3, 11),
            (4, 1), (4, 2), (4, 3), (4, 4), (4, 5),
            (5, 6), (5, 7), (5, 10)
        ]
        
        cursor.executemany('''
            INSERT OR REPLACE INTO ponto_material (ponto_id, material_id)
            VALUES (?, ?)
        ''', ponto_materiais)
        
        logger.info(f"Inseridos {len(pontos)} pontos e {len(materiais)} materiais")


class DescarteAPIHandler(BaseHTTPRequestHandler):
    
    def log_message(self, format, *args):
        logger.info("%s - %s", self.address_string(), format % args)
    
    def _send_headers(self, status=200, content_type='application/json'):
        """Configura headers da resposta"""
        self.send_response(status)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'public, max-age=300')
        self.end_headers()
    
    def do_OPTIONS(self):
        """Lida com preflight CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Processa requisições GET"""
        start_time = datetime.now()
        
        try:
            parsed = urlparse(self.path)
            path = parsed.path.rstrip('/')  # Remove barra final
            query = parse_qs(parsed.query)
            
            # Debug: log do caminho
            logger.debug(f"Path requested: '{self.path}', normalized: '{path}'")
            
            # Rotas
            if path == '' or path == '/':
                response = self._home()
                self._send_headers()
            elif path in ['health', '/health', 'api/health', '/api/health']:
                response = self._health()
                self._send_headers()
            elif path in ['api/estatisticas', '/api/estatisticas']:
                response = self._estatisticas()
                self._send_headers()
            elif path in ['api/pontos', '/api/pontos']:
                response = self._pontos(query)
                self._send_headers()
            elif 'api/pontos/' in path:
                # Extrair ID do caminho
                parts = path.split('/')
                ponto_id = parts[-1] if parts[-1] else parts[-2]
                response = self._ponto_detalhes(ponto_id)
                self._send_headers()
            elif path in ['api/materiais', '/api/materiais']:
                response = self._materiais()
                self._send_headers()
            elif path in ['api/bairros', '/api/bairros']:
                response = self._bairros()
                self._send_headers()
            elif path in ['api/tipos', '/api/tipos']:
                response = self._tipos()
                self._send_headers()
            else:
                self._send_headers(404)
                response = {"error": "Endpoint não encontrado", "requested_path": self.path}
            
            # Enviar resposta
            self.wfile.write(json.dumps(response, default=str, ensure_ascii=False).encode('utf-8'))
            
            # Log de performance
            elapsed = (datetime.now() - start_time).total_seconds()
            logger.info(f"Request {self.path} completed in {elapsed:.3f}s")
            
        except Exception as e:
            logger.error(f"Erro em {self.path}: {str(e)}", exc_info=True)
            self._send_headers(500)
            error_response = {"error": "Erro interno do servidor", "message": str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def _row_to_dict(self, row):
        """Converte uma linha SQLite para dict"""
        return {key: row[key] for key in row.keys()}
    
    def _home(self):
        return {
            "api": "Descarte Fácil Guarulhos",
            "version": "1.0.0",
            "status": "online",
            "timestamp": datetime.now().isoformat(),
            "database": "sqlite",
            "endpoints": {
                "estatisticas": "/api/estatisticas",
                "pontos": "/api/pontos",
                "pontos_detalhes": "/api/pontos/{id}",
                "materiais": "/api/materiais",
                "bairros": "/api/bairros",
                "tipos": "/api/tipos",
                "health": "/health ou /api/health"
            }
        }
    
    def _health(self):
        try:
            conn = Database.get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            
            # Verificar estatísticas básicas
            cursor.execute("SELECT COUNT(*) FROM pontos_coleta")
            total_pontos = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM materiais")
            total_materiais = cursor.fetchone()[0]
            
            cursor.close()
            conn.close()
            
            return {
                "status": "healthy",
                "database": "connected",
                "timestamp": datetime.now().isoformat(),
                "statistics": {
                    "total_pontos": total_pontos,
                    "total_materiais": total_materiais
                }
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def _estatisticas(self):
        conn = Database.get_connection()
        cursor = conn.cursor()
        
        # Estatísticas
        cursor.execute("SELECT COUNT(*) as total FROM pontos_coleta WHERE status = 'ativo'")
        total = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) as ecopontos FROM pontos_coleta WHERE tipo = 'ecoponto_oficial' AND status = 'ativo'")
        ecopontos = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) as doacoes FROM pontos_coleta WHERE tipo = 'ponto_doacao' AND status = 'ativo'")
        doacoes = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) as cooperativas FROM pontos_coleta WHERE tipo = 'cooperativa' AND status = 'ativo'")
        cooperativas = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT bairro) as bairros FROM pontos_coleta WHERE status = 'ativo' AND bairro IS NOT NULL")
        bairros = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) as verificados FROM pontos_coleta WHERE verificado = 1 AND status = 'ativo'")
        verificados = cursor.fetchone()[0]
        
        # Média de avaliação
        cursor.execute("SELECT AVG(avaliacao) as media_avaliacao FROM pontos_coleta WHERE avaliacao IS NOT NULL AND status = 'ativo'")
        media_avaliacao = cursor.fetchone()[0] or 0
        
        conn.close()
        
        return {
            "total_pontos": total,
            "total_ecopontos": ecopontos,
            "total_pontos_doacao": doacoes,
            "total_cooperativas": cooperativas,
            "bairros_cobertos": bairros,
            "pontos_verificados": verificados,
            "percentual_verificados": round((verificados / total * 100) if total > 0 else 0, 1),
            "media_avaliacao": round(float(media_avaliacao), 1)
        }
    
    def _pontos(self, query):
        conn = Database.get_connection()
        cursor = conn.cursor()
        
        sql = """
            SELECT id, nome, tipo, endereco, bairro, cidade, estado,
                   latitude, longitude, telefone, horario_funcionamento,
                   verificado, observacoes, avaliacao, data_cadastro
            FROM pontos_coleta 
            WHERE status = 'ativo'
        """
        
        params = []
        
        if 'bairro' in query and query['bairro'][0]:
            sql += " AND LOWER(bairro) = LOWER(?)"
            params.append(query['bairro'][0])
        
        if 'tipo' in query and query['tipo'][0]:
            sql += " AND tipo = ?"
            params.append(query['tipo'][0])
        
        if 'verificado' in query and query['verificado'][0]:
            verificado = 1 if query['verificado'][0].lower() == 'true' else 0
            sql += " AND verificado = ?"
            params.append(verificado)
        
        sql += " ORDER BY verificado DESC, bairro, nome"
        
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        
        # Converter para dict
        pontos = []
        for row in rows:
            ponto = self._row_to_dict(row)
            ponto['verificado'] = bool(ponto['verificado'])
            
            # Buscar materiais para este ponto
            cursor2 = conn.cursor()
            cursor2.execute("""
                SELECT m.nome 
                FROM materiais m
                JOIN ponto_material pm ON m.id = pm.material_id
                WHERE pm.ponto_id = ?
                ORDER BY m.nome
            """, (ponto['id'],))
            
            materiais = [row2[0] for row2 in cursor2.fetchall()]
            ponto['materiais_aceitos'] = materiais
            cursor2.close()
            
            pontos.append(ponto)
        
        conn.close()
        return pontos
    
    def _ponto_detalhes(self, ponto_id):
        try:
            ponto_id = int(ponto_id)
        except ValueError:
            return {"error": "ID inválido", "id_recebido": ponto_id}
        
        conn = Database.get_connection()
        cursor = conn.cursor()
        
        # Buscar ponto
        cursor.execute("""
            SELECT id, nome, tipo, endereco, bairro, cidade, estado,
                   latitude, longitude, telefone, horario_funcionamento,
                   verificado, observacoes, avaliacao, data_cadastro
            FROM pontos_coleta 
            WHERE id = ? AND status = 'ativo'
        """, (ponto_id,))
        
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            return {"error": "Ponto não encontrado", "id": ponto_id}
        
        ponto = self._row_to_dict(row)
        ponto['verificado'] = bool(ponto['verificado'])
        
        # Buscar materiais aceitos
        cursor.execute("""
            SELECT m.nome 
            FROM materiais m
            JOIN ponto_material pm ON m.id = pm.material_id
            WHERE pm.ponto_id = ?
            ORDER BY m.nome
        """, (ponto_id,))
        
        materiais = [row[0] for row in cursor.fetchall()]
        ponto['materiais_aceitos'] = materiais
        
        conn.close()
        return ponto
    
    def _materiais(self):
        conn = Database.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, nome, categoria, descricao FROM materiais ORDER BY categoria, nome")
        rows = cursor.fetchall()
        
        materiais = [self._row_to_dict(row) for row in rows]
        
        conn.close()
        return materiais
    
    def _bairros(self):
        conn = Database.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT bairro, COUNT(*) as total_pontos
            FROM pontos_coleta 
            WHERE status = 'ativo' AND bairro IS NOT NULL
            GROUP BY bairro 
            ORDER BY bairro
        """)
        
        rows = cursor.fetchall()
        bairros = [self._row_to_dict(row) for row in rows]
        
        conn.close()
        return {"bairros": bairros}
    
    def _tipos(self):
        tipos = [
            {"tipo": "ecoponto_oficial", "label": "Ecoponto Oficial"},
            {"tipo": "ponto_doacao", "label": "Ponto de Doação"},
            {"tipo": "cooperativa", "label": "Cooperativa"}
        ]
        
        conn = Database.get_connection()
        cursor = conn.cursor()
        
        for tipo_info in tipos:
            cursor.execute("""
                SELECT COUNT(*) 
                FROM pontos_coleta 
                WHERE tipo = ? AND status = 'ativo'
            """, (tipo_info['tipo'],))
            
            tipo_info['total_pontos'] = cursor.fetchone()[0]
        
        conn.close()
        return {"tipos": tipos}


def main():
    """Inicia o servidor de produção"""
    print("=" * 60)
    print("🚀 API DESCARTE FÁCIL - VERSÃO CORRIGIDA")
    print("=" * 60)
    
    # Criar diretórios necessários
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    # Inicializar banco de dados
    print("📊 Inicializando banco de dados...")
    Database.init_database()
    
    # Configurar servidor
    PORT = 8001
    HOST = '127.0.0.1'
    
    server = HTTPServer((HOST, PORT), DescarteAPIHandler)
    
    print(f"✅ Banco de dados inicializado: {DB_PATH}")
    print(f"🌐 Servidor rodando em: http://{HOST}:{PORT}")
    print(f"📁 Logs: {LOG_PATH}")
    print("\n📡 Endpoints disponíveis:")
    print("   • GET /                    - Página inicial da API")
    print("   • GET /health              - Verificação de saúde")
    print("   • GET /api/health          - Verificação de saúde (alternativo)")
    print("   • GET /api/estatisticas    - Estatísticas gerais")
    print("   • GET /api/pontos          - Lista de pontos")
    print("   • GET /api/pontos/{id}     - Detalhes de um ponto")
    print("   • GET /api/materiais       - Lista de materiais aceitos")
    print("   • GET /api/bairros         - Lista de bairros")
    print("   • GET /api/tipos           - Lista de tipos de pontos")
    print("\n🔍 Teste rápido:")
    print(f"   curl http://{HOST}:{PORT}/health")
    print(f"   curl http://{HOST}:{PORT}/api/pontos")
    print(f"   curl http://{HOST}:{PORT}/api/estatisticas")
    print("=" * 60)
    print("Pressione Ctrl+C para parar")
    print("=" * 60)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n⏹️  Servidor parado")
        server.server_close()


if __name__ == "__main__":
    main()