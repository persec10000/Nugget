import { ms2s } from '../dataHelper';

export let result = {};
let cardResult = { startedAt: 0, duration: 0 };
let notifyResult = {
  res: { startedAt: 0, duration: 0 },
  wild: { startedAt: 0, duration: 0 },
};
let initResult = {};
let prev = null;
let last = null;

export const onFocusAccordion = key => {
  if (key > 0) {
    if (key === prev) {
      return;
    }
    if (prev != null) {
      const interval = Date.now() - result[prev].startedAt;
      const duration = result[prev].duration
        ? result[prev].duration + Number(interval)
        : Number(interval);
      result[prev] = { duration: duration };
    }
    prev = key;
    result[key] = { ...result[key], startedAt: Date.now() };
    console.log('timer_result_:::::', key, result);
  } else if (key === 'res' || key === 'wild') {
    if (notifyResult[key].startedAt !== 0) {
      notifyResult[key].duration = Date.now() - notifyResult[key].startedAt;
      notifyResult[key].startedAt = 0;
    } else {
      notifyResult[key].startedAt = Date.now();
    }
  } else {
    if (cardResult.startedAt !== 0) {
      const delay = Date.now() - cardResult.startedAt;
      cardResult.duration = cardResult.duration + Number(delay);
      cardResult.startedAt = 0;
    } else {
      cardResult.startedAt = Date.now();
      if (prev != null) {
        const interval = Date.now() - result[prev].startedAt;
        const duration = result[prev].duration
          ? result[prev].duration + Number(interval)
          : Number(interval);
        result[prev] = { duration: duration };
        prev = null;
      }
    }
    console.log('timer_result_:::::', key, cardResult);
  }
};

export const getResult = () => {
  for (const key in result) {
    if (result[key].startedAt) {
      let prevDuration;
      prevDuration =
        result[key].duration === undefined ? 0 : result[key].duration;
      const duration = Number(
        Date.now() - result[key].startedAt + prevDuration || 0,
      );
      console.log(
        'last-------:',
        duration,
        Date.now() - result[key].startedAt + prevDuration,
      );
      result[key] = ms2s(duration);
      last = key;
      continue;
    }
    result[key] = ms2s(result[key].duration);
  }
  if (cardResult.startedAt !== 0) {
    const delay = Date.now() - cardResult.startedAt;
    cardResult.duration = cardResult.duration + Number(delay);
    cardResult.startedAt = 0;
  }
  for (const key in notifyResult) {
    if (notifyResult[key].startedAt > 0) {
      notifyResult[key].duration = Date.now() - notifyResult[key].startedAt;
      notifyResult[key].startedAt = 0;
    }
    result[key] = ms2s(notifyResult[key].duration);
  }
  result[0] = ms2s(cardResult.duration);
};

export const init = () => {
  result = {};
  if (last) {
    result[last] = { startedAt: Date.now() };
  }
  prev = last;
};

const isActive = () => {
  return Object.keys(result).length !== 0;
};

export const onSendTimeSpent = (event_id, sendEvent) => {
  if (!isActive()) {
    return;
  }

  getResult();
  console.log('cardtimer result___________________ ', result);

  return sendEvent({
    event_id,
    data: {
      event_type: 'card_timer_event',
      data: result,
    },
  });

  // init();
};
