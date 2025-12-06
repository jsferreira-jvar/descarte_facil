// app.js - Descarte Fácil Guarulhos - Dados atualizados
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Descarte Fácil Guarulhos...');
    window.app = new DescarteFacilApp();
});

class DescarteFacilApp {
    constructor() {
        this.map = null;
        this.markers = [];
        this.pontos = [];
        this.bairros = [];
        this.materiais = [];
        
        this.init();
    }
    
    async init() {
        try {
            console.log('🔧 Inicializando aplicação...');
            
            // 1. Verificar dependências
            this.verificarDependencias();
            
            // 2. Inicializar mapa
            this.inicializarMapa();
            
            // 3. Carregar dados
            this.carregarDados();
            
            // 4. Configurar eventos
            this.configurarEventos();
            
            // 5. Esconder loading
            this.esconderLoading();
            
            console.log('✅ Aplicação inicializada com sucesso!');
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            this.mostrarErro('Falha ao iniciar a aplicação');
        }
    }
    
    verificarDependencias() {
        console.log('📋 Verificando dependências...');
        
        if (typeof L === 'undefined') {
            throw new Error('Leaflet não carregado');
        }
        
        if (typeof bootstrap === 'undefined') {
            console.warn('⚠️ Bootstrap não carregado - modal pode não funcionar');
        }
        
        console.log('✅ Dependências verificadas');
    }
    
    inicializarMapa() {
        console.log('🗺️ Inicializando mapa...');
        
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            throw new Error('Elemento #map não encontrado');
        }
        
        // Coordenadas de Guarulhos
        this.map = L.map('map').setView([-23.44, -46.53], 12);
        
