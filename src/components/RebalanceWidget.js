import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faClock } from '@fortawesome/free-solid-svg-icons';
import { push } from 'connected-react-router';
import { loadGroup } from '../actions';
import { getData, postData } from '../api';
import {
  selectSymbols,
  selectBrokerages,
  selectDashboardGroups,
  selectIsFree,
} from '../selectors';
import { Button } from '../styled/Button';
import styled from '@emotion/styled';
import { H2, P, A, Table } from '../styled/GlobalElements';
import Number from './Number';
import ConnectionUpdate from '../components/ConnectionUpdate';

const SummaryContainer = styled.div`
  text-align: left;
  margin-top: 25px;
  button {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    border-radius: 2px;
  }
`;

const OrderContainer = styled.div`
  position: relative;
  border-radius: 4px;
  padding: 25px;
  margin-top: 30px;
  background: #f5f9ff;
  color: var(--brand-grey);
  h2 {
    margin-bottom: 20px;
  }
`;

const ConfirmContainer = styled.div`
  text-align: left;
  a {
    margin-left: 20px;
    font-weight: 700;
    text-decoration: underline;
  }
`;

const MetaHorizontal = styled.div`
  text-align: left;
  span {
    font-weight: 600;
    margin-bottom: 8px;
    display: inline-block;
    margin-right: 6px;
    text-align: left;
  }
`;

const UpgradeText = styled.span`
  font-weight: 600;
  color: #2a2e33;
  font-size: 22px;
  button {
    margin-left: 20px;
  }
`;

export class RebalanceWidget extends Component {
  state = {
    validatingOrders: false,
    placingOrders: false,
    orderSummary: null,
    orderResults: null,
    error: null,
  };

  validateOrders = () => {
    this.setState({ validatingOrders: true });
    getData(
      `/api/v1/portfolioGroups/${this.props.groupId}/calculatedtrades/${
        this.props.trades.id
      }/impact`,
    )
      .then(response => {
        this.setState({
          validatingOrders: false,
          orderSummary: response.data,
          error: null,
        });
      })
      .catch(error => {
        this.setState({
          validatingOrders: false,
          orderSummary: null,
          error: error.response.data,
        });
      });
  };

  confirmOrders = () => {
    this.setState({ placingOrders: true });
    postData(
      `/api/v1/portfolioGroups/${this.props.groupId}/calculatedtrades/${
        this.props.trades.id
      }/placeOrders`,
    )
      .then(response => {
        this.setState({
          placingOrders: false,
          orderResults: response.data,
          error: null,
        });

        // reload group data following a successful order
        // this.props.reloadGroup({ ids: [this.props.groupId] });
      })
      .catch(error => {
        this.setState({
          placingOrders: false,
          orderResults: null,
          error: error.response.data,
        });
      });
  };

  cancelOrders = () => {
    this.setState({
      placingOrders: false,
      validatingOrders: false,
      orderSummary: null,
      orderResults: null,
      error: null,
    });
  };

  closeWidget = () => {
    this.setState({
      placingOrders: false,
      validatingOrders: false,
      orderSummary: null,
      orderResults: null,
      error: null,
    });
    // reload group data following a successful order
    this.props.reloadGroup({ ids: [this.props.groupId] });
  };

  sumEstimatedCommissions = () => {
    return this.state.orderSummary.reduce((acc, result) => {
      return acc + result.estimated_commissions;
    }, 0);
  };

  sumRemainingCash = () => {
    return this.state.orderSummary.reduce((acc, result) => {
      return acc + result.remaining_cash;
    }, 0);
  };

  // getQuestradeBrokerage() {
  //   return this.props.brokerages.find(b => b.name === 'Questrade');
  // }
  //
  // getQuestradeId() {
  //   return this.getQuestradeBrokerage().id;
  // }
  //
  // getQuestradeTradeType() {
  //   return this.getQuestradeBrokerage().authorization_types.find(t => t.type === 'trade').type;
  // }

  getReadBrokerageAuthorization = () => {
    let group = this.props.groups.find(g => g.id === this.props.groupId);
    return group.brokerage_authorizations.find(a => a.type === 'read');
  };

