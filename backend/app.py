from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import string, random

app = Flask(__name__)
CORS(app)

urls = {}

def generate_short_code(length=6):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

@app.route('/shorten', methods=['POST'])
def shorten_url():
    data = request.get_json()
    original_url = data.get('url')
    if not original_url:
        return jsonify({'error': 'URL is required'}), 400

    short_code = generate_short_code()
    urls[short_code] = original_url

    return jsonify({'short_url': request.host_url + short_code})
from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import string
import random
import re
from urllib.parse import urlparse
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permite requisições do React

# Configurações
BASE_URL = 'http://localhost:5000'  # Mude para seu domínio em produção

# "Banco de dados" em memória
urls_database = {}
# Estrutura: {'codigo': {'original_url': 'url', 'created_at': 'data', 'clicks': 0}}

def generate_short_code(length=6):
    """Gera um código curto aleatório"""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def is_valid_url(url):
    """Valida se a URL é válida"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def add_protocol(url):
    """Adiciona protocolo se não existir"""
    if not url.startswith(('http://', 'https://')):
        return 'https://' + url
    return url

def find_existing_url(original_url):
    """Procura se a URL já foi encurtada"""
    for code, data in urls_database.items():
        if data['original_url'] == original_url:
            return code
    return None

@app.route('/api/shorten', methods=['POST'])
def shorten_url():
    """Endpoint para encurtar URLs"""
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({'error': 'URL é obrigatória'}), 400
        
        original_url = data['url'].strip()
        
        if not original_url:
            return jsonify({'error': 'URL não pode estar vazia'}), 400
        
        # Adiciona protocolo se necessário
        original_url = add_protocol(original_url)
        
        # Valida a URL
        if not is_valid_url(original_url):
            return jsonify({'error': 'URL inválida'}), 400
        
        # Verifica se a URL já existe
        existing_code = find_existing_url(original_url)
        if existing_code:
            short_url = f"{BASE_URL}/{existing_code}"
            return jsonify({
                'original_url': original_url,
                'short_url': short_url,
                'short_code': existing_code,
                'message': 'URL já encurtada anteriormente'
            })
        
        # Gera código único
        while True:
            short_code = generate_short_code()
            if short_code not in urls_database:
                break
        
        # Salva na "base de dados" em memória
        urls_database[short_code] = {
            'original_url': original_url,
            'created_at': datetime.now().isoformat(),
            'clicks': 0
        }
        
        short_url = f"{BASE_URL}/{short_code}"
        
        return jsonify({
            'original_url': original_url,
            'short_url': short_url,
            'short_code': short_code,
            'message': 'URL encurtada com sucesso!'
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.route('/<short_code>')
def redirect_url(short_code):
    """Redireciona para a URL original"""
    try:
        if short_code not in urls_database:
            return jsonify({'error': 'URL não encontrada'}), 404
        
        # Incrementa contador de cliques
        urls_database[short_code]['clicks'] += 1
        
        original_url = urls_database[short_code]['original_url']
        return redirect(original_url)
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.route('/api/stats/<short_code>')
def get_stats(short_code):
    """Retorna estatísticas de uma URL encurtada"""
    try:
        if short_code not in urls_database:
            return jsonify({'error': 'URL não encontrada'}), 404
        
        data = urls_database[short_code]
        
        return jsonify({
            'original_url': data['original_url'],
            'short_code': short_code,
            'short_url': f"{BASE_URL}/{short_code}",
            'created_at': data['created_at'],
            'clicks': data['clicks']
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.route('/api/list')
def list_urls():
    """Lista todas as URLs encurtadas"""
    try:
        urls = []
        
        # Converte o dicionário em lista
        for short_code, data in urls_database.items():
            urls.append({
                'original_url': data['original_url'],
                'short_code': short_code,
                'short_url': f"{BASE_URL}/{short_code}",
                'created_at': data['created_at'],
                'clicks': data['clicks']
            })
        
        # Ordena por data de criação (mais recentes primeiro)
        urls.sort(key=lambda x: x['created_at'], reverse=True)
        
        # Limita a 10 resultados
        urls = urls[:10]
        
        return jsonify({
            'urls': urls,
            'total': len(urls_database)
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.route('/api/health')
def health_check():
    """Endpoint para verificar se a API está funcionando"""
    return jsonify({
        'status': 'ok',
        'message': 'NEKLI API está funcionando!',
        'version': '1.0.0',
        'total_urls': len(urls_database)
    })

@app.route('/api/clear')
def clear_urls():
    """Limpa todas as URLs (útil para desenvolvimento)"""
    global urls_database
    count = len(urls_database)
    urls_database = {}
    return jsonify({
        'message': f'{count} URLs removidas',
        'total_urls': len(urls_database)
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    print("🚀 Iniciando NEKLI Backend (sem banco de dados)...")
    print(f"📡 API disponível em: {BASE_URL}")
    print("📊 Endpoints disponíveis:")
    print("   POST /api/shorten - Encurtar URL")
    print("   GET /<code> - Redirecionar")
    print("   GET /api/stats/<code> - Estatísticas")
    print("   GET /api/list - Listar URLs")
    print("   GET /api/health - Status da API")
    print("   GET /api/clear - Limpar URLs (dev)")
    print("⚠️  AVISO: URLs serão perdidas ao reiniciar o servidor!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)