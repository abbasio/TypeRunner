import { stringify } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import config from '../../firebaseconfig';
import { DEFAULT_WIDTH } from '../main';

export default (score = 0) => {
  const CENTER = DEFAULT_WIDTH / 2;
  let name = '';
  onCharInput((char) => {
    if (name.length < 5) {
      name += char;
      console.log(name);
    }
  });
  onKeyPress('backspace', () => {
    name = name.slice(0, name.length - 1);
    console.log(name);
  });
  add([text('SUBMIT SCORE'), pos(CENTER, 100), scale(4), origin('center')]);
  add([
    text(`Your Score: ${score}`),
    pos(CENTER, 200),
    scale(3),
    origin('center'),
  ]);
  add([
    text('Type in your name, then press Enter'),
    pos(CENTER, 250),
    scale(2),
    origin('center'),
  ]);

  const userName = add([
    text(''),
    pos(CENTER, 400),
    scale(3),
    origin('center'),
  ]);

  onUpdate(() => {
    userName.text = name.toUpperCase();
  });

  const app = initializeApp(config);
  function saveScore(name, score) {
    const db = getDatabase();
    push(ref(db, 'scores'), {
      name,
      score,
    });
  }

  onKeyPress('enter', () => {
    if (name.length) {
      saveScore(name, score);
      play('select');
      go('menu');
    } else {
      console.log('Name cannot be empty!');
      shake();
      play('error');
    }
  });
};
