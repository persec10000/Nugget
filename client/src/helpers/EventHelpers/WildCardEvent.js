export let value = {};

export const onResultHelp = result => {
  value = result;
};

export const saveQuestionText = text => {
  value['questionText'] = text;
};

export const sendResultEvent = (event_id, sendEvent) => {
  let result = {};
  if (value.value === undefined) {
    result['show'] = 'false';
  } else {
    result = value;
    result['show'] = 'true';
  }

  return sendEvent({
    event_id,
    data: {
      event_type: 'wild_card_event',
      data: result,
    },
  });
};