  render() {
    const { isFree, push } = this.props;
    let error = null;
    if (this.state.error) {
      switch (this.state.error.code) {
        case '1014':
          error = (
            <OrderContainer>
              <H2>Order cannot be Processed</H2>
              <P>
                This portfolio group does not have trade permissions and
                therefore can't be used to place orders.
              </P>
              <P>Connect with full trade permissions:</P>
              <ConnectionUpdate
                authorization={this.getReadBrokerageAuthorization()}
                type="trade"
                hideTitle={true}
              />
            </OrderContainer>
          );
          break;
        case '0000':
          error = (
            <OrderContainer>
              <H2>Order cannot be Processed</H2>
              <P>
                Oops, you've encountered a bug! Please try again later or{' '}
                <Link to="/app/help">contact support</Link> if this persists.
              </P>
            </OrderContainer>
          );
          break;
        case '1019':
          error = (
            <OrderContainer>
              <H2>
                <FontAwesomeIcon icon={faClock} /> Market is closed
              </H2>
              <P>
                {' '}
                Passiv is unable to proceed with the orders because the stock
                market is currently closed. If the stock market is open, please{' '}
                <Link to="/app/help">contact support</Link>. You can also also
                make trades manually on your brokerage's platform.
              </P>
            </OrderContainer>
          );
          break;
        default:
          error = (
            <OrderContainer>
              <H2>Order cannot be Processed</H2>
              <P>
                Oops, you've encountered a bug! Please try again later or{' '}
                <Link to="/app/help">contact support</Link> if this persists.
              </P>
            </OrderContainer>
          );
          break;
      }
    }

    let orderValidation = (
      <Button onClick={this.validateOrders}>Validate</Button>
    );
    if (isFree) {
      orderValidation = (
        <UpgradeText>
          Upgrade your account to let us execute trades for you!{' '}
          <Button onClick={() => push('/app/settings')}>Upgrade</Button>
        </UpgradeText>
      );
    } else if (this.state.error) {
      orderValidation = error;
    } else {
      if (this.state.validatingOrders) {
        orderValidation = (
          <OrderContainer>
            <P>
              Validating orders ...&nbsp;
              <FontAwesomeIcon icon={faSpinner} spin />
            </P>
          </OrderContainer>
        );
      } else if (this.state.orderSummary) {
        orderValidation = this.state.orderResults ? (
          <OrderContainer>
            <H2>Order Results</H2>
            <div>
              <Table>
                <div>Action</div>
                <div>Symbol</div>
                <div>Units</div>
                <div>Status</div>
              </Table>
              {this.state.orderResults.map(results => {
                return (
                  <Table key={results.trade}>
                    <div>{results.action}</div>
                    <div>{results.universal_symbol.symbol}</div>
                    <div>{results.filled_units}</div>
                    <div>{results.state}</div>
                  </Table>
                );
              })}
            </div>
            <div>
              <ConfirmContainer>
                <Button
                  onClick={() => {
                    this.closeWidget();
                  }}
                >
                  Okay!
                </Button>
              </ConfirmContainer>
            </div>
          </OrderContainer>
        ) : this.state.orderSummary ? (
          <OrderContainer>
            <H2>Order Summary</H2>
            <P>
              The trades listed above will be placed as market orders on
              Questrade.
            </P>
            <div>
              <MetaHorizontal>
                <span>Estimated commissions:</span>{' '}
                <Number value={this.sumEstimatedCommissions()} currency />
              </MetaHorizontal>
              <MetaHorizontal>
                <span>Remaining cash:</span>{' '}
                <Number value={this.sumRemainingCash()} currency />
              </MetaHorizontal>
            </div>
            <P>
              Market orders may result in the price paid or received to be
              different from the last price quoted before the order was placed.{' '}
              <A
                href="https://questrade-support.secure.force.com/mylearning/view/h/Investing/Market+orders"
                target="_blank"
              >
                Learn more
              </A>
            </P>
            <P>
              <A
                href="https://www.questrade.com/pricing/self-directed-investing/fees#exchange-ecn-fees"
                target="_blank"
              >
                Exchange and ECN fees
              </A>
              ,{' '}
              <A
                href="https://www.questrade.com/pricing/self-directed-investing/fees#exchange-ecn-fees"
                target="_blank"
              >
                SEC fees
              </A>{' '}
              and for ADRs{' '}
              <A
                href="https://www.questrade.com/pricing/self-directed-investing/fees#exchange-ecn-fees"
                target="_blank"
              >
                annual custody
              </A>{' '}
              fees may apply. Commissions may vary if your order is filled over
              multiple days. Borrow fees may apply if you hold a short
              investment overnight.
            </P>
            {this.state.placingOrders ? (
              <div>
                <p>
                  Placing orders ... <FontAwesomeIcon icon={faSpinner} spin />
                </p>
              </div>
            ) : (
              <div>
                <ConfirmContainer>
                  <Button
                    onClick={() => {
                      this.confirmOrders();
                    }}
                  >
                    Confirm
                  </Button>
                  <A
                    onClick={() => {
                      this.cancelOrders();
                    }}
                  >
                    Cancel
                  </A>
                </ConfirmContainer>
              </div>
            )}
          </OrderContainer>
        ) : (
          <div>
            <P>There is a problem with your orders: {this.state.error}</P>
          </div>
        );
      }
    }

    return <SummaryContainer>{orderValidation}</SummaryContainer>;
  }
}

const actions = {
  reloadGroup: loadGroup,
  push: push,
};

const select = state => ({
  symbols: selectSymbols(state),
  brokerages: selectBrokerages(state),
  groups: selectDashboardGroups(state),
  isFree: selectIsFree(state),
});

export default connect(
  select,
  actions,
)(RebalanceWidget);
