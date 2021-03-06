import React, { useState, useMemo, useCallback } from 'react'
import ContentHeader from '../../components/ContentHeader'
import SelectInput from '../../components/SelectInput'
import { Container, Content } from './styles'
import happyImg from '../../assets/happy.svg'
import sadImg from '../../assets/sad.svg'
import grinningImg from '../../assets/grinning.svg'
import thinkingImg from '../../assets/thinking.svg'
import winkingImg from '../../assets/winking-face.svg'
import expenses from '../../repositories/expenses'
import gains from '../../repositories/gains'
import listOfMonths from '../../utils/months'
import WalletBox from '../../components/WalletBox'
import MessageBox from '../../components/MessageBox'
import PieChart from '../../components/PieChart'
import HistoryBox from '../../components/HistoryBox'
import BarChartBox from '../../components/BarChartBox'

const Dashboard: React.FC = () => {
  const [monthSelected, setMonthSelected] = useState<number>(
    new Date().getMonth() + 1
  )

  const [yearSelected, setYearSelected] = useState<number>(
    new Date().getFullYear()
  )

  const years = useMemo(() => {
    const uniqueYears: number[] = []

    for (let i = 0; i < expenses.length; i++) {
      const date = new Date(expenses[i].date)
      const year = date.getFullYear()
      if (!uniqueYears.includes(year)) {
        uniqueYears.push(year)
      }
    }

    for (let i = 0; i < gains.length; i++) {
      const date = new Date(gains[i].date)
      const year = date.getFullYear()
      if (!uniqueYears.includes(year)) {
        uniqueYears.push(year)
      }
    }

    return uniqueYears.map(year => {
      return {
        value: year,
        label: year
      }
    })
  }, [])

  const months = useMemo(() => {
    return listOfMonths.map((month, index) => {
      return {
        value: index + 1,
        label: month
      }
    })
  }, [])

  const totalExpenses = useMemo(() => {
    let total = 0
    expenses.forEach(item => {
      const date = new Date(item.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      if (month === monthSelected && year === yearSelected) {
        try {
          total += Number(item.amount)
        } catch (error) {
          throw new Error('Invalid amount. Must be a number')
        }
      }
    })

    return total
  }, [monthSelected, yearSelected])

  const totalGains = useMemo(() => {
    let total = 0
    gains.forEach(item => {
      const date = new Date(item.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      if (month === monthSelected && year === yearSelected) {
        try {
          total += Number(item.amount)
        } catch (error) {
          throw new Error('Invalid amount. Must be a number')
        }
      }
    })

    return total
  }, [monthSelected, yearSelected])

  const totalBalance = useMemo(() => {
    return totalGains - totalExpenses
  }, [totalGains, totalExpenses])

  const message = useMemo(() => {
    if (totalBalance < 0) {
      return {
        title: 'Que triste!',
        description: 'Neste mês, você gastou mais que deveria',
        footerText:
          'Verifique seus gastos e tente cortar algumas coisas desnecessárias',
        icon: sadImg
      }
    } else if (totalGains === 0 && totalExpenses === 0) {
      return {
        title: 'Ops!',
        description: 'Neste mês, não há registros de entradas ou saídas',
        footerText:
          'Parece que você não fez nenhuma movimentação neste mes e ano específicos',
        icon: thinkingImg
      }
    } else if (totalBalance === 0) {
      return {
        title: 'Ufaa!',
        description: 'Neste mês, você gastou exatamente o que ganhou',
        footerText: 'Tenha cuidado e poupe mais no próximo mês',
        icon: grinningImg
      }
    } else {
      return {
        title: 'Muito bem!',
        description: 'Sua carteira está positiva!',
        footerText: 'Continue assim. Consideree investir o seu saldo',
        icon: happyImg
      }
    }
  }, [totalBalance, totalGains, totalExpenses])

  const relationExpensesVersusGains = useMemo(() => {
    const total = totalGains + totalExpenses

    let percentGains: number
    let percentExpenses: number
    if (total !== 0) {
      percentGains = (totalGains / total) * 100
      percentExpenses = (totalExpenses / total) * 100
    } else {
      percentGains = 0
      percentExpenses = 0
    }

    const data = [
      {
        name: 'Entradas',
        value: totalGains,
        percent: Number(percentGains.toFixed(1)),
        color: '#E44C4E'
      },
      {
        name: 'Saídas',
        value: totalExpenses,
        percent: Number(percentExpenses.toFixed(1)),
        color: '#F7931B'
      }
    ]

    return data
  }, [totalGains, totalExpenses])

  const isValueEmpty = useMemo(() => {
    let isEmpty = false
    relationExpensesVersusGains.forEach(item => {
      if (item.value === 0) {
        isEmpty = true
      } else {
        isEmpty = false
      }
    })
    return isEmpty
  }, [relationExpensesVersusGains])

  const historyData = useMemo(() => {
    return listOfMonths
      .map((_, month) => {
        let amountEntry = 0

        gains.forEach(gain => {
          const date = new Date(gain.date)
          const gainMonth = date.getMonth()
          const gainYear = date.getFullYear()

          if (gainMonth === month && gainYear === yearSelected) {
            try {
              amountEntry += Number(gain.amount)
            } catch {
              throw new Error('Amount entry is invalid. Must be a number')
            }
          }
        })

        let amountOutput = 0

        expenses.forEach(expense => {
          const date = new Date(expense.date)
          const expenseMonth = date.getMonth()
          const expenseYear = date.getFullYear()

          if (expenseMonth === month && expenseYear === yearSelected) {
            try {
              amountOutput += Number(expense.amount)
            } catch {
              throw new Error('Amount output is invalid. Must be a number')
            }
          }
        })

        return {
          monthNumber: month,
          month: listOfMonths[month].substr(0, 3),
          amountEntry,
          amountOutput
        }
      })
      .filter(item => {
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()

        return (
          (yearSelected === currentYear && item.monthNumber <= currentMonth) ||
          yearSelected < currentYear
        )
      })
  }, [yearSelected])

  const relationExpensesRecurrentVersusEventual = useMemo(() => {
    let amountRecurrent = 0
    let amountEventual = 0

    expenses
      .filter(expense => {
        const date = new Date(expense.date)
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        return month === monthSelected && year === yearSelected
      })
      .forEach(expense => {
        if (expense.frequency === 'recorrente') {
          return (amountRecurrent += Number(expense.amount))
        }

        if (expense.frequency === 'eventual') {
          return (amountEventual += Number(expense.amount))
        }
      })

    const total = amountEventual + amountRecurrent
    const percentRecurrent = Number(
      ((amountRecurrent / total) * 100).toFixed(1)
    )
    const percentEventual = Number(((amountEventual / total) * 100).toFixed(1))
    return [
      {
        name: 'Recorrentes',
        amount: amountRecurrent,
        percent: percentRecurrent || 0,
        color: '#F7831B'
      },
      {
        name: 'Eventuais',
        amount: amountEventual,
        percent: percentEventual || 0,
        color: '#E4404E'
      }
    ]
  }, [yearSelected, monthSelected])

  const relationGainsRecurrentVersusEventual = useMemo(() => {
    let amountRecurrent = 0
    let amountEventual = 0

    gains
      .filter(gain => {
        const date = new Date(gain.date)
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        return month === monthSelected && year === yearSelected
      })
      .forEach(gain => {
        if (gain.frequency === 'recorrente') {
          return (amountRecurrent += Number(gain.amount))
        }

        if (gain.frequency === 'eventual') {
          return (amountEventual += Number(gain.amount))
        }
      })

    const total = amountEventual + amountRecurrent
    const percentRecurrent = Number(
      ((amountRecurrent / total) * 100).toFixed(1)
    )

    const percentEventual = Number(((amountEventual / total) * 100).toFixed(1))

    return [
      {
        name: 'Recorrentes',
        amount: amountRecurrent,
        percent: percentRecurrent || 0,
        color: '#F7831B'
      },
      {
        name: 'Eventuais',
        amount: amountEventual,
        percent: percentEventual || 0,
        color: '#E4404E'
      }
    ]
  }, [yearSelected, monthSelected])

  const handleMonthSelected = useCallback((month: string) => {
    try {
      const parseMonth = Number(month)
      setMonthSelected(parseMonth)
    } catch (error) {
      throw new Error('Invalid month value. Is accepted 0 to 12')
    }
  }, [])

  const handleYearSelected = useCallback((year: string) => {
    try {
      const parseYear = Number(year)
      setYearSelected(parseYear)
    } catch (error) {
      throw new Error('Invalid year value. Is accepted integer numbers')
    }
  }, [])

  return (
    <Container>
      <ContentHeader title="Dashboard" lineColor="#F7931B">
        <SelectInput
          options={months}
          onChange={e => handleMonthSelected(e.target.value)}
          defaultValue={monthSelected}
        />

        <SelectInput
          options={years}
          onChange={e => handleYearSelected(e.target.value)}
          defaultValue={yearSelected}
        />
      </ContentHeader>
      <Content>
        <WalletBox
          title="saldo"
          color="#4E41F0"
          amount={totalBalance}
          footerLabel="atualizado com base nas entradas e saídas"
          icon="dolar"
        />
        <WalletBox
          title="entradas"
          color="#F7931B"
          amount={totalGains}
          footerLabel="atualizado com base nas entradas e saídas"
          icon="arrowUp"
        />
        <WalletBox
          title="saídas"
          color="#E44C4E"
          amount={totalExpenses}
          footerLabel="atualizado com base nas entradas e saídas"
          icon="arrowDown"
        />

        <MessageBox
          title={message.title}
          description={message.description}
          footerText={message.footerText}
          icon={message.icon}
        />

        {isValueEmpty ? (
          <MessageBox
            title="Que estranho"
            description="Neste mês não foi realizada nenhuma movimentação"
            footerText="Faça compras ou deposite dinheiro para a análise"
            icon={winkingImg}
          />
        ) : (
          <PieChart data={relationExpensesVersusGains} />
        )}

        <HistoryBox
          data={historyData}
          lineColorAmountEntry="#F7931B"
          lineColorAmountOutput="#E44C4E"
        ></HistoryBox>
        <BarChartBox
          title="Saídas"
          data={relationExpensesRecurrentVersusEventual}
        />
        <BarChartBox
          title="Entradas"
          data={relationGainsRecurrentVersusEventual}
        />
      </Content>
    </Container>
  )
}

export default Dashboard
