const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
  };
  
  const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    document.getElementById('eMessage').classList.add('hidden');
  
    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }

    if(handler){
        handler(result);
    }
  };

  const sendDelete = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json();
    document.getElementById('eMessage').classList.add('hidden');

    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }

    if(handler){
        handler(result);
    }
  }

  const hideError = () => {
    document.getElementById('eMessage').classList.add('hidden');
  }

  module.exports = {
    handleError,
    sendPost,
    sendDelete,
    hideError,
  }