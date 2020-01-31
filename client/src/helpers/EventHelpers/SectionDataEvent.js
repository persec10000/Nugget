export let data = {};

export const addSectionData = (index, text, sectionId) => {
  if (index > 3) {
    if (!data['newSections']) data['newSections'] = [];
    let newSection = {};
    newSection[sectionId] = text;
    data['newSections'].push(newSection);
  } else {
    data[sectionId] = text;
  }
};

export const onSectionDataEvent = (event_id, sendEvent) => {
  console.log('section data event : ', data); // emit data

  sendEvent({
    event_id,
    data: {
      event_type: 'section_data_event',
      data: data,
    },
  });
};

export const getSectionDataEvent = () => {
  return data;
};
