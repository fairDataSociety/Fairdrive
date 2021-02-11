import React, { useState } from "react";
import styles from "styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@material-ui/core";

function getAccount(state: any) {
  return state.account;
}
export interface Props {
  open: boolean;
}
function PasswordUnlock(props: Props) {
  const dispatch = useDispatch();
  const account = useSelector((state: any) => getAccount(state));

  const [password, setPassword] = useState();

  const handleSetPassword = (e: any) => {
    setPassword(e.target.value);
  };

  return (
    <Dialog fullScreen open={props.open}>
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
        <div className={styles.dialogPasswordBox}>
          <input
            className={styles.dialogPassword}
            type="password"
            placeholder="Password"
            onChange={(e) => handleSetPassword(e)}
          ></input>
        </div>

        <div
          className={styles.button}
          onClick={() =>
            dispatch({ type: "UNLOCK_SYSTEM", data: { passWord: password } })
          }
        >
          <div>
            <div className={styles.buttontext}>continue</div>
          </div>
        </div>

        <div className={styles.flexer}></div>
        <div
          className={styles.link}
          onClick={() =>
            dispatch({
              type: "SET_SYSTEM",
              data: { showPasswordUnlock: false },
            })
          }
        >
          Get me out of here
        </div>
      </div>
    </Dialog>
  );
}
export default React.memo(PasswordUnlock);
