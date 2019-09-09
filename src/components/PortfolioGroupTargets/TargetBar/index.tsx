import React from 'react';
import {
  faEyeSlash,
  faTimes,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { postData } from '../../../api';
import { useSelector, useDispatch } from 'react-redux';
import SymbolSelector from './SymbolSelector';
import Number from '../../Number';
import {
  BarsContainer,
  InputContainer,
  Symbol,
  TargetRow,
  Actual,
  Target,
  Bar,
  BarTarget,
  BarActual,
  Container,
  Close,
} from '../../../styled/Target';
import { loadGroup } from '../../../actions';
import { selectCurrentGroupId } from '../../../selectors/groups';
import { ToggleButton } from '../../../styled/ToggleButton';
import Tooltip from '../../Tooltip';
import styled from '@emotion/styled';

const Disabled = styled.div`
  opacity: 0.5;
`;

type Props = {
  target: any;
  children: JSX.Element;
  setSymbol: (symbol: any) => void;
  edit: boolean;
  onDelete: (key: string) => void;
  onExclude: (key: string) => void;
};

const TargetBar = ({
  target,
  children,
  setSymbol,
  edit,
  onDelete,
  onExclude,
}: Props) => {
  const groupId = useSelector(selectCurrentGroupId);
  const dispatch = useDispatch();

  const loadOptions = (substring: string, callback: (data: any) => void) => {
    postData(`/api/v1/portfolioGroups/${groupId}/symbols`, { substring })
      .then(response => {
        callback(response.data);
      })
      .catch(() => {
        dispatch(loadGroup({ ids: [groupId] }));
      });
  };

  const {
    id,
    key,
    is_excluded,
    is_supported,
    fullSymbol,
    actualPercentage,
    percent,
  } = target;

  let renderActualPercentage = null;
  if (actualPercentage === undefined) {
    renderActualPercentage = 0;
  } else {
    renderActualPercentage = actualPercentage;
  }

  return (
    <Container>
      {!is_excluded ? (
        <React.Fragment>
          <BarsContainer>
            <BarActual>
              {percent > 100 ? (
                <Bar style={{ width: '100%', backgroundColor: 'red' }}>
                  Warning: allocation cannot be over 100%
                </Bar>
              ) : percent < 0 ? (
                <Bar style={{ width: '100%', backgroundColor: 'red' }}>
                  Warning: allocation cannot be negative!
                </Bar>
              ) : (
                <Bar style={{ width: `${renderActualPercentage}%` }}> </Bar>
              )}
            </BarActual>
            {!(actualPercentage === undefined) && (
              <BarTarget>
                <Bar style={{ width: `${percent}%` }}> </Bar>
              </BarTarget>
            )}
          </BarsContainer>

          {edit && (
            <Close type="button" onClick={() => onDelete(key)}>
              <FontAwesomeIcon icon={faTimes} />{' '}
            </Close>
          )}
        </React.Fragment>
      ) : !is_excluded ? (
        <FontAwesomeIcon icon={faEyeSlash} />
      ) : (
        <Disabled>
          <FontAwesomeIcon icon={faEyeSlash} />
        </Disabled>
      )}
      <TargetRow>
        <Symbol>
          {!(typeof id == 'string') && !is_excluded ? (
            <SymbolSelector
              value={fullSymbol}
              onChange={setSymbol}
              loadOptions={loadOptions}
              getOptionLabel={(option: any) =>
                `${option.symbol} (${option.description})`
              }
              getOptionValue={(option: any) => option.id}
              placeholder="Search for security..."
            />
          ) : !is_excluded ? (
            fullSymbol.symbol
          ) : (
            <Disabled>{fullSymbol.symbol}</Disabled>
          )}
        </Symbol>
        {edit && (
          <React.Fragment>
            {!is_excluded && (
              <React.Fragment>
                <Target>
                  <InputContainer>{children}%</InputContainer>
                </Target>
                <Actual>
                  <Number
                    value={renderActualPercentage}
                    percentage
                    decimalPlaces={1}
                  />
                </Actual>
              </React.Fragment>
            )}

            <ToggleButton
              disabled={!is_supported}
              type="button"
              onClick={() => onExclude(key)}
            >
              <React.Fragment>
                <Tooltip
                  label={
                    is_supported
                      ? 'Exclude this asset from your portfolio calculations'
                      : 'This security is not supported by Passiv'
                  }
                >
                  {is_excluded ? (
                    <FontAwesomeIcon icon={faToggleOn} />
                  ) : (
                    <FontAwesomeIcon icon={faToggleOff} />
                  )}
                </Tooltip>
              </React.Fragment>
            </ToggleButton>
          </React.Fragment>
        )}
      </TargetRow>
    </Container>
  );
};

export default TargetBar;
