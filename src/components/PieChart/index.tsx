import React from 'react'
import {
  PieChart as PieClassChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts'
import {
  Container,
  SideLeft,
  Legend,
  LegendContainer,
  SideRight
} from './styles'

interface IPieChartProps {
  data: {
    name: string
    value: number
    percent: number
    color: string
  }[]
}

const PieChart: React.FC<IPieChartProps> = ({ data }) => (
  <Container>
    <SideLeft>
      <h2>Relação</h2>
      <LegendContainer>
        {data.map(item => (
          <Legend key={item.name} color={item.color}>
            <div>{item.percent}</div>
            <span>{item.name}</span>
          </Legend>
        ))}
      </LegendContainer>
    </SideLeft>
    <SideRight>
      <ResponsiveContainer>
        <PieClassChart>
          <Pie data={data} dataKey="percent">
            {data.map(item => (
              <Cell key={item.name} fill={item.color} />
            ))}
          </Pie>
        </PieClassChart>
      </ResponsiveContainer>
    </SideRight>
  </Container>
)

export default PieChart
