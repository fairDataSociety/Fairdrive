import React, { useState, useEffect } from "react";
import styles from "styles.module.css";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logIn, getAvatar } from "../../helpers/apiCalls";

function getAccount(state: any) {
  return state.account;
}

function getSystem(state: any) {
  return state.system;
}
export interface Props {}

function PasswordUnlock(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const account = useSelector((state) => getAccount(state));
  const system = useSelector((state) => getSystem(state));
  const [password, setPassword] = useState("");

  const [hasError, setHasError] = useState(false);

  const params: any = useParams();
  const fwdUrl = params.fwdUrl;

  console.log("unlock and then fwd to ", fwdUrl);
  const handleSetPassword = (e: any) => {
    setHasError(false);
    setPassword(e.target.value);
  };

  async function onLogin() {
    const isUserLoggedIn = await logIn(account.username, password)
      .then((res) => {
        //const avatar = await getAvatar(account.username);
        //console.log(avatar);
        dispatch({
          type: "SET_ACCOUNT",
          data: {
            avatar: res.avatar,
          },
        });
        dispatch({
          type: "SET_SYSTEM",
          data: {
            passWord: password,
          },
        });
        history.push("/drive/root");
      })
      .catch((e) => {
        setHasError(true);
        console.log("something wrong ", e);
      });
  }

  function anotherAccount() {
    history.push("/login");
  }

  function handleSubmit(e: any) {
    if (e.charCode === 13) {
      onLogin();
    }
  }

  useEffect(() => {
    if (system.unlocked) {
      history.push("/drive/root");
    }
  });

  return (
    <div className={styles.dialogBox}>
      <div className={styles.flexer}></div>
      <div className={styles.flexer}></div>
      <div className={styles.flexer}></div>
      <div className={styles.flexer}></div>
      <div className={styles.title}>Unlock your account</div>
      <div className={styles.flexer}></div>
      <div className={styles.flexer}></div>
      <div className={styles.flexer}></div>

      <img src={account.avatar} className={styles.dialogAvatar}></img>

      <div className={styles.username}>{account.username}</div>
      <div className={styles.flexer}></div>
      <div className={styles.flexer}></div>

      <div className={styles.dialogPasswordBox}>
        <input
          id="password"
          className={styles.dialogPassword}
          type="password"
          placeholder="Password"
          onKeyPress={(e) => handleSubmit(e)}
          onChange={(e) => handleSetPassword(e)}
        ></input>
      </div>

      {hasError ? <div className={styles.errormsg}>Wrong password?</div> : ""}

      <div className={styles.button} onClick={onLogin}>
        <div>
          <div className={styles.buttontext}>continue</div>
        </div>
      </div>

      <div className={styles.flexer}></div>
      <div className={styles.link} onClick={anotherAccount}>
        Sign in with another account
      </div>
    </div>
  );
}
export default React.memo(PasswordUnlock);
