export const NUGGET_TOKEN = 'NUGGET_TOKEN';
export const NUGGET_USER = 'NUGGET_USER';
export const NUGGET_CANDIDATE = 'NUGGET_CANDIDATE';
export const NUGGET_LOG_TIME = 'NUGGET_LOG_TIME';
export const LOG_OUT_TIME = 172800000;

export const saveToken = token => {
  localStorage.setItem(NUGGET_TOKEN, token);
};

export const getToken = () => {
  const token = localStorage.getItem(NUGGET_TOKEN);
  return token;
};

export const removeToken = () => {
  localStorage.removeItem(NUGGET_TOKEN);
};

export const saveLogTime = () => {
  localStorage.setItem(NUGGET_LOG_TIME, new Date().getTime());
};

export const getLogTime = () => {
  const time = localStorage.getItem(NUGGET_LOG_TIME);
  return time;
};

export const removeLogTime = () => {
  localStorage.removeItem(NUGGET_LOG_TIME);
};

export const isExpired = () => {
  const logTime = getLogTime();
  if (logTime && new Date().getTime() - logTime > LOG_OUT_TIME) {
    removeLogTime();
    return true;
  }
  return false;
};

export const saveUser = user => {
  localStorage.setItem(NUGGET_USER, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(NUGGET_USER);
  return user ? JSON.parse(user) : null;
};

export const existUser = () => {
  const user = localStorage.getItem(NUGGET_USER);
  return user ? true : false;
};

export const removeUser = () => {
  removeToken();
  localStorage.removeItem(NUGGET_USER);
};
