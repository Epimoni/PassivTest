import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons';
import { deleteData, postData } from '../../api';
import { loadGroup } from '../../actions';
import {
  selectCurrentGroupId,
  selectCurrentGroupModelType,
  selectCurrentGroupPositionsNotInTargetOrExcluded,
  selectCurrentGroupSetupComplete,
} from '../../selectors/groups';
import { H2, P } from '../../styled/GlobalElements';
import { ToggleButton } from '../../styled/ToggleButton';
import { ToggleText } from './SettingsToggle';
import Grid from '../../styled/Grid';

const Container = styled.div`
  margin-bottom: 37px;
  border-bottom: 1px solid #2a2d34;
  h2 {
    margin-bottom: 25px;
  }
  ul {
    margin-bottom: 37px;
  }
`;
const Positions = styled(Grid)`
  margin-bottom: 10px;
  align-items: center;
`;

const Symbol = styled.span`
  font-size: 18px;
  font-weight: 600;
  margin: 0 50px;
`;

const Description = styled.span`
  font-size: 18px;
  @media (max-width: 900px) {
    display: none;
  }
`;

const NoExcludedAssets = styled(P)`
  margin: 20px 0;
`;

const ExcludedAssets = () => {
  const dispatch = useDispatch();
  const groupId = useSelector(selectCurrentGroupId);
  const currentGroupModelType = useSelector(selectCurrentGroupModelType);
  const positionsNotInTargetOrExcluded = useSelector(
    selectCurrentGroupPositionsNotInTargetOrExcluded,
  );
  const setupComplete = useSelector(selectCurrentGroupSetupComplete);

  const [loading, setLoading] = useState(false);

  const handleToggle = (position: any) => {
    setLoading(true);
    const positionId = position.symbol.id;
    if (currentGroupModelType === 1) {
      let excluded = positionsNotInTargetOrExcluded
        .map((position) => {
          if (position.excluded) {
            return position.symbol.id;
          }
          return false;
        })
        .filter((id) => typeof id === 'string');

      if (position.excluded) {
        excluded = excluded.filter((id) => id !== positionId);
      } else {
        excluded.push(positionId);
      }

      postData(
        `/api/v1/portfolioGroups/${groupId}/assetClassExcludeAssets`,
        excluded,
      ).then(() => {
        dispatch(loadGroup({ ids: [groupId] }));
        setLoading(false);
      });
    } else {
      if (position.excluded) {
        deleteData(
          `/api/v1/portfolioGroups/${groupId}/excludedassets/${positionId}`,
        ).then(() => {
          dispatch(loadGroup({ ids: [groupId] }));
          setLoading(false);
        });
      } else {
        postData(`/api/v1/portfolioGroups/${groupId}/excludedassets/`, {
          symbol: positionId,
        }).then(() => {
          dispatch(loadGroup({ ids: [groupId] }));
          setLoading(false);
        });
      }
    }
  };

  return (
    <Container>
      <H2>Excluded securities in this portfolio</H2>
      {!loading ? (
        positionsNotInTargetOrExcluded &&
        setupComplete &&
        positionsNotInTargetOrExcluded.length > 0 ? (
          <>
            {positionsNotInTargetOrExcluded.map((position) => {
              return (
                <Positions key={position.symbol.id} columns="90px 180px auto">
                  <ToggleButton
                    onClick={() => handleToggle(position)}
                    style={{ marginRight: '20px' }}
                  >
                    <FontAwesomeIcon
                      icon={position.excluded ? faToggleOn : faToggleOff}
                    />
                    <ToggleText>
                      {position.excluded ? 'Excluded' : 'Not Excluded'}
                    </ToggleText>
                  </ToggleButton>
                  <Symbol>{position.symbol.symbol}</Symbol>
                  <Description>{position.symbol.description}</Description>
                </Positions>
              );
            })}
          </>
        ) : (
          <NoExcludedAssets>No excluded assets</NoExcludedAssets>
        )
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
      )}
    </Container>
  );
};

export default ExcludedAssets;