// 스토리지 기능 지원 감지
// 참고 주소
// https://developer.mozilla.org/ko/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
/**
 * @param {string} type sessionStorage, localStorage 2가지
 */
export function storageAvailable(type = 'sessionStorage') {
  const storage = window[type];

  try {
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (err) {
    return (
      err instanceof DOMException &&
      // Firefox를 제외한 모든 브라우저
      (err.code === 22 ||
        // Firefox
        err.code === 1014 ||
        // 코드가 존재하지 않을 수도 있기 때문에 테스트 이름 필드도 있습니다.
        // Firefox를 제외한 모든 브라우저
        err.name === 'QuotaExceededError' ||
        // Firefox
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // 이미 저장된 것이있는 경우에만 QuotaExceededError를 확인하십시오.
      storage.length !== 0
    );
  }
}

export function setItem(key, obj, type = 'sessionStorage') {
  if (storageAvailable(type)) {
    const storage = window[type];
    // console.log(`success set item in ${type}`);
    return storage.setItem(key, JSON.stringify(obj));
  }
  // console.log(`fail set item in ${type}`);
  return storageAvailable(type);
}

export function getItem(key, type = 'sessionStorage') {
  if (storageAvailable(type)) {
    const storage = window[type];

    // console.log(`success get item in ${type}`);
    return JSON.parse(storage.getItem(key));
  }
  // console.log(`fail get item in ${type}`);
  return storageAvailable(type);
}

export function getItemWithoutParse(key, type = 'sessionStorage') {
  if (storageAvailable(type)) {
    const storage = window[type];

    // console.log(`success get item in ${type}`);
    return storage.getItem(key);
  }
  // console.log(`fail get item in ${type}`);
  return storageAvailable(type);
}

export function removeItem(key, type = 'sessionStorage') {
  if (storageAvailable(type)) {
    const storage = window[type];

    // console.log(`success remove item in ${type}`);
    return storage.removeItem(key);
  }
  // console.log(`fail remove item in ${type}`);
  return storageAvailable(type);
}

// 스토리지에 저장 되어 있는 모든 것들을 삭제.
export function clear(type = 'sessionStorage') {
  if (storageAvailable(type)) {
    const storage = window[type];

    // console.log(`success clear item in ${type}`);
    return storage.clear();
  }
  // console.log(`fail clear item in ${type}`);
  return storageAvailable(type);
}
