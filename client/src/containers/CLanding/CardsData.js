import randomColor from 'randomcolor';
const CardsData = [
  {
    title: 'Speed',
    percent: Math.floor(Math.random() * 100) + 1 + '%',
    color: randomColor(),
    content:
      'This characteristic reflects your ability to take action quickly. ',
  },
  {
    title: 'Clarify',
    percent: Math.floor(Math.random() * 100) + 1 + '%',
    color: randomColor(),
    content:
      'This characteristic reflects your ability to take action quickly.',
  },
  {
    title: `Idea Articulation`,
    percent: Math.floor(Math.random() * 100) + 1 + '%',
    color: randomColor(),
    content:
      'This characteristic reflects your ability to communicate the ideas you generate. ',
  },
  {
    title: 'Simple Communications',
    percent: Math.floor(Math.random() * 100) + 1 + '%',
    color: randomColor(),
    content:
      'This characteristic reflects your ability to keep your communication simple and straightforward. ',
  },
  {
    title: 'Impactful Communication ',
    percent: Math.floor(Math.random() * 100) + 1 + '%',
    color: randomColor(),
    content:
      'This characteristic reflects your ability to write consistently and clearly. ',
  },
  {
    title: 'Detailed Writing',
    percent: Math.floor(Math.random() * 100) + 1 + '%',
    color: randomColor(),
    content:
      'This characteristic reflects your ability to communicate your ideas in writing.',
  },
  {
    title: 'Idea Articulation ',
    percent: Math.floor(Math.random() * 100) + 1 + '%',
    color: randomColor(),
    content:
      'This characteristic reflects your ability to communicate the ideas you generate. ',
  },
];

export default CardsData;
