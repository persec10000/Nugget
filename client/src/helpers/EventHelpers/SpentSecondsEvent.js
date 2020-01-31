export const sendCalcEvent = (event_id, data, sendEvent) => {
  const result = data;

  return sendEvent({
    event_id,
    data: {
      event_type: 'spent_seconds_event',
      data: result,
    },
  });
};
