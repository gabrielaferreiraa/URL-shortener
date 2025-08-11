const API_BASE_URL = 'http://localhost:5000';

//Configurações para a API

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Erro ${response.status}`);
    }

    return {
      success: true,
      data,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Erro de conexão',
      status: error.status || 500
    };
  }
};

//Serviços para API

export const urlService = {
  
  /**
   * Encurta uma URL
   * @param {string} url - URL para encurtar
   * @returns {Promise} Resultado da operação
   */
  async shortenUrl(url) {
    return await apiRequest('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  },

   /**
   * Busca estatísticas de uma URL encurtada
   * @param {string} shortCode - Código da URL encurtada
   * @returns {Promise} Estatísticas da URL
   */
  async getUrlStats(shortCode) {
    return await apiRequest(`/api/stats/${shortCode}`);
  },

  /**
   * Lista todas as URLs encurtadas
   * @returns {Promise} Lista de URLs
   */
  async listUrls() {
    return await apiRequest('/api/list');
  },

  /**
   * Verifica se a API está funcionando
   * @returns {Promise} Status da API
   */
  async healthCheck() {
    return await apiRequest('/api/health');
  },

  /**
   * Limpa todas as URLs (desenvolvimento)
   * @returns {Promise} Resultado da limpeza
   */
  async clearUrls() {
    return await apiRequest('/api/clear');
  }
};

//Utilitários 

export const utils = {
  
  /**
   * Valida se uma URL é válida
   * @param {string} url - URL para validar
   * @returns {boolean} Se a URL é válida
   */
  isValidUrl(url) {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Copia texto para a área de transferência
   * @param {string} text - Texto para copiar
   * @returns {Promise<boolean>} Se a cópia foi bem-sucedida
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback para navegadores mais antigos
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (fallbackError) {
        console.error('Erro ao copiar:', fallbackError);
        return false;
      }
    }
  },

  /**
   * Formata data para exibição
   * @param {string} dateString - Data em formato ISO
   * @returns {string} Data formatada
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  },

  /**
   * Extrai domínio de uma URL
   * @param {string} url - URL completa
   * @returns {string} Domínio da URL
   */
  extractDomain(url) {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }
};


//Configurações e constantes

export const config = {
  API_BASE_URL,
  
  // Códigos de resposta HTTP
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
  },

  // Mensagens padrão
  MESSAGES: {
    SUCCESS: 'Operação realizada com sucesso!',
    ERROR: 'Ops! Algo deu errado.',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    INVALID_URL: 'Por favor, insira uma URL válida.',
    COPIED: 'Copiado para a área de transferência!',
    COPY_ERROR: 'Erro ao copiar. Tente novamente.'
  }
};

export default urlService;