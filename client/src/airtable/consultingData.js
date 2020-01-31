const APIKey = 'keyAYuXNZumm4ZvPD';

export const optimusList = async (params, skills) => {
  const response = await fetch(
    `https://api.airtable.com/v0/appKBpMbI41L3tQHO/Optimus%20Employees?maxRecords=${
      params.pageSize
    }&view=Grid%20view`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APIKey}`,
      },
    },
  );
  const data = await response.json();
  const candidates = [];
  for (let j = 0; j < data.records.length; j += 1) {
    const item = data.records[j];
    if (item.fields.name === undefined) {
      continue;
    }
    const oneUser = {
      id: item.id,
      uuid: item.fields.uuid,
      fullname: item.fields.name,
      rank: item.fields.rank,
      email: item.fields.email,
      similarity: item.fields.similarity,
    };
    for (let i = 0; i < skills.length; i += 1) {
      oneUser[`skill_${i + 1}`] = item.fields[`${skills[i].label}`];
    }
    candidates.push(oneUser);
  }
  return candidates;
};

export const studentsList = async (params, skills) => {
  const response = await fetch(
    `https://api.airtable.com/v0/appKBpMbI41L3tQHO/Schulich%20Students?maxRecords=${
      params.pageSize
    }&view=Grid%20view`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APIKey}`,
      },
    },
  );
  const data = await response.json();
  const candidates = [];
  for (let j = 0; j < data.records.length; j += 1) {
    const item = data.records[j];
    if (item.fields.name === undefined) {
      continue;
    }
    const oneUser = {
      id: item.id,
      fullname: item.fields.name,
      rank: item.fields.rank,
      email: item.fields.email,
    };
    for (let i = 0; i < skills.length; i += 1) {
      oneUser[`skill_${i + 1}`] = item.fields[`${skills[i].label}`];
    }
    candidates.push(oneUser);
  }
  return candidates;
};

export const bubbleDataTemp = async params => {
  const response = await fetch(
    `https://api.airtable.com/v0/appKBpMbI41L3tQHO/General?view=Grid%20view`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APIKey}`,
      },
    },
  );
  const data = await response.json();
  const { records } = data;
  const bubbleData = [];
  console.log('bubbleData', records);
  for (let i = 0; i < records.length - 1; i++) {
    if (records[i].fields[`skill_name`] === undefined) {
      continue;
    }
    bubbleData.push({
      label: records[i].fields[`skill_name`],
      description: records[i].fields[`skill_desc_long`],
      value: Number(records[i].fields[`skill_rel`]) * 100,
      color: records[i].fields[`skill_color`],
      positions: [
        { name: 'Business Analyst', rank: 1 },
        { name: 'Product Manager', rank: 1 },
        { name: 'Sales Associate', rank: 1 },
      ],
    });
  }
  return bubbleData;
};

export const getSkillCategoriesTemp = async params => {
  const response = await fetch(
    `https://api.airtable.com/v0/appKBpMbI41L3tQHO/General?view=Grid%20view`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APIKey}`,
      },
    },
  );
  const data = await response.json();
  const { records } = data;
  const categories = [];
  for (let i = 0; i < records.length - 1; i++) {
    if (records[i].fields[`skill_name`] === undefined) {
      continue;
    }
    categories.push({
      label: records[i].fields[`skill_name`],
      desc: records[i].fields[`skill_desc_short`],
      relevance: records[i].fields[`skill_rel`],
      color: records[i].fields[`skill_color`],
      candidate_avg: records[i].fields[`Schulich Students`],
      tp_avg: records[i].fields[`Optimus Employees`],
      employees_avg: records[i].fields[`Optimus Employees`],
      industry_avg: records[i].fields[`Industry`],
      value: i,
      checked: false,
    });
  }

  return categories;
};

export const getHighlightsTemp = async params => {
  const response = await fetch(
    `https://api.airtable.com/v0/appKBpMbI41L3tQHO/Highlights?view=Grid%20view`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APIKey}`,
      },
    },
  );
  const data = await response.json();
  const { records } = data;
  const categories = [];
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    if (record.fields.Event === undefined) {
      continue;
    }
    const highlight = {
      title: record.fields.Event,
      desc: record.fields.Description,
      employees: record.fields[`Optimus Employees`],
      candidates: record.fields[`Schulich Students`],
      industry: record.fields.Industry,
    };
    categories.push(highlight);
  }

  return categories;
};

export const getOptimusLegends = async params => {
  const response = await fetch(
    `https://api.airtable.com/v0/appKBpMbI41L3tQHO/DataVis?maxRecords=3&view=Grid%20view`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APIKey}`,
      },
    },
  );
  const data = await response.json();
  const { records } = data;
  const legends = [];

  records.forEach(record => {
    legends.push(record.fields.legends);
  });

  return legends;
};
