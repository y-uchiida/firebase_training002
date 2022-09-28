import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  /* userの状態が変化したときに実行される関数
   * firebase のログイン状態を監視し、ログイン時/ログアウト時にそれぞれ処理を実行する
   */
  useEffect(() => {
    // onAuthStateChanged で、firebase のログイン状態の変更時に処理を実行する
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // authUser がtruthy ならログインした場合なので、login actionからユーザー情報をセットする
        dispatch(login({
          uid: authUser.uid,
          photoUrl: authUser.photoURL,
          displayName: authUser.displayName
        }));
      } else {
        // authUser の値がfalsy ならログアウトした場合なので、logout をdispatch
        dispatch(logout());
      }
    });

    // useEffect の return は副作用のクリーンアップの処理を記述できる
    return () => {
      unSub();
    }
  }, [dispatch]);

  return (
    <div className="App"></div>
  )
}

export default App
