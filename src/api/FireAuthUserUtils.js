// api = {
//   method : (메소드),
//   url    : (route 경로)
// }
export const _Fetch = (api, query = '', body) => {
  console.log(api);
  //_Fetch -> url은 host + url로 완성된 상태로 넣어야함

  if (api === undefined) {
    return {
      status: 7777,
      results: 'FireAuhAdm api 정보가 존재하지 않습니다.'
    };
  }

  if (api.method === 'GET') {
    return _getFetch(api.url + query);
  } else if (api.method === 'PUT') {
    return _putFetch(api.url + query, body);
  } else if (api.method === 'POST') {
    return _postFetch(api.url + query, body);
  } else if (api.method === 'DELETE') {
    return _deleteFetch(api.url + query, body);
  }
};

const _getFetch = url => {
  // console.log(JSON.parse(getCookie('userData')));
  var userData = getCookie('userData')
    ? JSON.parse(getCookie('userData'))
    : false;

  var token = userData ? userData.token : 'NOT_HAVE_TOKEN';
  var id = userData ? userData.user.id : 'NOT_HAVE_ID';

  let options = {
    token: token,
    id: id
  };

  // window IE에서 cache-control을 no-cache로 처리. 데이터 페칭 작업시 문제가 생기면 주석처리해보고 작업해보세요.
  var agent = navigator.userAgent.toLowerCase();
  if (
    (navigator.appName === 'Netscape' && agent.indexOf('trident') !== -1) ||
    agent.indexOf('msie') !== -1
  ) {
    options['Pragma'] = 'no-cache';
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: { ...options }
    })
      .then(res => {
        if (res.status !== 200) {
          console.log('서버 응답', res);
          alert('서버 오류입니다.\n관리자에게 문의하세요.');
          return res.statusText;
        } else {
          return res.json();
        }
      })
      .then(res => JSON.parse(res))
      .then(data => {
        if (data.status === 200) {
          resolve(data.results);
        } else if (data.status === 1103) {
          resolve([]);
        } else if (data.status === 1116) {
          alert('로그아웃 되었습니다.');
          setCookie('userData', '');
          console.log(data);
          resolve(data);
        } else if (data.status === 1106) {
          console.log(data);
          resolve(data);
        } else if (data.status === 1000) {
          console.log(data);
          resolve(data);
        } else if (data.status === 1120) {
          resolve([]);
        } else {
          console.log(data);
          resolve(data);
        }
      })
      .catch(e => {
        console.log(e);
        resolve(e);
      });
  });
};

const _putFetch = (url, body) => {
  // console.log(url, body);
  var userData = getCookie('userData')
    ? JSON.parse(getCookie('userData'))
    : false;

  var token = userData ? userData.token : 'NOT_HAVE_TOKEN';
  var id = userData ? userData.user.id : 'NOT_HAVE_ID';

  let options = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    token: token,
    id: id
  };
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'PUT',
      headers: { ...options },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (res.status !== 200) {
          console.log('서버 응답', res);
          alert('서버 오류입니다.\n관리자에게 문의하세요.');
          resolve();
        } else {
          return res.json();
        }
      })
      .then(res => JSON.parse(res))
      .then(data => {
        if (data.status === 200) {
          resolve(data.results);
        } else if (data.status === 1116 || data.status === 1117) {
          alert('로그아웃 되었습니다.');
          setCookie('userData', '');
          console.log(data);
          resolve(data);
        } else if (data.status === 1108) {
          console.log(data);
          resolve(data);
        } else {
          console.log(data);
          resolve(data);
        }
      })
      .catch(e => {
        console.log(e);
        resolve(e);
      });
  });
};

const _postFetch = (url, body) => {
  var userData = getCookie('userData')
    ? JSON.parse(getCookie('userData'))
    : false;

  var token = userData ? userData.token : 'NOT_HAVE_TOKEN';
  var id = userData ? userData.user.id : 'NOT_HAVE_ID';

  let options = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    token: token,
    id: id
  };
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: { ...options },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (res.status !== 200) {
          console.log('서버 응답', res);
          alert('서버 오류입니다.\n관리자에게 문의하세요.');
          return res.statusText;
        } else {
          return res.json();
        }
      })
      .then(res => JSON.parse(res))
      .then(data => {
        if (data.status === 200) {
          resolve(data.results);
        } else if (data.status === 1116 || data.status === 1117) {
          alert('로그아웃 되었습니다.');
          setCookie('userData', '');
          console.log(data);
          resolve(data);
        } else if (data.status === 1105 || data.status === 1100) {
          console.log(data);
          resolve(data);
        } else {
          console.log(data);
          resolve(data);
        }
      })
      .catch(e => {
        console.log(e);
        resolve(e);
      });
  });
};

const _deleteFetch = (url, body) => {
  var userData = getCookie('userData')
    ? JSON.parse(getCookie('userData'))
    : false;

  var token = userData ? userData.token : 'NOT_HAVE_TOKEN';
  var id = userData ? userData.user.id : 'NOT_HAVE_ID';

  let options = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    token: token,
    id: id
  };
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'DELETE',
      headers: { ...options },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (res.status !== 200) {
          console.log('서버 응답', res);
          alert('서버 오류입니다.\n관리자에게 문의하세요.');
          return res.statusText;
        } else {
          return res.json();
        }
      })
      .then(res => JSON.parse(res))
      .then(data => {
        if (data.status === 200) {
          resolve(data.results);
        } else if (data.status === 1116 || data.status === 1117) {
          alert('로그아웃 되었습니다.');
          setCookie('userData', '');
          resolve(data);
        } else {
          console.log(data);
          resolve(data);
        }
      })
      .catch(e => {
        console.log(e);
        resolve(e);
      });
  });
};

// 쿠키 생성함수
export const getCookie = cname => {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      setCookie(cname, c.substring(name.length, c.length));
      return decodeURIComponent(c.substring(name.length, c.length));
    }
  }
  return null;
};

// 쿠키 저장함수
export const setCookie = (cname, cvalue) => {
  var d = new Date();
  let encodedValue = encodeURIComponent(cvalue);
  d.setTime(d.getTime() + 1 * 60 * 60 * 1000);

  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + encodedValue + ';' + expires + ';path=/';
};
