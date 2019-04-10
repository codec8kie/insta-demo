import firebase from 'firebase/app';
import { _Fetch, setCookie } from './FireAuthUserUtils';

/**
 * @see 함수목록
 *
 * @method fbLogin           => 페이스북 로그인
 * @method googleLogin       => 구글 로그인
 * @method login             => 이메일 로그인
 *
 * @method signUp            => 회원 가입
 * @method cancelAccount     => 계정 삭제
 * @method cancelAccountAuth => 계정 삭제
 *
 * @method reAuth            => 개인정보 열람 위한 재인증
 * @method checkId           => 아이디 중복 확인
 * @method verifyUser        => 이메일 인증
 * @method resetPw           => 비밀번호 재설정
 *
 * @method googleAuth        => 구글 인증(로그인, 회원가입, 인증)
 * @method fbAuth            => 페이스북 인증(로그인, 회원가입, 인증)
 */

class FireAuthUser {
  constructor(server, appName ) {
    // firebase 중복 초기화 방지
    this.server = server;

    this.getData(server + '/' + appName + '/restapi/auth_desc');
  }

  // api 정보 불러오는 함수
  async getData(api_url) {
    try {
      const res = await _Fetch({ method: 'GET', url: api_url });

      let obj = {};
      res.map(item => {
        obj[item.api_name] = {};
        obj[item.api_name]['url'] = this.server + item.api;
        obj[item.api_name]['method'] = item.method;
        return true;
      });

      this.LOGIN_EMAIL = obj ? obj.user_login : null;
      this.LOGIN_OAUTH = obj ? obj.user_oauth_login : null;
      this.CHECK_EMAIL = obj ? obj.user_checkid : null;
      this.REGISTER = obj ? obj.user_register : null;
      this.REGISTER_OAUTH = obj ? obj.user_oauth_register : null;
      this.DELETE = obj ? obj.user_withdrawal : null;
      this.DELETE_OAUTH = obj ? obj.user_oauth_withdrawal : null;
      this.RESET_PW = obj ? obj.user_resetpw : null;
      this.AUTH_BY_PW = obj ? obj.user_check_user : null;
      this.VERIFY_EMAIL = obj ? obj.user_verify_email : null;

      // console.log('getData this', this);
    } catch (error) {
      console.error(error);
    }
  }

  /*************************************************
   * @description 페이스북 로그인
   *************************************************/
  async fbLogin() {
    let res = await this.fbAuth('login');

    return res;
  }

  /*************************************************
   * @description 구글 로그인
   *************************************************/
  async googleLogin() {
    let res = await this.googleAuth('login');

    return res;
  }

  /*************************************************
   * @description 이메일 로그인
   * @property {id, pw} => 유저 id(email) 와 pw
   *************************************************/
  async login(id, pw) {
    const body = {
      id: id,
      pw: pw,
      typ_login: 1
    };

    let res = await _Fetch(this.LOGIN_EMAIL, '', body);

    if (!res.results) {
      setCookie('userData', JSON.stringify(res));
      sessionStorage.setItem('userData', JSON.stringify(res));
    }
    return res;
  }

  /*************************************************
   * @description 회원가입
   * @property {bodyData} => 회원가입에 쓰이는 body 객체
   *
   * bodyData를 회원가입 요구조건에 맞게 수정하여 사용할 것
   *************************************************/
  async signUp(bodyData) {
    // console.log('signUp');
    // <-------- 연동 로그인 id 중복확인 부분 -------->

    // console.log('bodydata', bodyData);

    // **일반 로그인은 가입창에서 미리 확인하므로 제외
    if (!bodyData.user_auth.hasOwnProperty('typ_login')) {
      return 'FireAuthUser.signUp()에 필요한 typ_login 데이터가 존재하지않습니다.';
    }

    let fireObj = {
      uid: null,
      email: null
    };

    if (bodyData.user_auth.typ_login === 2) {
      fireObj = await this.googleAuth('join');
      if (!fireObj) {
        return { status: 1150, results: '이미 가입된 계정입니다.' };
      }
    } else if (bodyData.user_auth.typ_login === 3) {
      fireObj = await this.fbAuth('join');
      if (!fireObj) {
        return { status: 1150, results: '이미 가입된 계정입니다.' };
      }
    }

    // ------------------------------------------

    // 연동 가입은 이메일을 firebase에서 가져옴
    bodyData.user.id = fireObj.email ? fireObj.email : bodyData.user.id;

    // ** uid는 일반 로그인은 server에서 얻고
    //          연동 로그인은 위의 중복검사에서 얻음
    bodyData.uid = fireObj.uid ? fireObj.uid : null;

    console.log('signUp', this.REGISTER_OAUTH, this.REGISTER);

    let res = fireObj.uid
      ? await _Fetch(this.REGISTER_OAUTH, '', bodyData)
      : await _Fetch(this.REGISTER, '', bodyData);
    return res;
  }

