import { TEMP_NAME } from './Constants';

const userCheck = () => {
  const userAuth = sessionStorage.getItem(`${TEMP_NAME}`)
    ? JSON.parse(sessionStorage.getItem(`${TEMP_NAME}`))
    : false;
  const token = userAuth ? userAuth.token : 'NOT_HAVE_TOKEN';
  const id = userAuth ? userAuth.user.id : 'NOT_HAVE_ID';
  const headers = {
    Accept: 'application/json',
    // 'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Type': 'application/json'
  };

  // 세션스토리지에 토큰이 있는 경우
  if (userAuth) {
    headers.token = token;
    headers.id = id;
  }

  return headers;
};

const Fetch = (api, query = '', body = null) => {
  const headers = userCheck();
  const options = {
    method: api.method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(api.url + query, options);
      if (res.status !== 200) {
        alert('서버 오류입니다.\n관리자에게 문의하세요.');
        resolve(res.statusText);
      }
      const results = await res.json();
      const data = JSON.parse(results);
      if (data.status === 200) {
        resolve(data.results);
      } else if (data.status === 1160) {
        alert('장시간 미사용으로 로그아웃 되었습니다.');
        sessionStorage.setItem(`${TEMP_NAME}`, '');
        window.location.reload();
      } else {
        reject(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default Fetch;
