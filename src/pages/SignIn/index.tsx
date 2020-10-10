import React, { useState } from 'react'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Container, Logo, Form, FormTittle } from './styles'
import { useAuth } from '../../hooks/auth'
const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const { signIn } = useAuth()
  return (
    <Container>
      <Logo>
        <img src={logoImg} alt="Minha carteira" />
        <h2>Minha Carteira</h2>
      </Logo>
      <Form
        onSubmit={() => {
          signIn(email, password)
        }}
      >
        <FormTittle>Entrar</FormTittle>
        <Input
          required
          type="email"
          placeholder="seu@email.com"
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          required
          type="password"
          placeholder="sua senha"
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit">Acessar</Button>
      </Form>
    </Container>
  )
}

export default SignIn