  /*************************************************
   * @description 계정 삭제
   * @property {bodyData} => 유저 삭제에 필요한 bodyData
   *
   * bodyData = {
      pw       :
      uid      :
      pid_user :
    }
   *************************************************/
  async cancelAccount(bodyData) {
    let res = await _Fetch(this.DELETE, '', bodyData);

    return res;
  }

  /*************************************************
   * @description 계정 삭제
   * @property {bodyData} => 유저 삭제에 필요한 bodyData
   *
   * bodyData = {
   *  uid      :
   *  pid_user :
   * }
   *************************************************/
  async cancelAccountAuth(bodyData) {
    let res = await _Fetch(this.DELETE_OAUTH, '', bodyData);

    return res;
  }

  /*************************************************
   * @description 유저 계정인증
   * @property {id, pw, typ_login} => 유저 id & pw & typ_login
   *
   * 개인정보 수정시 권한을 얻기위한 재인증 과정
   *************************************************/
  async reAuth(id, pw, typ_login) {
    // 일반 로그인 재인증
    if (typ_login === 1) {
      let res = await _Fetch(this.AUTH_BY_PW, '?id=' + id + '&&pw=' + pw);
      return res;
    }
    // 구글 재인증
    else if (typ_login === 2) {
      let res = await this.googleAuth('auth', id);
      return res;
    }
    // 페이스북 재인증
    else if (typ_login === 3) {
      let res = await this.fbAuth('auth', id);
      return res;
    }
  }

  /*************************************************
   * @description id 중복 확인
   * @property {id} => 유저 id
   *************************************************/
  async checkId(id) {
    let res = await _Fetch(this.CHECK_EMAIL, '?id=' + id);

    return res;
  }

  /*************************************************
   * @description 이메일 인증
   * @property {id, pw} => 유저 id(이메일), pw
   *************************************************/
  async verifyUser(id, pw) {
    let bodyData = {
      id: id,
      pw: pw
    };

    let res = await _Fetch(this.VERIFY_EMAIL, '', bodyData);

    return res;
  }

  /*************************************************
   * @description 비밀번호 재설정 메일 보내기
   * @property {email} => 유저 ID (가입에 사용되는 이메일)
   *************************************************/
  async resetPw(email) {
    let res = await _Fetch(this.RESET_PW, '?email=' + email);

    return res;
  }

  /*****0********************************************
   * @description 구글 연동 과정
   * @property {key} => 1(로그인) 2(회원가입) 3(계정인증)
   *
   * 구글 연동으로 로그인 , 회원가입, 계정인증에 사용됨
   *************************************************/

