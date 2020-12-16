import React from 'react';
import styled from '@emotion/styled';
import KrakenCredentialsManager from '../components/SettingsManager/KrakenCredentialsManager';
import GeneralManager from '../components/SettingsManager/GeneralManager';
import SubscriptionManager from '../components/SettingsManager/SubscriptionManager';
import ConnectionsManager from '../components/SettingsManager/ConnectionsManager';
import NotificationsManager from '../components/SettingsManager/NotificationsManager';
import AccountsManager from '../components/SettingsManager/AccountsManager';
import DemoNotes from '../components/DemoNotes';
import { selectIsDemo } from '../selectors';
import { useSelector } from 'react-redux';
import Tour from '../components/Tour/Tour';

export const Flex = styled.div`
  @media (min-width: 900px) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    > div {
      width: 49%;
      margin-bottom: 2%;
    }
    h2 {
      margin-bottom: 15px;
    }
  }
`;

const SettingsPage = () => {
  const isDemo = useSelector(selectIsDemo);
  return <KrakenCredentialsManager />;
};

export default SettingsPage;
