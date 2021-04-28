import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Grid from '../../styled/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretUp,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { deleteData, postData } from '../../api';
import { loadGroupInfo } from '../../actions';
import {
  selectCurrentGroupId,
  selectCurrentGroupInfoLoading,
  selectCurrentGroupModelType,
  selectCurrentGroupPositionsNotInTargetOrExcluded,
  selectCurrentGroupSetupComplete,
} from '../../selectors/groups';
import { A, H2, P } from '../../styled/GlobalElements';
import { Description } from '../ModelPortfolio/Prioritization/Prioritization';
import { CheckBox } from '../../styled/CheckBox';

const Container = styled.div`
  margin-bottom: 37px;
  h2 {
    font-size: 28px;
    margin-bottom: 25px;
  }
  ul {
    margin-bottom: 37px;
  }
`;
const Positions = styled(Grid)`
  margin-bottom: 20px;
  align-items: center;
  @media (max-width: 900px) {
    display: grid;
    grid-gap: 20px;
  }
`;
type SymbolType = {
  disabled: boolean;
};
const Symbol = styled.span<SymbolType>`
  font-size: 18px;
  font-weight: 600;
  margin: 0 50px;
  margin: 15px 0px 0px 40px;
  color: ${(props) => (props.disabled ? 'grey' : 'black')};
  @media (max-width: 900px) {
    margin-left: 30px;
  }
`;

const Name = styled.span<SymbolType>`
  font-size: 18px;
  margin: 15px 0px 0px 0px;
  color: ${(props) => (props.disabled ? 'grey' : 'black')};
  @media (max-width: 900px) {
    display: none;
  }
`;

const NoExcludedAssets = styled(P)`
  margin-top: 20px;
  text-align: center;
`;

const NumberOfExcludedAssets = styled(P)`
  margin-top: 20px;
  background-color: #f1f1f1;
  max-width: max-content;
  padding: 20px;
  text-align: center;
`;

const ExcludedAssets = () => {
  const dispatch = useDispatch();
  const groupId = useSelector(selectCurrentGroupId);
  const [loading, setLoading] = useState(false);
  const currentGroupModelType = useSelector(selectCurrentGroupModelType);
  const positionsNotInTargetOrExcluded = useSelector(
    selectCurrentGroupPositionsNotInTargetOrExcluded,
  );
  const groupInfoLoading = useSelector(selectCurrentGroupInfoLoading);
  const setupComplete = useSelector(selectCurrentGroupSetupComplete);
  const [showAssets, setShowAssets] = useState(false);

  useEffect(() => {
    setLoading(groupInfoLoading);
  }, [groupInfoLoading]);

  const excludedAssetsCount = positionsNotInTargetOrExcluded.reduce(
    (acc, val) => {
      if (val.excluded) {
        acc++;
      }
      return acc;
    },
    0,
  );

  const handleCheckBoxClick = (position: any) => {
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
        dispatch(loadGroupInfo());
      });
    } else {
      if (position.excluded) {
        deleteData(
          `/api/v1/portfolioGroups/${groupId}/excludedassets/${positionId}`,
        ).then(() => {
          dispatch(loadGroupInfo());
        });
      } else {
        postData(`/api/v1/portfolioGroups/${groupId}/excludedassets/`, {
          symbol: positionId,
        }).then(() => {
          dispatch(loadGroupInfo());
        });
      }
    }
  };

  return (
    <Container>
      <H2>Asset Exclusions</H2>
      <Description>
        The assets that are held in your portfolio but are not part of your
        model. If you do not want them to be accounted in Passiv’s calculations,
        you can exclude them by checking the boxes. Otherwise, Passiv will
        attempt to sell them, if sell is enabled.
      </Description>
      {setupComplete && positionsNotInTargetOrExcluded.length > 0 && (
        <NumberOfExcludedAssets>
          There are{' '}
          <span style={{ fontWeight: 800, textDecoration: 'underline' }}>
            {positionsNotInTargetOrExcluded?.length}
          </span>{' '}
          assets not part of your portfolio ({excludedAssetsCount} excluded).
          <A
            onClick={() => setShowAssets(!showAssets)}
            style={{ marginLeft: '10px', fontWeight: 600 }}
          >
            {showAssets ? 'Hide' : 'Show'}{' '}
            {showAssets ? (
              <FontAwesomeIcon icon={faCaretUp} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} size="lg" />
            )}
          </A>
        </NumberOfExcludedAssets>
      )}
      {!loading ? (
        positionsNotInTargetOrExcluded &&
        setupComplete &&
        positionsNotInTargetOrExcluded.length > 0 ? (
          showAssets && (
            <>
              {positionsNotInTargetOrExcluded.map((position) => {
                return (
                  <Positions key={position.symbol.id} columns="10px 180px auto">
                    <CheckBox>
                      <label className="container">
                        <input
                          type="checkbox"
                          checked={position.excluded}
                          onChange={() => handleCheckBoxClick(position)}
                          disabled={!position.quotable}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </CheckBox>

                    <Symbol disabled={!position.quotable}>
                      {position.symbol.symbol}
                    </Symbol>
                    <Name disabled={!position.quotable}>
                      {position.symbol.description}
                    </Name>
                  </Positions>
                );
              })}
            </>
          )
        ) : (
          <NoExcludedAssets>There are no excluded assets.</NoExcludedAssets>
        )
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin size="lg" />
      )}
    </Container>
  );
};

export default ExcludedAssets;
