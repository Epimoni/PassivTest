import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import { useDispatch } from 'react-redux';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { postData } from '../../../api';
import { loadGroup } from '../../../actions';
import {
  StyledComboboxInput,
  StyledComboboxList,
  StyledComboboxOption,
} from '../../ModelPortfolio/AssetClassSelector';

const StyledCombobox = styled(Combobox)`
  width: 494px;
  position: relative;
  z-index: 5;
  display: inline-block;
  input {
    width: 100%;
    padding: 10px;
  }
  @media (max-width: 900px) {
    width: 100%;
    margin-bottom: 20px;
    border-bottom: 1px solid #023ca2;
    padding-bottom: 5px;
    margin-top: 16px;
  }
`;

const StyledInput = styled(ComboboxInput)`
  width: 494px;
  border: 1px solid;
  padding: 11px 10px;
  @media (max-width: 900px) {
    width: auto;
    margin-bottom: 20px;
  }
`;

const StyledPopover = styled(ComboboxPopover)`
  z-index: 5;
`;

const StyledOption = styled(ComboboxOption)`
  margin: 5px;
`;

type Props = {
  value: any;
  groupId?: string;
  forModelSecurity?: boolean;
  clearInput?: number;
  onSelect: (symbol: any) => void;
};

export const useDebouncedEffect = (
  callback: any,
  delay: number,
  deps: any[] = [],
) => {
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [delay, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
};

const SymbolSelector = ({
  value,
  groupId,
  forModelSecurity,
  clearInput,
  onSelect,
}: Props) => {
  const dispatch = useDispatch();
  const [matchingSymbols, setMatchingSymbols] = useState<any[]>();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const loadOptions = () => {
    if (input.trim() === '') {
      return;
    }
    setLoading(true);
    let symbolsURL = '';
    if (groupId) {
      symbolsURL = `/api/v1/portfolioGroups/${groupId}/symbols`;
    } else {
      symbolsURL = '/api/v1/symbols';
    }
    postData(symbolsURL, {
      substring: input,
    })
      .then((response) => {
        setMatchingSymbols(response.data);
        setLoading(false);
      })
      .catch(() => {
        dispatch(loadGroup({ ids: [groupId] }));
        setLoading(false);
      });
  };

  useEffect(() => {
    setInput('');
  }, [clearInput]);

  const handleSelectByTicker = (ticker: string) => {
    const tickerSplit = ticker.split(/,(.+)/);
    let symbol = tickerSplit[0].toUpperCase().trim();
    let desc = tickerSplit[1].trim();
    if (!matchingSymbols) {
      return;
    }
    const matchedSymbol = matchingSymbols.find(
      (t) => symbol === t.symbol.trim() && desc === t.description.trim(),
    );
    if (matchedSymbol) {
      onSelect(matchedSymbol);
    }
  };

  useDebouncedEffect(
    () => {
      loadOptions();
    },
    500,
    [input],
  );

  const onChange = (event: any) => {
    setInput(event.target.value);
  };

  return (
    <StyledCombobox onSelect={handleSelectByTicker}>
      {forModelSecurity ? (
        <StyledComboboxInput
          value={input}
          onChange={onChange}
          onKeyPress={(event: any) =>
            event.key === 'Enter' && handleSelectByTicker(event.target.value)
          }
          placeholder="Search for security..."
        />
      ) : (
        <StyledInput
          value={value}
          onChange={onChange}
          onKeyPress={(event: any) =>
            event.key === 'Enter' && handleSelectByTicker(event.target.value)
          }
          placeholder="Search for security..."
        />
      )}
      {loading ? (
        <StyledPopover>
          <ComboboxList>
            <FontAwesomeIcon icon={faSpinner} spin />
          </ComboboxList>
        </StyledPopover>
      ) : (
        matchingSymbols &&
        matchingSymbols.length > 0 && (
          <StyledPopover>
            {forModelSecurity ? (
              <StyledComboboxList>
                {matchingSymbols.map((option: any, index) => {
                  const value = `${option.symbol}, ${option.description}`;
                  return (
                    <StyledComboboxOption key={index} value={value}>
                      <span>
                        {option.symbol} ({option.description})
                      </span>
                    </StyledComboboxOption>
                  );
                })}
              </StyledComboboxList>
            ) : (
              <ComboboxList>
                {matchingSymbols.map((option: any, index) => {
                  const value = `${option.symbol}, ${option.description}`;
                  return (
                    <StyledOption key={index} value={value}>
                      <span>
                        {option.symbol} ({option.description})
                      </span>
                    </StyledOption>
                  );
                })}
              </ComboboxList>
            )}
          </StyledPopover>
        )
      )}
    </StyledCombobox>
  );
};

export default SymbolSelector;
