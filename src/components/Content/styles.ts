import styled from 'styled-components'

export const Container = styled.div`
  grid-area: CT;
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.primary};
  padding: 25px;

  height: calc(100vh - 70px);
  overflow-y: scroll;

  ::-wekbit-scrollbar {
    width: 10px;
  }

  ::-wekbit-scrollbar-thumb {
    background-gcolor: ${props => props.theme.colors.secondary};
    border-radius: 10px;
  }

  ::-wekbit-scrollbar-track {
    background-gcolor: ${props => props.theme.colors.tertiary};
  }
`
