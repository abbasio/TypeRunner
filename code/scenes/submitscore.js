import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';
import config from '../../firebaseconfig';

export default (score) => {
  const app = initializeApp(config);
  function saveScore(name, score) {
    const db = getDatabase();
    push(ref(db, 'scores'), {
      name,
      score,
    });
  }

  saveScore('omar', score);
};
