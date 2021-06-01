import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../styled/Button';
import { H1, H3, P } from '../../styled/GlobalElements';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

const Container = styled.div`
  > h1 {
    line-height: 57px;
  }
  button {
    margin-top: 10px;
    font-weight: 600;
    font-size: 20px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.25px;
    padding: 11px 27px;
  }
  iframe {
    padding: 30px 0px;
  }
`;

export const Description = styled(P)`
  font-size: 20px;
`;

type StepProps = {
  stepOne: boolean;
};

const Steps = styled.div`
  margin: 50px 0px;
`;

const Step = styled.div<StepProps>`
  margin-bottom: 28px;
  span {
    margin-right: 20px;
    background-color: ${(props) =>
      props.stepOne ? 'var(--brand-blue)' : 'white'};
    color: ${(props) => (props.stepOne ? 'white' : 'black')};
    padding: 2px 8px;
    border-radius: 3rem;
  }
  p {
    margin-left: 46px;
  }
`;

const ScalingIFrame = styled.iframe`
  width: 100%;
`;

const Intro = () => {
  const dispatch = useDispatch();
  return (
    <Container>
      <H1>Welcome to Passiv</H1>
      <Description>Let's get you set up!</Description>
      <Steps>
        {steps.map((step, index) => {
          return (
            <Step stepOne={index + 1 === 1}>
              <H3>
                <span>{index + 1}</span>
                {step.name}
              </H3>
              <P>{step.description}</P>
            </Step>
          );
        })}
      </Steps>
      <Description>That’s all! Start growing your nest egg now!</Description>
      <Button onClick={() => dispatch(push('/welcome?step=1'))}>
          Get Started
      </Button>

      <ScalingIFrame
        title="Passiv Basics"
        width="995"
        height="627"
        src="https://player.vimeo.com/video/547476267"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
      ></ScalingIFrame>
    </Container>
  );
};

export default Intro;

export const steps = [
  {
    name: 'Connect Brokerage',
    mobile: 'Connect',
    description:
      'It’s easy! You will be redirected to login to your brokerage of choice.',
  },
  {
    name: 'Choose Membership',
    mobile: 'Membership',
    description:
      'Starting at $0 for Life, choose the package that is right for you!',
  },
  {
    name: 'Organize Accounts',
    mobile: 'Organize',
    description:
      'Group your investment accounts by dragging and dropping them into portfolios.',
  },
  {
    name: 'Set Targets',
    mobile: 'Setup',
    description: 'Not sure how? That’s ok! We will guide you.',
  },
];
