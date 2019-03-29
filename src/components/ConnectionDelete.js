import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { initialLoad, loadBrokerages } from '../actions';
import { deleteData } from '../api';
import { DeleteButton } from '../styled/DeleteButton';
import { Button } from '../styled/Button';
import { H3 } from '../styled/GlobalElements';

const ConnectionsDelete = styled.div`
  text-align: right;
`;

export const ConnectionDelete = ({
  authorization,
  reloadAllState,
  reloadBrokerages,
}) => {
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = authorization => {
    deleteData(`/api/v1/authorizations/${authorization.id}`)
      .then(response => {
        setDeleting(false);
        reloadBrokerages();
        reloadAllState();
      })
      .catch(error => {
        setDeleting(false);
        reloadBrokerages();
        reloadAllState();
      });
  };

  return (
    <ConnectionsDelete>
      <H3>Delete Connection</H3>
      {deleting ? (
        <React.Fragment>
          <p>
            Are you sure you want to delete this connection and all its
            accounts?
          </p>
          <DeleteButton
            onClick={() => {
              setDeleting(false);
            }}
          >
            Cancel
          </DeleteButton>
          <Button
            onClick={() => {
              confirmDelete(authorization);
            }}
          >
            Yes
          </Button>
        </React.Fragment>
      ) : (
        <DeleteButton
          onClick={() => {
            setDeleting(true);
          }}
        >
          Delete
        </DeleteButton>
      )}
    </ConnectionsDelete>
  );
};

const actions = {
  reloadAllState: initialLoad,
  reloadBrokerages: loadBrokerages,
};

export default connect(
  null,
  actions,
)(ConnectionDelete);
