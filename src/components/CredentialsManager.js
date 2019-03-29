import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { selectSettings } from '../selectors';
import { loadSettings } from '../actions';
import { putData } from '../api';

import styled from '@emotion/styled';
import { InputNonFormik } from '../styled/Form';
import { H2, Edit } from '../styled/GlobalElements';
import { Button } from '../styled/Button';
import ShadowBox from '../styled/ShadowBox';

const InputContainer = styled.div`
  padding-bottom: 20px;
  font-size: 18px;
`;

export class CredentialsManager extends React.Component {
  state = {
    name: this.props.settings && this.props.settings.name,
    email: this.props.settings && this.props.settings.email,
    editingName: false,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.settings && nextProps.settings.name,
      email: nextProps.settings && nextProps.settings.email,
    });
  }

  startEditingName() {
    this.setState({ editingName: true });
  }

  onEnter = e => {
    if (e.key === 'Enter') {
      this.finishEditing();
    }
  };

  finishEditing() {
    if (this.state.name !== this.props.settings.name) {
      let settings = Object.assign({}, this.props.settings);
      settings.name = this.state.name;
      putData('/api/v1/settings/', settings)
        .then(response => {
          this.props.refreshSettings();
        })
        .catch(error => {
          this.props.refreshSettings();
        });
    }
    this.setState({ editingName: false });
  }

  render() {
    return (
      <ShadowBox>
        <H2>Passiv Credentials</H2>
        <div>
          {this.state.editingName ? (
            <InputContainer>
              <InputNonFormik
                value={this.state.name}
                onChange={event => {
                  this.setState({ name: event.target.value });
                }}
                onKeyPress={this.onEnter}
              />
              <Button onClick={() => this.finishEditing()}>Done</Button>
            </InputContainer>
          ) : (
            <InputContainer>
              <strong>Name:</strong> {this.state.name}
              <Edit onClick={() => this.startEditingName()}>
                <FontAwesomeIcon icon={faPen} />
                Edit
              </Edit>
            </InputContainer>
          )}
        </div>
        <div>
          <strong>Email:</strong> {this.state.email}
        </div>
      </ShadowBox>
    );
  }
}

const select = state => ({
  settings: selectSettings(state),
});
const actions = {
  refreshSettings: loadSettings,
};

export default connect(
  select,
  actions,
)(CredentialsManager);
