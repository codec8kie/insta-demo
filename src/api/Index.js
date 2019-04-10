import React, { Component } from 'react';
import styled from 'styled-components';
import { getCookie, setCookie } from './FireAuthUserUtils';

import FireAuthUser from './FireAuthUser';
class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 로그인
      id: '',
      pw: '',

      isLogin: false,

      // 회원가입
      typ_login: 1, // 1.이메일 2.구글 3. 페이스북
      joinId: '',
      joinPw: '',
      pwAgain: '',
      name: '',
      type: 0,

      isValidId: false,

      // 탈퇴
      cancelPw: '',

      isAuth: false, // 인증여부

      // 이메일 재발급
      email: ''
    };

    var config = {
      apiKey: 'AIzaSyDYd2YOikjLv54hQVGv4Y0XRnTsXwkiFGQ',
      authDomain: 'intern-insta.firebaseapp.com',
      databaseURL: 'https://intern-insta.firebaseio.com',
      projectId: 'intern-insta',
      storageBucket: 'intern-insta.appspot.com',
      messagingSenderId: '104063588438'
    };

    setCookie('userAuth', '');
    this.FireAuthUser = new FireAuthUser(
      'http://192.168.0.15:7410',
      'intern-insta',
      config
    );
    this.userAuth = getCookie('userAuth')
      ? JSON.parse(getCookie('userAuth'))
      : false;

    console.log(this.userAuth);
  }
  async login(id, pw) {
    const res = await this.FireAuthUser.login(id, pw);

    if (!res.hasOwnProperty('results')) {
      console.log(res);
      setCookie('userAuth', JSON.stringify(res));
      // window.location.reload();
    } else {
      alert(res.results);
    }
  }
  logout() {
    setCookie('userAuth', '');
    window.location.reload();
  }
  async verifyUser(id, pw) {
    const res = await this.FireAuthUser.verifyUser(id, pw);

    if (!res.hasOwnProperty('results')) {
      console.log(res);
    } else {
      alert(res.results);
    }
  }
  async googleLogin() {
    const res = await this.FireAuthUser.googleLogin();

    if (!res.hasOwnProperty('results')) {
      console.log(res);
      setCookie('userAuth', JSON.stringify(res));
      window.location.reload();
    } else {
      alert(res.results);
    }
  }
  async fbLogin() {
    const res = await this.FireAuthUser.fbLogin();

    if (!res.hasOwnProperty('results')) {
      console.log(res);
      setCookie('userAuth', JSON.stringify(res));
      window.location.reload();
    } else {
      alert(res.results);
    }
  }
  async signUp() {
    let bodyData = {
      user: {
        id: this.state.joinId,
        user_name: this.state.name,
        user_type: 0
      },
      user_auth: {
        typ_login: this.state.typ_login,
        pw: this.state.joinPw
      }
    };

    const res = await this.FireAuthUser.signUp(bodyData);

    if (!res.hasOwnProperty('results')) {
      console.log(res);
      alert('가입 성공');
    } else {
      alert(res.results);
    }
  }
  async checkId(id) {
    const res = await this.FireAuthUser.checkId(id);

    if (!res.hasOwnProperty('results')) {
      console.log(res);
      alert('사용 가능');
      this.setState({ isValidId: true });
    } else {
      alert(res.results);
    }
  }
  async cancelAccount() {
    let bodyData = {
      pw: this.state.cancelPw,
      uid: this.userAuth.uid,
      pid_user: this.userAuth.user.pid_user
    };

    const res =
      this.userAuth.typ_login === 1
        ? await this.FireAuthUser.cancelAccount(bodyData)
        : await this.FireAuthUser.cancelAccountAuth(bodyData);

    if (!res.hasOwnProperty('results')) {
      console.log(res);
      alert('탈퇴 성공');
      setCookie('userAuth', '');
      window.location.reload();
    } else {
      alert(res.results);
    }
  }
  async reAuth(id, pw, typ_login) {
    const res = await this.FireAuthUser.reAuth(id, pw, typ_login);

    if (!res.hasOwnProperty('results')) {
      console.log(res);
      alert('인증 성공');
      this.setState({ isAuth: true });
    } else {
      alert(res.results);
    }
  }
  async resetPw(email) {
    const res = await this.FireAuthUser.resetPw(email);

    if (!res.hasOwnProperty('results')) {
      console.log(res);
      alert('재설정 이메일 발송 성공');
    } else {
      alert(res.results);
    }
  }
  renderLoginBox() {
    if (this.userAuth) {
      return (
        <VerticalBox>
          <h1>{this.userAuth.user.user_name}님 로그인 환영</h1>
          <VerticalBox>
            {this.userAuth.typ_login === 1 ? (
              <HorizonBox>
                <Label>비밀번호</Label>
                <Input
                  type="password"
                  value={this.state.pw}
                  onChange={e => this.setState({ pw: e.target.value })}
                />
              </HorizonBox>
            ) : null}
            {this.userAuth.typ_login === 1 ? (
              <Bt1
                onClick={() =>
                  this.verifyUser(this.userAuth.user.id, this.state.pw)
                }
              >
                이메일 인증
              </Bt1>
            ) : null}
            <Bt1 onClick={() => this.logout()}>로그아웃</Bt1>
          </VerticalBox>
        </VerticalBox>
      );
    } else {
      return (
        <VerticalBox>
          <HorizonBox>
            <Label>아이디</Label>
            <Input
              type="text"
              value={this.state.id}
              onChange={e => this.setState({ id: e.target.value })}
            />
          </HorizonBox>

          <HorizonBox>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={this.state.pw}
              onChange={e => this.setState({ pw: e.target.value })}
            />
          </HorizonBox>

          <Bt1 onClick={() => this.login(this.state.id, this.state.pw)}>
            로그인
          </Bt1>

          <Bt2 onClick={() => this.googleLogin()}>구글 로그인</Bt2>
          <Bt3 onClick={() => this.fbLogin()}>페이스북 로그인</Bt3>
        </VerticalBox>
      );
    }
  }
  renderJoinBox() {
    return (
      <VerticalBox>
        <HorizonBox>
          <JBt1
            active={this.state.typ_login === 1}
            onClick={() => this.setState({ typ_login: 1, isValidId: false })}
          >
            이메일로 가입
          </JBt1>

          <JBt2
            active={this.state.typ_login === 2}
            onClick={() => this.setState({ typ_login: 2 })}
          >
            구글로 가입
          </JBt2>

          <JBt3
            active={this.state.typ_login === 3}
            onClick={() => this.setState({ typ_login: 3 })}
          >
            페이스북으로가입
          </JBt3>
        </HorizonBox>

        {this.state.typ_login === 1 ? (
          <HorizonBox2>
            <Label>아이디</Label>
            <Input
              type="text"
              value={this.state.joinId}
              onChange={e =>
                this.setState({ isValidId: false, joinId: e.target.value })
              }
            />
            <AuthId onClick={() => this.checkId(this.state.joinId)}>
              중복확인
            </AuthId>
          </HorizonBox2>
        ) : null}

        {this.state.typ_login === 1 ? (
          <HorizonBox2>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={this.state.joinPw}
              onChange={e => this.setState({ joinPw: e.target.value })}
            />
          </HorizonBox2>
        ) : null}

        {this.state.typ_login === 1 ? (
          <HorizonBox2>
            <Label>바밀번호 확인</Label>
            <Input
              type="password"
              value={this.state.pwAgain}
              onChange={e => this.setState({ pwAgain: e.target.value })}
            />
          </HorizonBox2>
        ) : null}

        <HorizonBox2>
          <Label>이름</Label>
          <Input
            type="text"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </HorizonBox2>

        <SubmitBt onClick={() => this.signUp({ ...this.state })}>
          가입하기
        </SubmitBt>
      </VerticalBox>
    );
  }
  renderCancelBox() {
    if (this.state.isAuth) {
      return (
        <VerticalBox>
          <h3>
            현재 아이디 :{' '}
            {this.userAuth ? this.userAuth.user.id : '로그인 필요'}
          </h3>
          {this.userAuth ? (
            <SubmitBt onClick={() => this.cancelAccount()}>탈퇴하기</SubmitBt>
          ) : null}
        </VerticalBox>
      );
    } else {
      return (
        <VerticalBox>
          <h3>
            현재 아이디 :{' '}
            {this.userAuth ? this.userAuth.user.id : '로그인 필요'}
          </h3>
          {this.userAuth.typ_login === 1 ? (
            <HorizonBox2>
              <Label>비밀번호 </Label>
              <Input
                type="password"
                value={this.state.cancelPw}
                onChange={e => this.setState({ cancelPw: e.target.value })}
              />
            </HorizonBox2>
          ) : null}

          {this.userAuth ? (
            <SubmitBt
              onClick={() =>
                this.reAuth(
                  this.userAuth.user.id,
                  this.state.cancelPw,
                  this.userAuth.typ_login
                )
              }
            >
              인증하기
            </SubmitBt>
          ) : null}
        </VerticalBox>
      );
    }
  }
  renderResetBox() {
    return (
      <VerticalBox>
        <HorizonBox2>
          <Label>이메일</Label>
          <Input
            type="text"
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
        </HorizonBox2>

        <SubmitBt onClick={() => this.resetPw(this.state.email)}>
          비밀번호 재설정하기
        </SubmitBt>
      </VerticalBox>
    );
  }
  render() {
    return (
      <IndexBox>
        <Title>로그인/로그아웃</Title>
        {this.renderLoginBox()}
        <Title>회원가입</Title>
        {this.renderJoinBox()}
        <Title>탈퇴</Title>
        {this.renderCancelBox()}
        <Title>비밀번호 재설정</Title>
        {this.renderResetBox()}
      </IndexBox>
    );
  }
}

const IndexBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-bottom: 20px;
`;
const Title = styled.div`
  font-size: 24px;

  margin-top: 20px;
`;
const VerticalBox = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid gray;

  margin-top: 30px;

  padding: 5%;
`;
const HorizonBox = styled.div`
  width: 450px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 20px;
  margin-bottom: 20px;
`;
export const HorizonBox3 = styled.div`
  width: 450px;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 20px;
  margin-bottom: 20px;
`;
const Input = styled.input`
  width: 300px;
  height: 30px;
  font-size: 18px;
`;
const Bt1 = styled.div`
  width: 180px;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000000;
  cursor: pointer;

  margin-right: 5px;
  margin-left: 5px;
  margin-bottom: 10px;

  padding: 5px;
`;
const Bt2 = styled.div`
  width: 180px;
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
  color: red;
  cursor: pointer;

  margin-right: 10px;
  margin-left: 10px;
`;
const Bt3 = styled.div`
  width: 180px;
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid blue;
  color: blue;
  cursor: pointer;

  margin-right: 10px;
  margin-left: 10px;
  margin-top: 20px;
`;

const HorizonBox2 = styled.div`
  width: 500px;
  display: flex;
  align-items: center;

  margin-top: 20px;
  margin-bottom: 20px;
`;

const Label = styled.div`
  width: 100px;
  font-size: 16px;
`;

const SubmitBt = styled.div`
  width: 200px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #0f0f0f;
  cursor: pointer;

  margin-top: 30px;
`;
const AuthId = styled.div`
  width: 60px;
  height: 30px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000000;
  cursor: pointer;

  margin-left: 15px;
`;
const JBt1 = styled.div`
  width: 220px;
  height: 40px;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000000;
  background: ${props => (props.active ? '#000000' : '#ffffff')};
  color: ${props => (props.active ? '#ffffff' : '#000000')};
  cursor: pointer;

  margin-right: 5px;
  margin-left: 5px;
`;
const JBt2 = styled.div`
  width: 220px;
  height: 40px;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
  background: ${props => (props.active ? 'red' : '#ffffff')};
  color: ${props => (props.active ? '#ffffff' : 'red')};
  cursor: pointer;

  margin-right: 10px;
  margin-left: 10px;
`;
const JBt3 = styled.div`
  width: 220px;
  height: 40px;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid blue;
  background: ${props => (props.active ? 'blue' : '#ffffff')};
  color: ${props => (props.active ? '#ffffff' : 'blue')};
  cursor: pointer;

  margin-right: 10px;
  margin-left: 10px;
`;
export default Index;
