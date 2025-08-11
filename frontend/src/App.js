
import React, { useState } from 'react';
import './App.css';
import { urlService, utils, config } from './services/api.js';
import logo from './logo.svg';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Por favor, insira uma URL');
      return;
    }

    // Valida URL antes de enviar
    if (!utils.isValidUrl(url.trim())) {
      setError('Por favor, insira uma URL válida');
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const result = await urlService.shortenUrl(url.trim());

      if (result.success) {
        setShortUrl(result.data.short_url);
        setSuccess(result.data.message);
        setUrl(''); // Limpa o input
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(config.MESSAGES.NETWORK_ERROR);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUrl(e.target.value);
    clearMessages();
  };

  const copyToClipboard = async () => {
    const copied = await utils.copyToClipboard(shortUrl);
    
    if (copied) {
      setSuccess(config.MESSAGES.COPIED);
    } else {
      setError(config.MESSAGES.COPY_ERROR);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="container">
      <div className="logo-container">
        <img src={logo} alt="NEKLI" className="logo" />
      </div>
      
      <h1 className="title">Encurte sua URL</h1>
      
      <form className="form-container" onSubmit={handleSubmit}>
        <input 
          type="url" 
          className="url-input" 
          placeholder="Cole sua URL aqui"
          value={url}
          onChange={handleInputChange}
          disabled={loading}
          required
        />
        
        <button 
          type="submit" 
          className="shorten-btn"
          disabled={loading}
        >
          {loading ? 'Encurtando...' : 'Encurtar'}
        </button>
      </form>

      {/* Mensagens de erro */}
      {error && (
        <div className="message error-message">
          ❌ {error}
        </div>
      )}

      {/* Mensagens de sucesso */}
      {success && (
        <div className="message success-message">
          ✅ {success}
        </div>
      )}

      {/* Resultado da URL encurtada */}
      {shortUrl && (
        <div className="result-container">
          <h3>URL Encurtada:</h3>
          <div className="url-result">
            <input 
              type="text" 
              value={shortUrl} 
              readOnly 
              className="result-input"
            />
            <button 
              onClick={copyToClipboard}
              className="copy-btn"
              type="button"
            >
              📋 Copiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
