import React from 'react';
import { useSelector } from 'react-redux';
import { selectPlans } from '../selectors';
import { selectShowQuestradeOffer } from '../selectors/subscription';
import { H3, P, UL, A } from '../styled/GlobalElements';
import Number from './Number';
import styled from '@emotion/styled';

const SmallList = styled(UL)`
  list-style-type: disc;
  width: 80%;
  padding-top: 15px;
  margin: auto;
  color: #fff;
  line-height: 1.3em;
`;

const H3White = styled(H3)`
  color: #fff;
`;

const AWhite = styled(A)`
  color: #fff;
`;

const SubscriptionPlans = () => {
  const plans = useSelector(selectPlans);
  const showQuestradeOffer = useSelector(selectShowQuestradeOffer);
  if (!plans || !plans[0]) {
    return null;
  }
  return (
    <React.Fragment>
      {showQuestradeOffer ? (
        <React.Fragment>
          <P>
            You're eligible for a <strong>free</strong> upgrade to{' '}
            <strong>Passiv Elite</strong>! You can access{' '}
            <AWhite href="/pricing" target="_blank" rel="noopener noreferrer">
              all features
            </AWhite>{' '}
            just by upgrading now.
          </P>
          <P>
            <strong>Questrade</strong> offers Passiv Elite as a free tool for
            Questrade customers. It's available as long as you keep your
            Questrade account connected to Passiv.
          </P>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <H3White> Get Passiv Elite </H3White>
          <P>
            Unlock{' '}
            <AWhite href="/pricing" target="_blank" rel="noopener noreferrer">
              all features
            </AWhite>{' '}
            for just{' '}
            <strong>
              <Number
                value={parseInt(plans[0].amount)}
                decimalPlaces={0}
                currency={'USD'}
              />
              /year
            </strong>{' '}
            (plus tax)
          </P>
          <SmallList>
            <li>100% money-back guarantee if you are not satisfied.</li>
            <li>
              Your subscription will automatically renew and you can cancel at
              any time.
            </li>
          </SmallList>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default SubscriptionPlans;
