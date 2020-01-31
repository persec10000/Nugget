import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@material-ui/icons';
import ColorPicker from 'material-ui-color-picker';
import 'rc-color-picker/assets/index.css';
import {
  Typography,
  Modal,
  Button,
  TextField,
  Switch,
  OutlinedInput,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
} from '@material-ui/core';
import './AddPipelineModal.scss';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

class AddPipelineModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pipName: '',
      benchmark: true,
      color: '#000',
      pipType: 'Internal',
      validate: true,
    };
  }

  handleAdd = () => {
    const { pipName, benchmark, color, pipType } = this.state;
    if (pipName === '') {
      this.setState({
        validate: false,
      });
      return;
    }
    this.setState({
      pipName: '',
      color: '#000',
      pipType: 'Internal',
      validate: true,
    });
    this.props.onAdd(pipName, benchmark, color, pipType);
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handleChangeSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
    if (name === 'pipName') {
      if (event.target.value !== '') {
        this.setState({ validate: true });
      }
    }
  };
  changeHandler(color) {
    this.setState({ color: color });
  }
  render() {
    const { show } = this.props;
    return (
      <Modal
        className="AddPipeline"
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={show}
        onClose={this.handleClose}
      >
        <div style={getModalStyle()} className={'paper'}>
          <div className="pipeline_header">
            <Typography variant="title" id="modal-title">
              Create New Pipeline
            </Typography>
            {/* <Button variant="contained" size="small" className="copy-link">
              Copy Link
              <Link />
            </Button> */}
          </div>

          <div className="pipeline_data">
            <div className="pipeline_name">
              <div className="data_label">Pipeline Name</div>
              <TextField
                id="pip_name"
                className="input_name"
                label="Input Name"
                variant="outlined"
                value={this.state.pipName}
                onChange={this.handleChange('pipName')}
                margin="normal"
              />
              {!this.state.validate && (
                <p>{this.context.t('must-input-pipeline-name')}</p>
              )}
            </div>
            <div className="pipeline_color">
              <div className="data_label">Color</div>
              <div
                className="color-picker"
                style={{ backgroundColor: this.state.color }}
              >
                <ColorPicker
                  name="color"
                  defaultValue="#000"
                  value={this.state.color}
                  onChange={color => {
                    this.changeHandler(color);
                  }}
                  TextFieldProps={{ disabled: 'true' }}
                />
              </div>
            </div>
          </div>
          <div className="pipeline_type">
            <div className="type_name">
              <div className="data_label">
                {this.context.t('l-type')}
                <Tooltip
                  disableFocusListener
                  disableTouchListener
                  title={this.context.t('challenge-experience')}
                  placement="right-end"
                >
                  <div className="hint-button" onClick={this.handleEmojiClick}>
                    <i className="far fa-question-circle fa-xs" />
                  </div>
                </Tooltip>
              </div>
              <FormControl variant="outlined" color="primary">
                <InputLabel
                  ref={ref => {
                    this.InputLabelRef = ref;
                  }}
                  htmlFor="type-customized-select"
                >
                  {this.context.t('l-type')}
                </InputLabel>
                <Select
                  className="type_select"
                  value={this.state.pipType}
                  onChange={this.handleChange('pipType')}
                  input={
                    <OutlinedInput
                      className="select-label-input"
                      labelWidth={40}
                      name="Type"
                      placeholder="Type"
                      id="type-customized-select"
                    />
                  }
                >
                  <MenuItem value={'Internal'}>
                    {this.context.t('internal')}
                  </MenuItem>
                  <MenuItem value={'External'}>
                    {this.context.t('external')}
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="form">
            <Button
              className="start_but"
              variant="contained"
              onClick={this.handleAdd}
              color="primary"
              size="large"
            >
              Done
            </Button>

            <Button
              className="cancel_but"
              variant="outlined"
              color="primary"
              size="large"
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

AddPipelineModal.contextTypes = {
  t: PropTypes.func,
};

AddPipelineModal.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool,
};

export default AddPipelineModal;
