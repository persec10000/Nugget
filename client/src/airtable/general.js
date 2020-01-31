const APIKey = 'keyAYuXNZumm4ZvPD';

export const bubbleData = async params => {
  const response = await fetch(
    `https://api.airtable.com/v0/appUz1e5XI6Ood7g9/General?view=Grid%20view`,
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
  for (let i = 0; i < records.length; i++) {
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
  console.log(bubbleData);
  return bubbleData;
};
export const getSkillCategories = async params => {
  const response = await fetch(
    `https://api.airtable.com/v0/appUz1e5XI6Ood7g9/General?view=Grid%20view`,
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
  for (let i = 0; i < records.length; i++) {
    if (records[i].fields[`skill_name`] === undefined) {
      continue;
    }
    categories.push({
      label: records[i].fields[`skill_name`],
      desc: records[i].fields[`skill_desc_short`],
      relevance: records[i].fields[`skill_rel`],
      color: records[i].fields[`skill_color`],
      candidate_avg: records[i].fields[`Candidates`],
      tp_avg: records[i].fields[`Employees`],
      employees_avg: records[i].fields[`Employees`],
      industry_avg: records[i].fields[`Industry`],
      value: i,
      checked: false,
    });
  }

  return categories;
};
export const getHighlights = async params => {
  const response = await fetch(
    `https://api.airtable.com/v0/appUz1e5XI6Ood7g9/Highlights?view=Grid%20view`,
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
      employees: record.fields.Employees,
      candidates: record.fields.Candidates,
      industry: record.fields.Industry,
    };
    categories.push(highlight);
  }

  return categories;
};
