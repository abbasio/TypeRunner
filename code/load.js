export default () => {
  loadSprite('runner', '../public/sprites/run.png', {
    sliceX: 8,
    anims: {
      run: {
        from: 0,
        to: 7,
        loop: true,
      },
    },
  });
  loadSound('error', '../public/sounds/error.wav');
  loadSound('death', '../public/sounds/death.wav');
  loadSound('select', '../public/sounds/select.wav');
  loadSound('click', '../public/sounds/click.wav');
  loadSound('win', '../public/sounds/win.wav');
};
