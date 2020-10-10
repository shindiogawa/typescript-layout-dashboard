import React from 'react'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Container, Logo, Form, FormTittle } from './styles'

const SignIn: React.FC = () => {
  return (
    <Container>
      <Logo>
        <img src={logoImg} alt="Minha carteira" />
        <h2>Minha Carteira</h2>
      </Logo>
      <Form onSubmit={() => {}}>
        <FormTittle>Entrar</FormTittle>
        <Input required type="email" placeholder="seu@email.com" />
        <Input required type="password" placeholder="sua senha" />
        <Button type="submit">Acessar</Button>
      </Form>
    </Container>
  )
}

export default SignIn