  async googleAuth(key, id) {
    const provider = new firebase.auth.GoogleAuthProvider();

    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    firebase.auth().languageCode = 'kr';

    await firebase.auth().useDeviceLanguage();

    // provider.setCustomParameters({
    //   'login_hint': 'user@example.com'
    // });

    const firebaseRes = await firebase.auth().signInWithPopup(provider);

    const user = await firebaseRes.user;

    const token = await firebaseRes.credential.accessToken;

    const uid = await firebaseRes.user.uid;

    const currentUser = firebaseRes.user.W.currentUser;

    // 로그인
    if (key === 'login') {
      let res = await _Fetch(this.CHECK_EMAIL, '?id=' + user.email);

      if (!res.hasOwnProperty('results')) {
        // 생성된 미가입 파이어베이스 연동로그인 아이디 삭제
        currentUser
          .delete()
          .then(function() {})
          .catch(function(error) {
            return;
          });

        return {
          status: 1500,
          results: '아이디와 비밀번호를 다시 확인해주세요.'
        };
      } else {
        const body = {
          id: user.email,
          token: token,
          typ_login: 2,
          uid: uid
        };
        let res = await _Fetch(this.LOGIN_OAUTH, '', body);

        return res;
      }
    }

    // 회원가입
    else if (key === 'join') {
      try {
        await _Fetch(this.CHECK_EMAIL, '?id=' + user.email);
        return { uid: uid, email: user.email };
      } catch (e) {
        return null;
      }
    }
    // 계정인증
    else if (key === 'auth') {
      return new Promise((resolve, reject) => {
        // 아이디가 일치하다면
        if (firebaseRes.user.W.currentUser.email === id) {
          this.currentUser = firebaseRes.user.W.currentUser;

          resolve('인증 성공');
        } else {
          _Fetch(
            this.CHECK_EMAIL,
            '?id=' + firebaseRes.user.W.currentUser.email
          )
            // 자동으로 등록된 잘못입력한 이메일이 기존에 없던 이메일이라면 삭제
            .then(() => {
              firebaseRes.user.W.currentUser
                .delete()
                .then(function() {})
                .catch(function(error) {
                  return;
                });
              resolve({
                status: 1500,
                results: '아이디와 비밀번호를 다시 확인해주세요.'
              });
            })
            .catch(e => {
              resolve(e);
            });

          resolve({
            status: 1500,
            results: '아이디와 비밀번호를 다시 확인해주세요.'
          });
        }
      });
    }
  }

  /*************************************************
   * @description 페이스북 연동 과정
   * @property {key} => => 1(로그인) 2(회원가입) 3(계정인증)
   *
   * 페이스북 연동으로 로그인 , 회원가입, 계정인증에 사용됨
   *************************************************/
  async fbAuth(key, id) {
    const provider = new firebase.auth.FacebookAuthProvider();

    provider.addScope('email');
    firebase.auth().languageCode = 'kr_KR';

    // To apply the default browser preference instead of explicitly setting it.
    await firebase.auth().useDeviceLanguage();

    provider.setCustomParameters({
      display: 'popup'
    });

    let firebaseRes, user, token, uid, currentUser;

    try {
      firebaseRes = await firebase.auth().signInWithPopup(provider);

      user = await firebaseRes.user;

      token = await firebaseRes.credential.accessToken;

      uid = await firebaseRes.user.uid;

      currentUser = firebaseRes.user.W.currentUser;
    } catch (e) {
      if (e.code === 'auth/account-exists-with-different-credential') {
        return null;
      }
      console.log(e);
    }

    // 로그인
    if (key === 'login') {
      let res = await _Fetch(this.CHECK_EMAIL, '?id=' + user.email);

      if (!res.hasOwnProperty('results')) {
        // 생성된 미가입 파이어베이스 연동로그인 아이디 삭제
        currentUser
          .delete()
          .then(function() {})
          .catch(function(error) {
            return;
          });

        return {
          status: 1500,
          results: '아이디와 비밀번호를 다시 확인해주세요.'
        };
      } else {
        const body = {
          id: user.email,
          token: token,
          typ_login: 3,
          uid: uid
        };
        let res = await _Fetch(this.LOGIN_OAUTH, '', body);

        return res;
      }
    }
    // 회원가입
    else if (key === 'join') {
      try {
        await _Fetch(this.CHECK_EMAIL, '?id=' + user.email);
        return { uid: uid, email: user.email };
      } catch (e) {
        return null;
      }
    }
    // 계정인증
    else if (key === 'auth') {
      return new Promise((resolve, reject) => {
        // 아이디가 일치하다면
        if (firebaseRes.user.W.currentUser.email === id) {
          this.currentUser = firebaseRes.user.W.currentUser;

          resolve('인증 성공');
        } else {
          _Fetch(
            this.CHECK_EMAIL,
            '?id=' + firebaseRes.user.W.currentUser.email
          )
            // 자동으로 등록된 잘못입력한 이메일이 기존에 없던 이메일이라면 삭제
            .then(() => {
              firebaseRes.user.W.currentUser
                .delete()
                .then(function() {})
                .catch(function(error) {
                  return;
                });
              resolve({
                status: 1500,
                results: '아이디와 비밀번호를 다시 확인해주세요.'
              });
            })
            .catch(e => {
              resolve(e);
            });

          resolve({
            status: 1500,
            results: '아이디와 비밀번호를 다시 확인해주세요.'
          });
        }
      });
    }
  }
}
export default FireAuthUser;
