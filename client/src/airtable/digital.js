import { json2Params } from '../helpers/url';
const APIKey = 'keyAYuXNZumm4ZvPD';

export const digitalList = async (params, skills) => {
  const response = await fetch(
    `https://api.airtable.com/v0/appUz1e5XI6Ood7g9/Employees?view=Grid%20view`,
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
