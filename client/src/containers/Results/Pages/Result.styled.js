import { Tabs, Tab, withStyles } from '@material-ui/core';

export const PageTabs = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '20px',
    minHeight: '40px',
    width: 'max-content',
    margin: '0 20px',
  },
  indicator: {
    height: '100%',
    borderRadius: '20px',
    backgroundColor: '#8c92f7',
    zIndex: 1,
  },
}))(Tabs);

export const PageTab = withStyles(theme => ({
  root: {
    backgroundColor: 'transparent',
    borderRadius: '20px',
    minHeight: '40px',
    minWidth: '140px',
    zIndex: 2,
  },
  selected: {
    color: 'white !important ',
    border: 'none',
    backgroundColor: '#transparent',
    '&$label': {
      fontSize: '15px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
  },
  textColorPrimary: {
    color: '#333333',
  },
}))(Tab);
