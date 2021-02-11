import React, { useState, useEffect } from "react";
import styles from "styles.module.css";
import { useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { logIn, getAvatar } from "../../helpers/apiCalls";

function getAccount(state: any) {
  return state.account;
}

function getSystem(state: any) {
  return state.system;
}
export interface Props {}

function AccountLogin(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const account = useSelector((state) => getAccount(state));
  const system = useSelector((state) => getSystem(state));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [hasError, setHasError] = useState(false);

  const handleSetUsername = (e: any) => {
    setUsername(e.target.value);
    setHasError(false);
  };

  const handleSetPassword = (e: any) => {
    setPassword(e.target.value);
    setHasError(false);
  };

  async function onLogin() {
    const isUserLoggedIn = await logIn(username, password)
      .then((res: any) => {
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

  function handleSubmit(e: any) {
    if (e.charCode === 13) {
      onLogin();
    }
  }

  useEffect(() => {
    console.log(system);
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
      <div className={styles.title}>Login to your account</div>
      <div className={styles.flexer}></div>
      <div className={styles.flexer}></div>
      <div className={styles.flexer}></div>

      <div className={styles.dialogPasswordBox}>
        <input
          id="username"
          className={styles.dialogPassword}
          type="text"
          placeholder="Username"
          onKeyPress={(e) => handleSubmit(e)}
          onChange={(e) => handleSetUsername(e)}
        ></input>
      </div>

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
      {hasError ? <div className={styles.errormsg}>Could not login.</div> : ""}
      <div className={styles.flexer}></div>
      <div className={styles.flexer}></div>

      <div className={styles.button} onClick={onLogin}>
        <div>
          <div className={styles.buttontext}>continue</div>
        </div>
      </div>
    </div>
  );
}
export default React.memo(AccountLogin);
