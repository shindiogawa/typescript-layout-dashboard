import React from 'react'
import { ResponsiveContainer, BarChart, Bar, Cell, Tooltip } from 'recharts'
import {
  Container,
  SideLeft,
  SideRight,
  LegendContainer,
  Legend
} from './styles'
import formatCurrency from '../../utils/formatCurrency'
interface IBarChartProps {
  title: string
  data: {
    name: string
    amount: number
    percent: number
    color: string
  }[]
}
const BarChartBox: React.FC<IBarChartProps> = ({ title, data }) => {
  return (
    <Container>
      <SideLeft>
        <h2>{title}</h2>
        <LegendContainer>
          {data.map(item => (
            <Legend key={item.name} color={item.color}>
              <div>{item.percent}%</div>
              <span>{item.name}</span>
            </Legend>
          ))}
        </LegendContainer>
      </SideLeft>

      <SideRight>
        <ResponsiveContainer>
          <BarChart data={data}>
            <Bar dataKey="amount" name="Valor">
              {data.map(item => (
                <Cell key={item.name} cursor="pointer" fill={item.color} />
              ))}
            </Bar>
            <Tooltip
              cursor={{ fill: 'none' }}
              formatter={value => formatCurrency(Number(value))}
            />
          </BarChart>
        </ResponsiveContainer>
      </SideRight>
    </Container>
  )
}

export default BarChartBox
