import React, { useState } from "react";
import styles from "styles.module.css";
import accountstyles from "../account-create.module.css";
import { Check } from "@material-ui/icons";

export interface Props {
  nextStage: any;
  prevStage: any;
  exitStage: any;
  mnemonic: any;
}
function MnemonicCheck(props: Props) {
  console.log(
    props.mnemonic[2],
    props.mnemonic[4],
    props.mnemonic[7],
    props.mnemonic[10]
  );

  const [word0Validity, setWord0Validity] = useState(false);
  const [word1Validity, setWord1Validity] = useState(false);
  const [word2Validity, setWord2Validity] = useState(false);
  const [word3Validity, setWord3Validity] = useState(false);

  const check0Validity = (num: any, e: any) => {
    if (e.target.value === props.mnemonic[num]) {
      setWord0Validity(true);
    } else {
      setWord0Validity(false);
    }
  };

  const check1Validity = (num: any, e: any) => {
    if (e.target.value === props.mnemonic[num]) {
      setWord1Validity(true);
    } else {
      setWord1Validity(false);
    }
  };

  const check2Validity = (num: any, e: any) => {
    if (e.target.value === props.mnemonic[num]) {
      setWord2Validity(true);
    } else {
      setWord2Validity(false);
    }
  };

  const check3Validity = (num: any, e: any) => {
    if (e.target.value === props.mnemonic[num]) {
      setWord3Validity(true);
    } else {
      setWord3Validity(false);
    }
  };

  return (
    <div className={accountstyles.container}>
      <div className={accountstyles.closeButton} onClick={props.exitStage}>
        <div className={styles.closeicon} />
      </div>
      <div className={accountstyles.title}>Check your backup</div>
      <div className={accountstyles.subtitle}>
        Didn't write it down? You can start over with a{" "}
        <span className={accountstyles.link} onClick={props.prevStage}>
          {" "}
          new seed phrase
        </span>
        .
      </div>
      <div className={accountstyles.mnemoniccheck}>
        <div className={accountstyles.mnemonicinputbox}>
          <input
            className={accountstyles.mnemonicinput}
            placeholder="word 3"
            autoCorrect="off"
            autoCapitalize="none"
            data-lpignore="true"
            onChange={(e) => check0Validity(2, e)}
          ></input>
          {word0Validity ? (
            <Check
              style={{
                color: "#FFFFFF",
              }}
            ></Check>
          ) : (
            <Check
              style={{
                color: "#222222",
              }}
            ></Check>
          )}
        </div>
        <div className={accountstyles.mnemonicinputbox}>
          <input
            className={accountstyles.mnemonicinput}
            placeholder="word 5"
            autoCorrect="off"
            autoCapitalize="none"
            data-lpignore="true"
            onChange={(e) => check1Validity(4, e)}
          ></input>
          {word1Validity ? (
            <Check
              style={{
                color: "#FFFFFF",
              }}
            ></Check>
          ) : (
            <Check
              style={{
                color: "#222222",
              }}
            ></Check>
          )}
        </div>
        <div className={accountstyles.mnemonicinputbox}>
          <input
            className={accountstyles.mnemonicinput}
            placeholder="word 8"
            autoCorrect="off"
            autoCapitalize="none"
            data-lpignore="true"
            onChange={(e) => check2Validity(7, e)}
          ></input>
          {word2Validity ? (
            <Check
              style={{
                color: "#FFFFFF",
              }}
            ></Check>
          ) : (
            <Check
              style={{
                color: "#222222",
              }}
            ></Check>
          )}
        </div>
        <div className={accountstyles.mnemonicinputbox}>
          <input
            className={accountstyles.mnemonicinput}
            placeholder="word 11"
            autoCorrect="off"
            autoCapitalize="none"
            data-lpignore="true"
            onChange={(e) => check3Validity(10, e)}
          ></input>
          {word3Validity ? (
            <Check
              style={{
                color: "#FFFFFF",
              }}
            ></Check>
          ) : (
            <Check
              style={{
                color: "#222222",
              }}
            ></Check>
          )}
        </div>
      </div>
      {word0Validity && word1Validity && word2Validity && word3Validity ? (
        <div tabIndex={2} className={styles.button} onClick={props.nextStage}>
          <div>
            <div className={styles.buttontext}>continue</div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default React.memo(MnemonicCheck);
