import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { Chart } from 'react-charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toDollarString } from '../Performance';
import { CustomTooltip } from '../PerformanceChart';

export const ChartBox = styled.div`
  position: relative;
  height: 120px;
  width: 100%;
`;

type Props = {
  data: any;
  axes: any;
  series: any;
  className: string;
  displayTotal: boolean;
};

export const DashboardChart: FunctionComponent<Props> = ({
  data,
  axes,
  series,
  className,
  displayTotal,
}) => {
  const tooltip = React.useMemo(
    () => ({
      render: ({ datum, primaryAxis, getStyle }: Props2) => {
        return (
          <CustomTooltip {...{ getStyle, primaryAxis, datum, displayTotal }} />
        );
      },
    }),
    [displayTotal],
  );

  if (data[0].data !== undefined) {
    return (
      <ChartBox className={className}>
        <Chart data={data} axes={axes} series={series} tooltip={tooltip} />
      </ChartBox>
    );
  } else {
    return (
      <ChartBox className={className}>
        <FontAwesomeIcon icon={faSpinner} spin />
      </ChartBox>
    );
  }
};

type Props2 = {
  getStyle: any;
  primaryAxis: any;
  datum: any;
  displayTotal: boolean;
};

const dtfMonth = new Intl.DateTimeFormat('en', { month: 'short' });

const formatDate = (date: Date) => {
  if (typeof date !== 'object') {
    return date;
  } else {
    return (
      dtfMonth.format(date) + ' ' + date.getDate() + ', ' + date.getFullYear()
    );
  }
};

const toDollarStringWithSigns = (total: any) => {
  const dollarString = toDollarString(total);
  return dollarString[0] !== '-'
    ? '$' + dollarString
    : '-$' + dollarString.slice(1);
};

export default DashboardChart;
