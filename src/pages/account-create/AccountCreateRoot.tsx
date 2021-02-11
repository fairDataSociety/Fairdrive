import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import defaultAvatar from "images/defaultAvatar.png";
import {
  createAccount,
  createDirectory,
  createPod,
  isUsernamePresent,
  storeAvatar,
} from "../../helpers/apiCalls";
import { ethers } from "ethers";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

import GetLoginLogic from "../../contracts/GetLoginLogic.json";
import GetLoginStorage from "../../contracts/GetLoginStorage.json";
// Sub-pages
import AccountCreateIntro from "./pages/AccountCreateIntro";
import MnemonicShow from "./pages/MnemonicShow";
import MnemonicCheck from "./pages/MnemonicCheck";
import ChooseUsername from "./pages/ChooseUsername";
import ChoosePassword from "./pages/ChoosePassword";
import ChooseAvatar from "./pages/ChooseAvatar";
import CreatingAccount from "./pages/CreatingAccount";
import RestoreAccount from "./pages/RestoreAccount";
import AccountLoginWithGetLoginETH from "./pages/AccountLoginWithGetLoginETH";
// Ids
const accountCreateIntroId = "accountCreateIntroId";
const mnemonicShowId = "mnemonicShowId";
const mnemonicCheckId = "mnemonicCheckId";
const chooseUsernameId = "chooseUsernameId";
const chooseAvatarId = "chooseAvatarId";
const choosePasswordId = "choosePasswordId";
const creatingAccountId = "creatingAccountId";
const restoreAccountId = "restoreAccountId";
const fairdriveConnectId = "fairdriveConnectId";
export function AccountCreateRoot() {
  const dispatch = useDispatch();

  const [stage, setStage] = useState(accountCreateIntroId);
  const history = useHistory();
  // Mnemonic for debugging
  //   const [mnemonic, setMnemonic] = useState([
  //     "scissors",
  //     "system",
  //     "judge",
  //     "reveal",
  //     "slogan",
  //     "rice",
  //     "option",
  //     "body",
  //     "bronze",
  //     "insane",
  //     "evolve",
  //     "matter"
  //   ]);
  const [mnemonic, setMnemonic] = useState([]);
  const [collection, setCollection] = useState();
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [username, setUsername] = useState("");
  const [usernameExists, setUsernameExists] = useState("");
  const [password, setPassword] = useState();
  const [invite, setInvite] = useState("");

  const [accountCreateDone, setAccountCreateDone] = useState(false);
  const [item0, setItem0] = useState(false);
  const [item1, setItem1] = useState(false);
  const [item2, setItem2] = useState(false);
  const [item3, setItem3] = useState(false);

  async function handleUsername(username: string) {
    setUsername(username);
    await isUsernamePresent(username)
      .then((res) => {
        console.log(res);
        if (res.data.present) {
          setUsernameExists("Username taken.");
        } else {
          setUsernameExists("");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const encryptWallet = (wallet: any, password: any) => {
    return wallet.encrypt(password);
  };
  const filterUsername = (username: any) => {
    return username.trim();
  };

  const getUsernameHash = (username: any) => {
    username = filterUsername(username);

    return Web3.utils.keccak256(username);
  };

  const isUsernameRegistered = async (contract: any, username: any) => {
    const usernameHash = await getUsernameHash(username);
    const result = await contract.getUserInfo(usernameHash);

    return result ? result.isActive : false;
  };
  const getAccountFromInvite = async (web3Provider: any, invite: any) => {
    if (invite.indexOf("0x") === -1) {
      invite = "0x" + invite;
    }

    return web3Provider.eth.accounts.privateKeyToAccount(invite);
  };

  const createAccountWithGetLoginConnect = async () => {
    setStage(creatingAccountId);
    const Web3Provider = new Web3(
      new Web3.providers.HttpProvider(
        `${process.env.REACT_APP_GOERLI_ENDPOINT}`
      )
    );
    const inviteWallet = ethers.Wallet.fromMnemonic(invite);
    const wallet = Web3Provider.eth.accounts.create();
    const encryptedWallet = encryptWallet(wallet, password);

    const logicContract = new Web3Provider.eth.Contract(
      GetLoginLogic.abi as AbiItem[],
      process.env.REACT_APP_LOGIC,
      {
        from: inviteWallet.address,
      }
    );
    const storageContract = new Web3Provider.eth.Contract(
      GetLoginStorage.abi as AbiItem[],
      process.env.REACT_APP_STORAGE
    );
    const usernameHash = getUsernameHash(username);
    const info = await logicContract.methods
      .createUserFromInvite(
        usernameHash,
        "0x" + encryptedWallet.address,
        encryptedWallet.crypto.ciphertext,
        encryptedWallet.crypto.cipherparams.iv,
        encryptedWallet.crypto.kdfparams.salt,
        encryptedWallet.crypto.mac,
        true
      )
      .encodeABI();
    let result = {
      from: inviteWallet.address,
      to: process.env.REACT_APP_LOGIC,
      value: Web3.utils.toWei("0.1", "ether"),
      data: info,
    };
    const signedTx = await signAndSendTx(
      result,
      inviteWallet.privateKey,
      Web3Provider
    );
    await createAccountProcess();
  };
  const signAndSendTx = async (
    result: any,
    privateKey: string,
    Web3Provider: Web3
  ) => {
    const gasPrice = 2;
    const gasLimit = 3000000;
    result.gasLimit = Web3.utils.toHex(gasLimit);
    result.gasPrice = Web3.utils.toHex(gasPrice * 1e9);
    let signed: any;
    signed = await Web3Provider.eth.accounts.signTransaction(
      result,
      privateKey
    );
    return await Web3Provider.eth.sendSignedTransaction(signed.rawTransaction);
  };

  // Create account function
  const createAccountProcess = async () => {
    setStage(creatingAccountId);
    const mnemonicJoined = mnemonic.join(" ");

    // res: address and mnemonic
    const newUser = await createAccount(
      username,
      password,
      mnemonicJoined
    ).catch((e) => {
      throw new Error("User creation error");
    });
    const avatarStorage = await storeAvatar(avatar);

    setItem0(true);
    await createPod(password, "Fairdrive");

    setItem1(true);
    await createDirectory("Documents");
    await createDirectory("Movies");
    await createDirectory("Music");
    await createDirectory("Pictures");

    setItem2(true);
    // store account in Redux
    const userObject = {
      status: "accountSet",
      username: username,
      avatar: avatar,
      address: newUser.reference,
      balance: 0.0,
    };

    dispatch({ type: "SET_ACCOUNT", data: userObject });
    dispatch({
      type: "SET_SYSTEM",
      data: {
        hasAcount: true,
        passWord: password,
      },
    });

    setItem3(true);
    history.push("/drive/root");
  };

  // Router
  switch (stage) {
    case accountCreateIntroId:
      return (
        <AccountCreateIntro
          createStage={() => setStage(mnemonicShowId)}
          restoreStage={() => setStage(restoreAccountId)}
          nextStage={() => setStage(fairdriveConnectId)}
          exitStage={() => history.goBack()}
        />
      );
    case fairdriveConnectId:
      return (
        <AccountLoginWithGetLoginETH
          username={username}
          setUsername={handleUsername}
          setPassword={setPassword}
          password={password}
          setInvite={setInvite}
          setMnemonic={setMnemonic}
          invite={invite}
          createAccount={createAccountWithGetLoginConnect}
          exitStage={() => setStage(accountCreateIntroId)}
          nextStage={() => setStage(accountCreateIntroId)}
        ></AccountLoginWithGetLoginETH>
      );

    case mnemonicShowId:
      return (
        <MnemonicShow
          nextStage={() => setStage(mnemonicCheckId)}
          exitStage={() => setStage(accountCreateIntroId)}
          setMnemonic={setMnemonic}
          mnemonic={mnemonic}
        />
      );
    case mnemonicCheckId:
      return (
        <MnemonicCheck
          nextStage={() => setStage(chooseUsernameId)}
          prevStage={() => setStage(mnemonicShowId)}
          exitStage={() => setStage(accountCreateIntroId)}
          mnemonic={mnemonic}
        />
      );
    case chooseUsernameId:
      return (
        <ChooseUsername
          usernameExists={usernameExists}
          avatar={avatar}
          setUsername={handleUsername}
          username={username}
          nextStage={() => setStage(choosePasswordId)}
          exitStage={() => setStage(accountCreateIntroId)}
          avatarStage={() => setStage(chooseAvatarId)}
        ></ChooseUsername>
      );
    case chooseAvatarId:
      return (
        <ChooseAvatar
          avatar={defaultAvatar}
          exitStage={() => setStage(chooseUsernameId)}
          setAvatar={setAvatar}
        ></ChooseAvatar>
      );
    case choosePasswordId:
      return (
        <ChoosePassword
          createAccount={createAccountProcess}
          exitStage={() => setStage(accountCreateIntroId)}
          nextStage={() => setStage(choosePasswordId)}
          restoreStage={() => setStage(choosePasswordId)}
          setPassword={setPassword}
          password={password}
        />
      );
    case creatingAccountId:
      return (
        <CreatingAccount
          accountCreateDone={accountCreateDone}
          item0={item0}
          item1={item1}
          item2={item2}
          item3={item3}
          nextStage={() => setStage(choosePasswordId)}
        />
      );
    case restoreAccountId:
      return <RestoreAccount></RestoreAccount>;
    default:
      return <h1>Oops...</h1>;
  }
}

export default AccountCreateRoot;