        // Adicionar mapa base
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19
        }).addTo(this.map);
        
        console.log('✅ Mapa inicializado');
    }
    
    carregarDados() {
        console.log('📥 Carregando dados atualizados...');
        
        // Dados atualizados com todos os ecopontos
        this.pontos = [
            // Ecopontos Oficiais
            {
                id: 1,
                nome: "Ecoponto - PEV Paraventi",
                tipo: "ecoponto_oficial",
                endereco: "R. Apolônia Viêira de Jesus, 91",
                bairro: "Paraventi",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4268,
                longitude: -46.5102,
                horario_funcionamento: "Seg-Sex: 8h-19h | Sáb: 8h-17h",
                telefone: "(11) 2468-7260",
                verificado: true,
                materiais_aceitos: ["Móveis", "Eletrodomésticos", "Entulho", "Recicláveis"],
                observacoes: "Local organizado com atendimento atencioso",
                site: "Disponível",
                avaliacao: 4.6
            },
            {
                id: 2,
                nome: "Ecoponto - PEV Cabrália",
                tipo: "ecoponto_oficial",
                endereco: "R. Cabrália, 100",
                bairro: "Cabrália",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4412,
                longitude: -46.5254,
                horario_funcionamento: "Seg-Sex: 8h-19h",
                telefone: "(11) 2468-7206",
                verificado: true,
                materiais_aceitos: ["Móveis Velhos", "Entulho", "Madeira", "Metais"],
                observacoes: "Ótimo para descarte consciente de móveis velhos",
                site: "Disponível",
                avaliacao: 4.4
            },
            {
                id: 3,
                nome: "Ecoponto - PEV Gopoúva",
                tipo: "ecoponto_oficial",
                endereco: "R. Guarulhos, 60",
                bairro: "Gopoúva",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4325,
                longitude: -46.5401,
                horario_funcionamento: "Seg-Sex: 8h-19h",
                telefone: "(11) 2468-7206",
                verificado: true,
                materiais_aceitos: ["Coleta Seletiva", "Móveis", "Eletrônicos", "Plástico"],
                observacoes: "Super recomendado pelos usuários",
                site: "Disponível",
                avaliacao: 4.5
            },
            {
                id: 4,
                nome: "Ecoponto - PEV Torres Tibagy",
                tipo: "ecoponto_oficial",
                endereco: "R. Ouvidor, 337",
                bairro: "Torres Tibagy",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4198,
                longitude: -46.5023,
                horario_funcionamento: "Seg-Sex: 8h-19h",
                telefone: "(11) 2468-7206",
                verificado: true,
                materiais_aceitos: ["Entulho", "Móveis", "Resíduos Construção"],
                observacoes: "Atendimento disponível para auxiliar no descarte",
                avaliacao: 4.5
            },
            {
                id: 5,
                nome: "ECOPONTO CONTINENTAL",
                tipo: "ecoponto_oficial",
                endereco: "R. Valdimiro Laurentino Pêssoa, 655",
                bairro: "Continental",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4501,
                longitude: -46.5352,
                horario_funcionamento: "Seg-Sex: 8h-17h",
                verificado: true,
                materiais_aceitos: ["Entulho", "Móveis", "Resíduos"],
                observacoes: "Excelente serviço de coleta",
                avaliacao: 3.7
            },
            {
                id: 6,
                nome: "Ecoponto- Gopoúva",
                tipo: "ecoponto_oficial",
                endereco: "Guarulhos - SP",
                bairro: "Gopoúva",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4350,
                longitude: -46.5380,
                horario_funcionamento: "Seg-Sex: 8h-19h",
                verificado: true,
                materiais_aceitos: ["Móveis", "Entulho", "Recicláveis"],
                observacoes: "Boa orientação com apoio para descarte correto",
                avaliacao: 4.3
            },
            {
                id: 7,
                nome: "ECOPONTO TIMOTEO PENTEADO",
                tipo: "ecoponto_oficial",
                endereco: "Guarulhos - SP",
                bairro: "Timóteo Penteado",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4285,
                longitude: -46.5203,
                horario_funcionamento: "Seg-Sex: 8h-19h",
                verificado: true,
                materiais_aceitos: ["Móveis", "Eletrônicos", "Entulho"],
                observacoes: "Excelente local, fácil acesso e bom atendimento",
                avaliacao: 4.6
            },
            {
                id: 8,
                nome: "Ecoponto Vila Rio",
                tipo: "ecoponto_oficial",
                endereco: "R. Adélia Sadalla, 166",
                bairro: "Vila Rio",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4152,
                longitude: -46.4901,
                horario_funcionamento: "Seg-Sex: 8h15-19h",
                verificado: true,
                materiais_aceitos: ["Entulho", "Móveis", "Recicláveis"],
                observacoes: "Local de extrema utilidade para a comunidade",
                site: "Disponível",
                avaliacao: 3.5
            },
            {
                id: 9,
                nome: "ECOPONTO VILA RIO",
                tipo: "ecoponto_oficial",
                endereco: "Av. Benjamin Harris Hunicutt, 1509",
                bairro: "Vila Rio",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4170,
                longitude: -46.4925,
                horario_funcionamento: "Seg-Sex: 9h-19h",
                verificado: true,
                materiais_aceitos: ["Entulho", "Resíduos", "Móveis"],
                avaliacao: 1.0
            },
            {
                id: 10,
                nome: "ECOPONTO JARDIM ADRIANA",
                tipo: "ecoponto_oficial",
                endereco: "R. Valter Pereira de Lima, 105",
                bairro: "Jardim Adriana",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4623,
                longitude: -46.5284,
                horario_funcionamento: "Seg-Sex: 8h15-19h",
                verificado: true,
                materiais_aceitos: ["Recicláveis", "Móveis", "Entulho"],
                observacoes: "Orientações sobre descarte correto disponíveis",
                avaliacao: 5.0
            },
            {
                id: 11,
                nome: "Ecoponto Macedo",
                tipo: "ecoponto_oficial",
                endereco: "R. Sold. Estanislau Wojcik, 26",
                bairro: "Macedo",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4702,
                longitude: -46.5256,
                horario_funcionamento: "Seg-Sex: 8h15-19h",
                verificado: true,
                materiais_aceitos: ["Entulho", "Móveis", "Recicláveis"],
                observacoes: "Ótima localização no Centro",
                site: "Disponível",
                avaliacao: 4.3
            },
            {
                id: 12,
                nome: "ECOPONTO PRESIDENTE DUTRA",
                tipo: "ecoponto_oficial",
                endereco: "Av. João Bassi, 707",
                bairro: "Presidente Dutra",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4550,
                longitude: -46.5420,
                horario_funcionamento: "Seg-Sex: 8h-19h",
                verificado: true,
                materiais_aceitos: ["Móveis", "Entulho", "Resíduos"],
                observacoes: "Atendimento excelente",
                site: "Disponível",
                avaliacao: 3.7
            },
            {
                id: 13,
                nome: "Ecoponto - PEV Jurema",
                tipo: "ecoponto_oficial",
                endereco: "Rua Jacutinga, 470 Esquina Com, R. Guarapiranga",
                bairro: "Jurema",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4385,
                longitude: -46.5150,
                horario_funcionamento: "Seg-Sex: 8h-19h",
                telefone: "(11) 2468-7206",
                verificado: true,
                materiais_aceitos: ["Móveis Grandes", "Entulho", "Madeira"],
                observacoes: "Indicações de carreto disponíveis para móveis grandes",
                site: "Disponível",
                avaliacao: 4.6
            },
            {
                id: 14,
                nome: "Ecoponto - PEV Vila Barros",
                tipo: "ecoponto_oficial",
                endereco: "R. Guilherme Lino dos Santos, 349",
                bairro: "Vila Barros",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4458,
                longitude: -46.5085,
                horario_funcionamento: "Seg-Sex: 8h-19h",
                telefone: "(11) 2468-7206",
                verificado: true,
                materiais_aceitos: ["Móveis", "Entulho", "Recicláveis"],
                observacoes: "Organizado e equipe preparada para atender",
                site: "Disponível",
                avaliacao: 4.6
            },
            {
                id: 15,
                nome: "ECOPONTO BOM CLIMA",
                tipo: "ecoponto_oficial",
                endereco: "Av. João Bernardo Medeiros, 800",
                bairro: "Bom Clima",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4620,
                longitude: -46.5180,
                horario_funcionamento: "Seg-Sex: 8h15-19h",
                verificado: true,
                materiais_aceitos: ["Entulho", "Móveis", "Resíduos"],
                observacoes: "Excelente organização e equipe disciplinada",
                avaliacao: 4.0
            },
            {
                id: 16,
                nome: "Ecoponto - PEV Mikail",
                tipo: "ecoponto_oficial",
                endereco: "R. Justiniano Salvador dos Santos, 269",
                bairro: "Mikail",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4505,
                longitude: -46.5105,
                horario_funcionamento: "Seg-Sex: 8h15-19h",
                telefone: "(11) 2468-7206",
                verificado: true,
                materiais_aceitos: ["Entulho", "Móveis", "Madeira"],
                observacoes: "Bom lugar para descarte de entulho",
                site: "Disponível",
                avaliacao: 4.4
            },
            {
                id: 17,
                nome: "Ecoponto Vila Sabrina",
                tipo: "ecoponto_oficial",
                endereco: "São Paulo - SP",
                bairro: "Vila Sabrina",
                cidade: "São Paulo",
                estado: "SP",
                latitude: -23.4805,
                longitude: -46.6050,
                horario_funcionamento: "Seg-Dom: 8h-22h",
                verificado: true,
                materiais_aceitos: ["Entulho", "Móveis", "Diversos Materiais"],
                observacoes: "Prático, rápido e fácil de descartar",
                avaliacao: 3.6
            },
            {
                id: 18,
                nome: "ECOPONTO ROSA DE FRANÇA",
                tipo: "ecoponto_oficial",
                endereco: "R. Nestor Cabral, 61",
                bairro: "Rosa de França",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4685,
                longitude: -46.5350,
                horario_funcionamento: "Seg-Sex: 8h15-19h",
                verificado: true,
                materiais_aceitos: ["Entulho", "Móveis", "Resíduos"],
                observacoes: "Limite de 20 sacos de entulho por dia por morador",
                site: "Disponível",
                avaliacao: 2.4
            },
            {
                id: 19,
                nome: "ECOPONTO IPORANGA",
                tipo: "ecoponto_oficial",
                endereco: "R. Adélia Sadalla, 166",
                bairro: "Iporanga",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4120,
                longitude: -46.4950,
                horario_funcionamento: "Seg-Sex: 8h-19h",
                verificado: true,
                materiais_aceitos: ["Entulho", "Móveis", "Recicláveis"]
            },
            {
                id: 20,
                nome: "PEV Continental - Ponto de Entrega Voluntária",
                tipo: "ecoponto_oficial",
                endereco: "Atrás Do Ceu Continental - R. Valdimiro Laurentino Pêssoa, 655",
                bairro: "Continental",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.4510,
                longitude: -46.5340,
                horario_funcionamento: "Seg-Sex: 8h-18h",
                telefone: "(11) 2468-7206",
                verificado: true,
                materiais_aceitos: ["Entulho", "Reciclagem", "Móveis"],
                observacoes: "Excelente serviço de coleta de entulho e reciclagem",
                avaliacao: 4.4
            },
            // Pontos de Doação
            {
                id: 21,
                nome: "Ponto de Doação Vila Galvão",
                tipo: "ponto_doacao",
                endereco: "Rua das Flores, 250",
                bairro: "Vila Galvão",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.445,
                longitude: -46.528,
                horario_funcionamento: "Ter-Sáb: 9h-18h",
                telefone: "(11) 2408-5555",
                verificado: true,
                materiais_aceitos: ["Sofá", "Cama", "Armário", "Mesa", "Cadeira"],
                observacoes: "Apenas móveis em bom estado para doação"
            },
            {
                id: 22,
                nome: "Associação Renascer",
                tipo: "ponto_doacao",
                endereco: "Av. Guarulhos, 1500",
                bairro: "Bonsucesso",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.438,
                longitude: -46.520,
                horario_funcionamento: "Qua-Dom: 10h-17h",
                telefone: "(11) 2425-3333",
                verificado: true,
                materiais_aceitos: ["Cama", "Colchão", "Mesa", "Cadeira", "Roupeiro"],
                observacoes: "Fazem pequenos reparos para doação"
            },
            // Cooperativas
            {
                id: 23,
                nome: "Cooperativa Recicla Mais",
                tipo: "cooperativa",
                endereco: "Rua da Reciclagem, 789",
                bairro: "Jardim São Paulo",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.448,
                longitude: -46.532,
                horario_funcionamento: "Seg-Sex: 7h-16h",
                telefone: "(11) 2456-7890",
                verificado: false,
                materiais_aceitos: ["Geladeira", "TV", "Armário de Metal", "Fogão"],
                observacoes: "Retira o gás de geladeiras e freezers"
            },
            {
                id: 24,
                nome: "Cooperativa EcoVida",
                tipo: "cooperativa",
                endereco: "Av. Industrial, 1200",
                bairro: "Cumbica",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.435,
                longitude: -46.475,
                horario_funcionamento: "Seg-Sex: 8h-17h",
                telefone: "(11) 2488-9900",
                verificado: true,
                materiais_aceitos: ["Eletrônicos", "Metais", "Plásticos", "Papel"],
                observacoes: "Especializada em eletrônicos e metais"
            },
            {
                id: 25,
                nome: "Ecoponto Vila Rio",
                tipo: "ecoponto_oficial",
                endereco: "Av. Benjamin Harris Hunicutt, 1509",
                bairro: "Portal dos Gramados",
                cidade: "Guarulhos",
                estado: "SP",
                latitude: -23.433202444797338,
                longitude: -46.53771165789568,
                horario_funcionamento: "Seg-Sab: 9h-16h",
                telefone: "(11) Sem Telefone",
                verificado: true,
                materiais_aceitos: ["Cama", "Colchão", "Mesa", "Cadeira", "Roupeiro"],
                observacoes: "Especializada em Madeiras Papelão, Movéis em Geral"
            }

        ];
        
        // Extrair bairros únicos dos pontos
        this.bairros = [...new Set(this.pontos.map(p => p.bairro))].sort();
        
        // Materiais aceitos
        this.materiais = [
            { nome: "Sofá", categoria: "Móveis Grandes", descricao: "Sofás de todos os tamanhos e materiais" },
            { nome: "Cama/Colchão", categoria: "Dormitório", descricao: "Camas box, colchões de espuma, molas" },
            { nome: "Armário", categoria: "Móveis Grandes", descricao: "Guarda-roupas, armários de cozinha e banheiro" },
            { nome: "Mesa", categoria: "Móveis", descricao: "Mesas de jantar, escritório, centro, madeira e vidro" },
            { nome: "Cadeira", categoria: "Móveis", descricao: "Cadeiras, poltronas, banquetas" },
            { nome: "Geladeira", categoria: "Eletrodomésticos", descricao: "Geladeiras, freezers, refrigeradores" },
            { nome: "Televisão", categoria: "Eletrônicos", descricao: "TVs de todos os tamanhos, monitores" },
            { nome: "Fogão", categoria: "Eletrodomésticos", descricao: "Fogões de 4 ou 6 bocas, cooktops" },
            { nome: "Entulho", categoria: "Resíduos", descricao: "Resíduos de construção civil, pequenas reformas" },
            { nome: "Madeira", categoria: "Materiais", descricao: "Madeiras, portas, janelas, móveis quebrados" },
            { nome: "Metais", categoria: "Recicláveis", descricao: "Ferro, alumínio, cobre, peças metálicas" },
            { nome: "Plástico", categoria: "Recicláveis", descricao: "Plásticos diversos, embalagens" },
            { nome: "Papel", categoria: "Recicláveis", descricao: "Papelão, jornais, revistas, papel misto" }
        ];
        
        console.log(`✅ Dados carregados: ${this.pontos.length} pontos, ${this.bairros.length} bairros, ${this.materiais.length} materiais`);
        
        // Atualizar interface
        this.atualizarInterface();
    }
    
    atualizarInterface() {
        console.log('🎨 Atualizando interface...');
        
        // 1. Estatísticas
        this.atualizarEstatisticas();
        
        // 2. Bairros nos selects
        this.popularBairros();
        
        // 3. Lista de materiais
        this.popularMateriais();
        
        // 4. Pontos no mapa e lista
        this.exibirPontos();
        
        console.log('✅ Interface atualizada');
    }
    
    atualizarEstatisticas() {
        const total = this.pontos.length;
        const ecopontos = this.pontos.filter(p => p.tipo === 'ecoponto_oficial').length;
        const doacoes = this.pontos.filter(p => p.tipo === 'ponto_doacao').length;
        const cooperativas = this.pontos.filter(p => p.tipo === 'cooperativa').length;
        const bairrosUnicos = this.bairros.length;
        const verificados = this.pontos.filter(p => p.verificado).length;
        const percentualVerificados = Math.round((verificados / total) * 100);
        
        // Atualizar elementos
        this.atualizarElemento('totalPontos', total);
        this.atualizarElemento('totalEcopontos', ecopontos);
        this.atualizarElemento('bairrosCobertos', bairrosUnicos);
        this.atualizarElemento('totalCooperativas', cooperativas);
        
        // Atualizar progresso de verificados
        const progressBar = document.getElementById('progressVerificados');
        const percentText = document.getElementById('percentualVerificados');
        
        if (progressBar) {
            progressBar.style.width = `${percentualVerificados}%`;
        }
        if (percentText) {
            percentText.textContent = `${percentualVerificados}%`;
        }
        
        console.log(`📊 Estatísticas: ${total} pontos, ${ecopontos} ecopontos, ${doacoes} doações, ${cooperativas} cooperativas`);
    }
    
    atualizarElemento(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
        }
    }
    
    popularBairros() {
        console.log('📍 Populando lista de bairros...');
        
        const selects = ['bairroSelect'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;
            
            // Limpar opções existentes (exceto a primeira)
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Adicionar bairros
            this.bairros.forEach(bairro => {
                const option = document.createElement('option');
                option.value = bairro;
                option.textContent = bairro;
                select.appendChild(option);
            });
        });
        
        console.log(`✅ ${this.bairros.length} bairros adicionados`);
    }
    
    popularMateriais() {
        console.log('📦 Populando lista de materiais...');
        
        const container = document.getElementById('materiaisLista');
        if (!container) {
            console.error('❌ Elemento #materiaisLista não encontrado!');
            return;
        }
        
        // Agrupar por categoria
        const categorias = {};
        this.materiais.forEach(material => {
            if (!categorias[material.categoria]) {
                categorias[material.categoria] = [];
            }
            categorias[material.categoria].push(material);
        });
        
        let html = '';
        
        Object.keys(categorias).forEach(categoria => {
            html += `
                <div class="col-md-6 mb-3">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body">
                            <h6 class="card-title text-success mb-2">${categoria}</h6>
                            <div class="d-flex flex-wrap gap-2">
                                ${categorias[categoria].map(m => `
                                    <span class="badge bg-light text-dark border" 
                                          data-bs-toggle="tooltip" 
                                          title="${m.descricao}">
                                        ${m.nome}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Inicializar tooltips se Bootstrap estiver disponível
        if (bootstrap && bootstrap.Tooltip) {
            setTimeout(() => {
                const tooltips = container.querySelectorAll('[data-bs-toggle="tooltip"]');
                tooltips.forEach(el => new bootstrap.Tooltip(el));
                console.log('✅ Tooltips inicializados');
            }, 200);
        }
        
        console.log(`✅ ${this.materiais.length} materiais exibidos em ${Object.keys(categorias).length} categorias`);
    }
    
    exibirPontos() {
        console.log('📍 Exibindo pontos...');
        
        // Limpar marcadores anteriores
        this.limparMarcadores();
        
        // Adicionar marcadores ao mapa
        this.adicionarMarcadores();
        
        // Atualizar lista
        this.atualizarListaPontos();
        
        // Atualizar contador
        document.getElementById('contadorPontos').textContent = this.pontos.length;
        
        console.log(`✅ ${this.pontos.length} pontos exibidos`);
    }
    
    limparMarcadores() {
        this.markers.forEach(marker => {
            if (marker && this.map) {
                this.map.removeLayer(marker);
            }
        });
        this.markers = [];
    }
    
    adicionarMarcadores() {
        this.pontos.forEach(ponto => {
            if (ponto.latitude && ponto.longitude) {
                try {
                    // Cor baseada no tipo
                    let cor = '#28a745'; // verde para ecoponto
                    let icone = 'bi-recycle';
                    
                    if (ponto.tipo === 'ponto_doacao') {
                        cor = '#17a2b8'; // azul
                        icone = 'bi-heart';
                    } else if (ponto.tipo === 'cooperativa') {
                        cor = '#ffc107'; // amarelo
                        icone = 'bi-arrow-repeat';
                    }
                    
                    // Criar marcador personalizado
                    const marker = L.marker([ponto.latitude, ponto.longitude], {
                        icon: L.divIcon({
                            html: `
                                <div style="
                                    background-color: ${cor};
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: white;
                                    font-size: 18px;
                                    border: 3px solid white;
                                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                                ">
                                    <i class="bi ${icone}"></i>
                                </div>
                            `,
                            iconSize: [36, 36],
                            iconAnchor: [18, 36],
                            popupAnchor: [0, -36]
                        })
                    }).addTo(this.map);
                    
                    // Criar popup
                    const tipoLabel = ponto.tipo === 'ecoponto_oficial' ? 'Ecoponto' : 
                                     ponto.tipo === 'ponto_doacao' ? 'Ponto de Doação' : 'Cooperativa';
                    
                    let popupContent = `
                        <div style="min-width: 250px;">
                            <h5 style="color: #2e7d32; margin: 0 0 10px 0;">${ponto.nome}</h5>
                            <p style="margin: 0 0 5px 0;">
                                <strong>Tipo:</strong> ${tipoLabel}<br>
                                <strong>Bairro:</strong> ${ponto.bairro}
                            </p>
                    `;
                    
                    if (ponto.avaliacao) {
                        popupContent += `<p style="margin: 0 0 5px 0;"><strong>Avaliação:</strong> ${ponto.avaliacao}/5.0</p>`;
                    }
                    
                    popupContent += `
                            <button onclick="app.mostrarDetalhes(${ponto.id})" 
                                    class="btn btn-sm btn-success w-100 mt-2">
                                Ver detalhes completos
                            </button>
                        </div>
                    `;
                    
                    marker.bindPopup(popupContent);
                    
                    this.markers.push(marker);
                } catch (error) {
                    console.error(`Erro ao criar marcador para ${ponto.nome}:`, error);
                }
            }
        });
        
        // Ajustar zoom para mostrar todos os marcadores
        if (this.markers.length > 0 && this.map) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }
    
    atualizarListaPontos() {
        const container = document.getElementById('resultados');
        if (!container) return;
        
        if (this.pontos.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-emoji-frown display-4 text-muted mb-3"></i>
                    <h5 class="text-muted mb-2">Nenhum ponto encontrado</h5>
                    <p class="text-muted small">Tente ajustar os filtros de busca</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.pontos.map(ponto => `
            <div class="list-group-item list-group-item-action" 
                 onclick="app.mostrarDetalhes(${ponto.id})"
                 style="cursor: pointer;">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-1">
                            <h6 class="mb-0 flex-grow-1">${ponto.nome}</h6>
                            ${ponto.verificado ? 
                                '<i class="bi bi-patch-check-fill text-success ms-1" title="Verificado"></i>' : ''}
                            ${ponto.avaliacao ? 
                                `<small class="ms-2"><i class="bi bi-star-fill text-warning"></i> ${ponto.avaliacao}</small>` : ''}
                        </div>
                        <p class="mb-1 text-muted small">
                            <i class="bi bi-geo-alt me-1"></i> ${ponto.bairro}
                            ${ponto.horario_funcionamento ? 
                                `<br><i class="bi bi-clock me-1"></i> ${ponto.horario_funcionamento.split('|')[0]}` : ''}
                        </p>
                        <span class="badge ${ponto.tipo === 'ecoponto_oficial' ? 'bg-success' : 
                                         ponto.tipo === 'ponto_doacao' ? 'bg-info' : 'bg-warning'}">
                            ${ponto.tipo === 'ecoponto_oficial' ? 'Ecoponto' : 
                              ponto.tipo === 'ponto_doacao' ? 'Doação' : 'Cooperativa'}
                        </span>
                    </div>
                    <i class="bi bi-chevron-right text-muted"></i>
                </div>
            </div>
        `).join('');
    }
    
    mostrarDetalhes(pontoId) {
        console.log('📄 Mostrando detalhes do ponto:', pontoId);
        
        const ponto = this.pontos.find(p => p.id === pontoId);
        if (!ponto) {
            console.error('Ponto não encontrado');
            return;
        }
        
        this.abrirModalDetalhes(ponto);
    }
    
    abrirModalDetalhes(ponto) {
        const modalElement = document.getElementById('pontoModal');
        if (!modalElement) {
            console.error('Modal não encontrado');
            this.mostrarDetalhesFallback(ponto);
            return;
        }
        
        // Atualizar título
        const titulo = document.getElementById('modalTitulo');
        if (titulo) {
            let tituloHTML = `<i class="bi ${ponto.tipo === 'ecoponto_oficial' ? 'bi-recycle' : 
                                          ponto.tipo === 'ponto_doacao' ? 'bi-heart' : 'bi-arrow-repeat'} me-2"></i> ${ponto.nome}`;
            
            if (ponto.verificado) {
                tituloHTML += ' <i class="bi bi-patch-check-fill text-success ms-2" title="Verificado"></i>';
            }
            
            if (ponto.avaliacao) {
                tituloHTML += ` <span class="badge bg-warning ms-2"><i class="bi bi-star-fill"></i> ${ponto.avaliacao}</span>`;
            }
            
            titulo.innerHTML = tituloHTML;
        }
        
        // Atualizar conteúdo
        const corpo = document.getElementById('modalCorpo');
        if (corpo) {
            let corpoHTML = `
                <div class="row">
                    <div class="col-md-8">
                        <p><strong><i class="bi bi-geo-alt me-2"></i>Endereço:</strong><br>
                        ${ponto.endereco}<br>
                        <small class="text-muted">${ponto.bairro}, ${ponto.cidade} - ${ponto.estado}</small></p>
                        
                        ${ponto.horario_funcionamento ? `
                            <p><strong><i class="bi bi-clock me-2"></i>Horário de Funcionamento:</strong><br>
                            ${ponto.horario_funcionamento}</p>
                        ` : ''}
                        
                        ${ponto.telefone ? `
                            <p><strong><i class="bi bi-telephone me-2"></i>Telefone:</strong><br>
                            ${ponto.telefone}</p>
                        ` : ''}
                        
                        ${ponto.site ? `
                            <p><strong><i class="bi bi-globe me-2"></i>Site:</strong><br>
                            ${ponto.site}</p>
                        ` : ''}
                        
                        <p><strong><i class="bi bi-tag me-2"></i>Tipo:</strong> 
                            <span class="badge ${ponto.tipo === 'ecoponto_oficial' ? 'bg-success' : 
                                               ponto.tipo === 'ponto_doacao' ? 'bg-info' : 'bg-warning'}">
                                ${ponto.tipo === 'ecoponto_oficial' ? 'Ecoponto Oficial' : 
                                 ponto.tipo === 'ponto_doacao' ? 'Ponto de Doação' : 'Cooperativa'}
                            </span>
                        </p>
                    </div>
                    <div class="col-md-4">
                        <div class="alert ${ponto.verificado ? 'alert-success' : 'alert-warning'}">
                            <i class="bi ${ponto.verificado ? 'bi-patch-check-fill' : 'bi-exclamation-triangle'} me-2"></i>
                            ${ponto.verificado ? 'Ponto verificado oficialmente' : 'Ponto não verificado oficialmente'}
                        </div>
                        
                        ${ponto.avaliacao ? `
                            <div class="alert alert-info">
                                <i class="bi bi-star-fill me-2"></i>
                                <strong>Avaliação:</strong> ${ponto.avaliacao}/5.0
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            if (ponto.observacoes) {
                corpoHTML += `
                    <hr>
                    <h6><i class="bi bi-chat-text me-2"></i>Observações</h6>
                    <p class="text-muted">${ponto.observacoes}</p>
                `;
            }
            
            if (ponto.materiais_aceitos && ponto.materiais_aceitos.length > 0) {
                corpoHTML += `
                    <hr>
                    <h6><i class="bi bi-check-circle me-2"></i>Itens Aceitos</h6>
                    <div class="d-flex flex-wrap gap-2 mt-2">
                        ${ponto.materiais_aceitos.map(item => `
                            <span class="badge bg-light text-dark border">${item}</span>
                        `).join('')}
                    </div>
                `;
            }
            
            corpo.innerHTML = corpoHTML;
        }
        
        // Configurar botão de rota
        const rotaBtn = document.getElementById('modalRotaBtn');
        if (rotaBtn && ponto.latitude && ponto.longitude) {
            rotaBtn.onclick = () => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${ponto.latitude},${ponto.longitude}`, '_blank');
            };
            rotaBtn.style.display = 'block';
        } else if (rotaBtn) {
            rotaBtn.style.display = 'none';
        }
        
        // Mostrar modal usando Bootstrap
        if (bootstrap && bootstrap.Modal) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } else {
            // Fallback se Bootstrap não estiver disponível
            modalElement.style.display = 'block';
            modalElement.classList.add('show');
        }
    }
    
    mostrarDetalhesFallback(ponto) {
        alert(`
            ${ponto.nome}
            
            Endereço: ${ponto.endereco}, ${ponto.bairro}
            ${ponto.horario_funcionamento ? `Horário: ${ponto.horario_funcionamento}\n` : ''}
            ${ponto.telefone ? `Telefone: ${ponto.telefone}\n` : ''}
            ${ponto.avaliacao ? `Avaliação: ${ponto.avaliacao}/5.0\n` : ''}
            Tipo: ${ponto.tipo === 'ecoponto_oficial' ? 'Ecoponto Oficial' : 
                   ponto.tipo === 'ponto_doacao' ? 'Ponto de Doação' : 'Cooperativa'}
            ${ponto.verificado ? '(Verificado)' : '(Não verificado)'}
            ${ponto.observacoes ? `\nObservações: ${ponto.observacoes}` : ''}
        `);
    }
    
    configurarEventos() {
        console.log('🎮 Configurando eventos...');
        
        // Botão buscar
        const buscarBtn = document.getElementById('buscarBtn');
        if (buscarBtn) {
            buscarBtn.addEventListener('click', () => this.aplicarFiltros());
        }
        
        // Filtros automáticos
        const filtros = ['bairroSelect', 'tipoSelect', 'materialSelect'];
        filtros.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('change', () => this.aplicarFiltros());
            }
        });
        
        console.log('✅ Eventos configurados');
    }
    
    aplicarFiltros() {
        console.log('🔍 Aplicando filtros...');
        
        const bairro = document.getElementById('bairroSelect')?.value;
        const tipo = document.getElementById('tipoSelect')?.value;
        const material = document.getElementById('materialSelect')?.value;
        
        let pontosFiltrados = this.pontos;
        
        // Filtrar por bairro
        if (bairro) {
            pontosFiltrados = pontosFiltrados.filter(p => p.bairro === bairro);
        }
        
        // Filtrar por tipo
        if (tipo) {
            pontosFiltrados = pontosFiltrados.filter(p => p.tipo === tipo);
        }
        
        // Filtrar por material
        if (material) {
            pontosFiltrados = pontosFiltrados.filter(p => 
                p.materiais_aceitos && 
                p.materiais_aceitos.some(item => 
                    item.toLowerCase().includes(material.toLowerCase())
                )
            );
        }
        
        // Atualizar contador
        document.getElementById('contadorPontos').textContent = pontosFiltrados.length;
        
        // Limpar e adicionar novos marcadores
        this.limparMarcadores();
        
        pontosFiltrados.forEach(ponto => {
            if (ponto.latitude && ponto.longitude) {
                // Código para adicionar marcador (reutilizar da função adicionarMarcadores)
                const cor = ponto.tipo === 'ecoponto_oficial' ? '#28a745' : 
                           ponto.tipo === 'ponto_doacao' ? '#17a2b8' : '#ffc107';
                const icone = ponto.tipo === 'ecoponto_oficial' ? 'bi-recycle' : 
                             ponto.tipo === 'ponto_doacao' ? 'bi-heart' : 'bi-arrow-repeat';
                
                const marker = L.marker([ponto.latitude, ponto.longitude], {
                    icon: L.divIcon({
                        html: `<div style="background-color: ${cor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white;"><i class="bi ${icone}"></i></div>`,
                        iconSize: [30, 30]
                    })
                }).addTo(this.map);
                
                this.markers.push(marker);
            }
        });
        
        // Ajustar zoom para mostrar marcadores filtrados
        if (this.markers.length > 0 && this.map) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
        
        // Atualizar lista
        this.atualizarListaPontosFiltrada(pontosFiltrados);
        
        console.log(`📊 ${pontosFiltrados.length} pontos após filtro`);
    }
    
    atualizarListaPontosFiltrada(pontosFiltrados) {
        const container = document.getElementById('resultados');
        if (!container) return;
        
        if (pontosFiltrados.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-emoji-frown display-4 text-muted mb-3"></i>
                    <h5 class="text-muted mb-2">Nenhum ponto encontrado</h5>
                    <p class="text-muted small">Tente ajustar os filtros de busca</p>
                    <button class="btn btn-outline-success btn-sm" onclick="app.limparFiltros()">
                        Limpar filtros
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = pontosFiltrados.map(ponto => `
            <div class="list-group-item list-group-item-action" 
                 onclick="app.mostrarDetalhes(${ponto.id})"
                 style="cursor: pointer;">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-1">
                            <h6 class="mb-0 flex-grow-1">${ponto.nome}</h6>
                            ${ponto.verificado ? 
                                '<i class="bi bi-patch-check-fill text-success ms-1" title="Verificado"></i>' : ''}
                        </div>
                        <p class="mb-1 text-muted small">
                            <i class="bi bi-geo-alt me-1"></i> ${ponto.bairro}
                        </p>
                        <span class="badge ${ponto.tipo === 'ecoponto_oficial' ? 'bg-success' : 
                                         ponto.tipo === 'ponto_doacao' ? 'bg-info' : 'bg-warning'}">
                            ${ponto.tipo === 'ecoponto_oficial' ? 'Ecoponto' : 
                              ponto.tipo === 'ponto_doacao' ? 'Doação' : 'Cooperativa'}
                        </span>
                    </div>
                    <i class="bi bi-chevron-right text-muted"></i>
                </div>
            </div>
        `).join('');
    }
    
    limparFiltros() {
        console.log('🧹 Limpando filtros...');
        
        // Resetar selects
        document.getElementById('bairroSelect').value = '';
        document.getElementById('tipoSelect').value = '';
        document.getElementById('materialSelect').value = '';
        
        // Mostrar todos os pontos novamente
        document.getElementById('contadorPontos').textContent = this.pontos.length;
        this.exibirPontos();
    }
    
    esconderLoading() {
        console.log('👋 Escondendo tela de loading...');
        
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 300);
        }
    }
    
    mostrarErro(mensagem) {
        console.error('❌ Erro:', mensagem);
        
        // Criar alerta de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
        errorDiv.style.zIndex = '9999';
        errorDiv.innerHTML = `
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            ${mensagem}
            <button type="button" class="btn-close ms-2" onclick="this.parentElement.remove()"></button>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Exportar para uso global
window.DescarteFacilApp = DescarteFacilApp;