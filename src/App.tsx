import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import Button from './ui/Button';
import Input from './ui/Input';
import Heading from './ui/Heading';
import Row from './ui/Row';

const StyledApp = styled.div`
  padding: 20px;
  min-height: 100vh;
`;
export default function App() {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <Row>
          <Row type='horizontal'>
            <Heading as='h1'>The wild Oasis</Heading>
            <div>
              <Heading as='h2'>Check it rrout</Heading>
              <Button>Check in</Button>
              <Button variation="danger" size="medium">Check out</Button>
            </div>
          </Row>
          <Row>
            <Heading as='h3'>Form</Heading>
            <form action=''>
              <Input type='number' placeholder='Search' />
              <Input type='number' placeholder='Search' />
            </form>
          </Row>
        </Row>
      </StyledApp>
    </>
  );
}
