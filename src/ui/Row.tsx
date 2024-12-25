import styled, { css } from 'styled-components';

interface RowProps {
  type?: 'horizontal' | 'vertical';
}

const Row = styled.div<RowProps>(({ type = 'vertical' }) => css`
  display: flex;
  ${type === 'horizontal' &&
    css`
      justify-content: space-between;
      align-items: center;
    `}
  ${type === 'vertical' &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`);

export default Row;