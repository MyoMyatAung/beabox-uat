let timerId: NodeJS.Timeout | null = null;

export const startTimer = (callback: () => void) => {
  if (timerId) return;

  timerId = setInterval(() => {
    callback();
  }, 1000);
};

export const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
};
