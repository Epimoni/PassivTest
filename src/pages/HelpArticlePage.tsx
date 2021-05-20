import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectHelpArticleSlug, selectHelpArticles } from '../selectors';
import { H1, P } from '../styled/GlobalElements';
import ShadowBox from '../styled/ShadowBox';
import { push } from 'connected-react-router';
import styled from '@emotion/styled';

// COPY-PASTED FROM GLOBALELEMENTS.JS ...
// WOULD BE A WHOLE LOT NICER TO JUST USE THOSE COMPONENTS IN THE MARKDOWN RENDER
const Header = styled.div`
  text-align: center;
  max-width: 868px;
  margin: 0 auto;
  p {
    font-size: 22px;
  }
`;
const Back = styled.a`
  text-align: left;
  color: rgb(18, 80, 190);
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  display: block;
  margin-bottom: 20px;
`;
const MarkdownContainer = styled.div`
  font-size: 18px;
  max-width: 868px;
  margin: 0 auto;
  h1 {
    font-size: 42px;
    font-weight: 500;
    line-height: 2.17;
    letter-spacing: -1.5px;
    color: #2a2d34;
    text-align: center;
    @media (max-width: 900px) {
      line-height: 1.3;
      margin-bottom: 20px;
    }
  }
  h2 {
    font-size: 30px;
    font-weight: 600;
    text-align: left;
    color: #232225;
    display: block;
    margin: 45px 0 20px;
    line-height: 1.2;
  }
  h3 {
    font-size: 18px;
    font-weight: 900;
    line-height: 1.78;
    letter-spacing: 1px;
    color: #232225;
  }
  p {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    margin: 0 0 12px;
  }
  ul,
  ol {
    padding-top: 5px;
    margin-left: 20px;
    list-style-type: disc;
    li {
      margin-bottom: 10px;
      line-height: 1.3;
    }
  }
  a {
    font-size: 18px;
    text-align: left;
    color: #1250be;
    cursor: pointer;
  }
`;

const VideoContainer = styled.div`
  background: #2a2d34;
  display: inline-block;
  padding: 12px;
  left: 50%;
  position: relative;
  transform: translate(-50%);
  margin: 20px 0 40px;
`;

const HelpArticlePage = () => {
  const helpArticles = useSelector(selectHelpArticles);
  const helpArticleSlug = useSelector(selectHelpArticleSlug);
  const dispatch = useDispatch();

  let article = null;
  if (helpArticles !== undefined && helpArticles !== null) {
    let selectedArticle = helpArticles.find(
      (a: any) => a.slug === helpArticleSlug,
    );
    if (selectedArticle) {
      article = (
        <React.Fragment>
          <ShadowBox>
            <Header>
              <H1>{selectedArticle.title}</H1>
              <P>{selectedArticle.description}</P>
            </Header>
            {selectedArticle.video_url && (
              <VideoContainer>
                <iframe
                  title={selectedArticle.title}
                  src={selectedArticle.video_url}
                  width="640"
                  height="400"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </VideoContainer>
            )}
            <MarkdownContainer></MarkdownContainer>
          </ShadowBox>
        </React.Fragment>
      );
    } else {
      article = <H1>Not Found</H1>;
    }
  } else {
    article = <H1>Loading</H1>;
  }

  return (
    <React.Fragment>
      <Back onClick={() => dispatch(push('/help'))}>Back to Help</Back>
      {article}
    </React.Fragment>
  );
};

export default HelpArticlePage;
