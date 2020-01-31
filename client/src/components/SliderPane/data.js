import { StyleSheet } from '@react-pdf/renderer';

export const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max - 20)) + 20;
};

export const polarData = [
  {
    name: 'Simulated',
    type: 'area',
    data: [20000, 30000, 40000, 35000, 40000],
    pointPlacement: 'on',
    fillOpacity: 0.8,
    color: '#0066FF',
  },
  {
    name: 'Employees',
    data: [93000, 48000, 102000, 66000, 47000],
    pointPlacement: 'on',
    color: '#502c01',
  },
];

export const pipelinePolarDat = {
  All: {
    name: 'Employees',
    data: [93000, 48000, 102000, 66000, 47000],
    pointPlacement: 'on',
    color: '#502c01',
  },
  Employees: {
    name: 'Employees',
    data: [43000, 19000, 60000, 35000, 40000],
    pointPlacement: 'on',
    color: '#552c84',
  },
  Candidates: {
    name: 'Candidates',
    data: [50000, 39000, 42000, 31000, 7000],
    pointPlacement: 'on',
    color: '#fc8e7f',
  },
};

export const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    lineHeight: 1.2,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 150,
    height: 50,
  },
  logoWhite: {
    width: 220,
    height: 50,
  },
  headerLeft: {
    flex: 1,
    fontSize: 12,
    textAlign: 'left',
    color: 'grey',
  },
  headerRight: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
    color: 'grey',
  },
  imageWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    marginTop: 100,
    marginBottom: 70,
    width: 450,
    height: 140,
  },
  textLarge: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 28,
    color: '#3b4962',
  },
  textSemiLarge: {
    textAlign: 'center',
    fontSize: 23,
    color: '#3b4962',
  },
  textSemiMedium1: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 17,
    color: '#858bf6',
  },
  textSemiMedium2: {
    textAlign: 'center',
    fontSize: 17,
    color: '#858bf6',
  },
  subtitle: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagTextWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
  },
  tagTextDesc: {
    width: '80%',
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: 'normal',
  },
  normalText: {
    marginVertical: 5,
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'justify',
  },
  table: {
    marginHorizontal: 60,
    marginTop: 9,
  },
  tableTitle: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b4962',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottom: '1pt solid #d8d8d8',
  },
  tableColFirst: {
    width: 420,
  },
  tableColFirstExternal: {
    width: 420,
  },
  tableColSecond: {
    width: 120,
  },
  tableColThird: {
    width: 120,
  },
  tableColFourth: {
    width: 120,
  },
  tableHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gray',
  },
  tableTagName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3b4962',
  },
  tableTagDescription: {
    fontSize: 10,
    fontWeight: 'normal',
    color: '#3b4962',
  },
  tableValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#9089ff',
  },
  viewTwoCol: {
    display: 'flex',
    flexDirection: 'row',
  },
  firstCol: {
    flexGrow: 1,
  },
  secondCol: {
    flexGrow: 1,
  },
  paragraph: {
    width: '50%',
    padding: 18,
  },
  paragraphTitle: {
    marginBottom: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  paragraphHeader: {
    display: 'flex',
    flexDirection: 'row',
  },
  paragraphCircle: {
    width: 10,
    height: 10,
    marginTop: 3,
    marginRight: 3,
    borderRadius: 5,
  },
  paragraphDesc: {
    fontSize: 13,
    fontWeight: 'normal',
    textAlign: 'justify',
  },
  lastPage: {
    display: 'flex',
    flexDirection: 'row',
  },
  lastPageLeftSide: {
    width: '50%',
    borderRight: '1pt solid white',
    paddingRight: 30,
  },
  lastPageRightSide: {
    width: '50%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutNugget: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 30,
    textAlign: 'justify',
  },
  descNugget: {
    fontSize: 15,
    fontWeight: 'normal',
    color: 'white',
    marginBottom: 60,
  },
  bodyLast: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#4A4A4A',
  },
  tablestyle2: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
  },
  tableColumn: {
    flexGrow: 1,
  },
  tableHeaderStyle2: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'gray',
    width: '50%',
    textAlign: 'center',
    marginVertical: 20,
  },
  tableValue2: {
    fontSize: 15,
    fontWeight: 'bold',
    width: '50%',
    marginVertical: 10,
  },
  tableHeaderStyle3: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'gray',
    width: '33%',
    textAlign: 'center',
    marginVertical: 20,
  },
  tableValue3: {
    fontSize: 15,
    fontWeight: 'bold',
    width: '33%',
    marginVertical: 10,
  },
  textBold: {
    fontFamily: 'Times-Bold',
  },
  overallFooterTitle: {
    marginTop: 10,
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
  },
  overallFooterDesc: {
    marginBottom: 20,
    fontSize: 15,
    color: '#4a4a4a',
    fontFamily: 'Times-Italic',
    textAlign: 'center',
  },
  overallFooterNames: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
  },
});
