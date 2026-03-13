const ACCESS_TOKEN_KEY = "mp_access";

export const setAccessToken = (accessToken) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};
