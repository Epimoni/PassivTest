import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { AccountHoldings } from './AccountHoldings';
import PortfolioGroupMeta from './PortfolioGroupDetails/PortfolioGroupMetadata';
import PortfolioGroupTotal from './PortfolioGroupDetails/PortfolioGroupTotal';
import PortfolioGroupCash from './PortfolioGroupDetails/PortfolioGroupCash';
import AccountName from './PortfolioGroupDetails/AccountName';
import {
  selectCurrentAccountHoldings,
  selectCurrentGroupInfoError,
  selectPreferredCurrency,
  selectCurrentAccountTotalEquity,
} from '../selectors/groups';
import { selectCurrentAccountBalances } from '../selectors/accounts';

export const Container3Column = styled.div`
  @media (min-width: 900px) {
    display: flex;
    justify-content: space-between;
    > div {
      width: 32%;
      margin-right: 30px;
    }
    > div:last-of-type {
      margin-right: 0;
    }
  }
`;

export const AccountTab = () => {
  const account = useSelector(selectCurrentAccountHoldings);
  const balances = useSelector(selectCurrentAccountBalances);
  const equity = useSelector(selectCurrentAccountTotalEquity);
  const error = useSelector(selectCurrentGroupInfoError);
  const preferredCurrency = useSelector(selectPreferredCurrency);

  if (!account) {
    return <FontAwesomeIcon icon={faSpinner} spin />;
  }

  return (
    <div>
      <AccountName name={account.name} />

      <Container3Column>
        <PortfolioGroupMeta account={account} />
        <PortfolioGroupCash balances={balances} />
        <PortfolioGroupTotal
          equity={equity}
          error={error}
          currency={preferredCurrency}
        />
      </Container3Column>
      <AccountHoldings />
    </div>
  );
};

export default AccountTab;