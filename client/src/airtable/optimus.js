import axios from 'axios';
const APIKey = 'keyAYuXNZumm4ZvPD';
const MAX_RECORD = 100;

const airtableInstance = axios.create();
airtableInstance.defaults.headers = {
  Authorization: `Bearer ${APIKey}`,
};

export const getDataFromAirtable = async url => {
  const { data } = await airtableInstance.get(url);

  return data.records.map(record => record.fields);
};

export const getEmployees = async () => {
  const url = `https://api.airtable.com/v0/appKBpMbI41L3tQHO/Optimus%20Employees?maxRecords=${MAX_RECORD}&view=Grid%20view`;
  const results = await getDataFromAirtable(url);

  return results.map(({ uuid, name, email, rank, ...result }) => ({
    id: uuid,
    uuid: uuid,
    fullname: name,
    email: email,
    rank: rank,
    isChecked: false,
    ...result,
  }));
};

export const getCandidates = async () => {
  const url = `https://api.airtable.com/v0/appKBpMbI41L3tQHO/Schulich%20Students?maxRecords=${MAX_RECORD}&view=Grid%20view`;
  const results = await getDataFromAirtable(url);

  return results.map(({ uuid, name, email, rank, ...result }) => ({
    id: uuid,
    uuid: uuid,
    fullname: name,
    email: email,
    rank: rank,
    isChecked: false,
    ...result,
  }));
};

export const getSkills = async () => {
  const url = `https://api.airtable.com/v0/appKBpMbI41L3tQHO/General?maxRecords=${MAX_RECORD}&view=Grid%20view`;
  const results = await getDataFromAirtable(url);

  const skills = [];
  const skillCategories = [];
  results.forEach(record => {
    const {
      skill_name,
      skill_desc_long,
      skill_color,
      skill_rel,
      ...result
    } = record;

    skills.push({
      label: skill_name,
      description: skill_desc_long,
      color: skill_color,
      value: skill_rel * 100,
      employeesAvgValue: record['Optimus Employees'],
      candidatesAvgValue: record['Schulich Students'],
      industry: record.Industry,
      ...result,
    });

    skillCategories.push(skill_name);
  });

  return {
    skills,
    skillCategories,
  };
};

export const getHighlights = async () => {
  const url = `https://api.airtable.com/v0/appKBpMbI41L3tQHO/Highlights?maxRecords=${MAX_RECORD}&view=Grid%20view`;
  const results = await getDataFromAirtable(url);

  return results.map(result => ({
    title: result.Event,
    desc: result.Description,
    employees: result[`Optimus Employees`],
    candidates: result[`Schulich Students`],
    industry: result.Industry,
  }));
};

export const getDataVis = async () => {
  const url = `https://api.airtable.com/v0/appKBpMbI41L3tQHO/DataVis?maxRecords=${MAX_RECORD}&view=Grid%20view`;
  const results = await getDataFromAirtable(url);

  const legends = [];
  const colors = [];

  results.forEach(result => {
    legends.push(result.legend);
    colors.push(result.color);
  });

  return {
    legends,
    colors,
  };
};
