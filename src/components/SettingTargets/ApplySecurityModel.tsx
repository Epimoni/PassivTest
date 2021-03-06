import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ErrorMessage, FieldArray, Formik } from 'formik';
import styled from '@emotion/styled';
import Grid from '../../styled/Grid';
import {
  selectCurrentGroup,
  selectCurrentGroupCash,
  selectCurrentGroupTotalEquityExcludedRemoved,
} from '../../selectors/groups';
import { BarsContainer, Bar, BarTarget, BarActual } from '../../styled/Target';
import { A, P } from '../../styled/GlobalElements';
import CashBar from '../PortfolioGroupTargets/CashBar';
import { Button } from '../../styled/Button';
import Dialog from '@reach/dialog';
import { H2Margin, ActionContainer } from '../ModelAssetClass/AssetClass';

const Symbol = styled.span`
  font-weight: 600;
  font-size: 22px;
`;
const Description = styled.span`
  font-size: 22px;
  margin-left: 20px;
`;
const Percent = styled.span`
  font-weight: 400;
  font-size: 33px;
`;
const TargetPercent = styled.input`
  font-weight: 600;
  font-size: 33px;
  margin-right: 50px;
  color: var(--brand-blue);
  width: 150px;
  text-align: center;
  background: white;
  border: 2px solid var(--brand-blue);
  padding: 5px;
  position: relative;
`;

const NoSecurities = styled(P)`
  text-align: center;
  font-weight: 600;
`;

const DeleteButton = styled.div`
  background-color: #535455;
  width: 40px;
  position: relative;
  top: -20px;
  right: 19px;
`;

type Props = {
  model: any;
};

const ApplySecurityModel = ({ model }: Props) => {
  const dispatch = useDispatch();
  const totalEquity = useSelector(selectCurrentGroupTotalEquityExcludedRemoved);
  const cash = useSelector(selectCurrentGroupCash);
  const [showDialog, setShowDialog] = useState(false);
  const [overWriteModel, setOverWriteModel] = useState(true);

  return (
    <>
      {model?.length < 1 ? (
        <NoSecurities>There are no securities in this model.</NoSecurities>
      ) : (
        <Formik
          initialValues={{ targets: model }}
          enableReinitialize
          validate={(values) => {
            const errors: any = {};
            const cashPercentage =
              100 -
              values.targets.reduce((total: number, target: any) => {
                if (!target.deleted && target.percent) {
                  return total + parseFloat(target.percent);
                }
                return total;
              }, 0);
            const roundedCashPercentage =
              Math.round(cashPercentage * 1000) / 1000;
            if (roundedCashPercentage < -0) {
              errors.cash = 'Too low';
            }
            return errors;
          }}
          onSubmit={(values, actions) => {
            return;
          }}
        >
          {(props) => (
            <div>
              <FieldArray
                name="targets"
                render={(arrayHelpers) => {
                  // calculate the desired cash percentage
                  const cashPercentage =
                    100 -
                    props.values.targets.reduce(
                      (total: number, target: any) => {
                        if (!target.deleted && target.percent) {
                          return total + parseFloat(target.percent);
                        }
                        return total;
                      },
                      0,
                    );

                  // calculate the actual cash percentage

                  const cashActualPercentage = (cash! / totalEquity) * 100;

                  var excludedAssetCount = props.values.targets.filter(
                    (target: any) => target.is_excluded === true,
                  ).length;

                  return (
                    <React.Fragment>
                      {props.values.targets.map((t: any, index: number) => {
                        if (
                          props.values.targets[index].actualPercentage ===
                          undefined
                        ) {
                          props.values.targets[index].actualPercentage = 0;
                        }
                        if (t.deleted) {
                          return null;
                        }
                        return (
                          <div key={t.key}>
                            <DeleteButton></DeleteButton>
                            <Grid columns="3fr 1fr">
                              <div>
                                <Symbol>
                                  {props.values.targets[index].symbol.symbol}
                                </Symbol>
                                <Description>
                                  {
                                    props.values.targets[index].symbol
                                      .description
                                  }
                                </Description>
                              </div>
                              <div>
                                <TargetPercent
                                  type="number"
                                  name={`targets.${index}.percent`}
                                  value={props.values.targets[index].percent}
                                  tabIndex={index + 1}
                                  onChange={(e) =>
                                    props.setFieldValue(
                                      `targets.${index}.percent` as 'targets',
                                      parseFloat(e.target.value),
                                    )
                                  }
                                />
                                <Percent>
                                  {props.values.targets[
                                    index
                                  ].actualPercentage?.toFixed(1)}
                                  %
                                </Percent>
                              </div>
                            </Grid>
                            <BarsContainer>
                              {!(
                                props.values.targets[index].actualPercentage ===
                                undefined
                              ) && (
                                <BarActual>
                                  <Bar
                                    style={{
                                      width: `${props.values.targets[
                                        index
                                      ].actualPercentage?.toFixed(0)}%`,
                                    }}
                                  >
                                    {' '}
                                  </Bar>
                                </BarActual>
                              )}
                              <BarTarget>
                                {props.values.targets[index].percent < 0 ? (
                                  <div
                                    style={{
                                      width: '100%',
                                      backgroundColor: 'red',
                                    }}
                                  >
                                    Warning: cash allocation cannot be negative!
                                  </div>
                                ) : (
                                  <Bar
                                    style={{
                                      width: `${props.values.targets[index].percent}%`,
                                      maxWidth: '100%',
                                    }}
                                  >
                                    {' '}
                                  </Bar>
                                )}
                              </BarTarget>
                            </BarsContainer>
                          </div>
                        );
                      })}
                      <div key="cashBar">
                        <CashBar
                          percentage={cashPercentage}
                          actualPercentage={cashActualPercentage}
                          edit={true}
                        />
                      </div>

                      <ErrorMessage name="targets" component="div" />
                      {props.dirty && (
                        <Button
                          type="submit"
                          onClick={() => {
                            true ? setShowDialog(true) : props.handleSubmit();
                          }}
                          disabled={!props.dirty}
                        >
                          SAVE CHANGES
                        </Button>
                      )}
                      <Dialog
                        isOpen={showDialog}
                        onDismiss={() => setShowDialog(false)}
                        aria-labelledby="dialog1Title"
                        aria-describedby="dialog1Desc"
                      >
                        <H2Margin>
                          This Model is being used by groups.
                          <span style={{ fontWeight: 'bold' }}>*</span>?
                        </H2Margin>
                        <ActionContainer>
                          <A
                            onClick={() => {
                              setShowDialog(false);
                              setOverWriteModel(true);
                              props.handleSubmit();
                            }}
                          >
                            Overwrite ""
                          </A>
                          <Button
                            onClick={() => {
                              setShowDialog(false);
                              setOverWriteModel(false);
                              props.handleSubmit();
                            }}
                          >
                            Create New Model
                          </Button>
                        </ActionContainer>
                      </Dialog>
                    </React.Fragment>
                  );
                }}
              />
            </div>
          )}
        </Formik>
      )}
    </>
  );
};

export default ApplySecurityModel;
