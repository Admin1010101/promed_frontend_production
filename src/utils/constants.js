export const API_BASE_URL = 'https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1';
// export const API_BASE_URL = 'https://wchandler2025.pythonanywhere.com/api/v1';
export const API_BASE_DOCS_URL = 'https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1/docs';

// Helper function to ensure URLs have trailing slashes
export const apiUrl = (endpoint) => {
  // Remove leading slash if present
  endpoint = endpoint.replace(/^\//, '');
  // Ensure trailing slash
  if (!endpoint.endsWith('/')) {
    endpoint += '/';
  }
  return `${API_BASE_URL}/${endpoint}`;
};