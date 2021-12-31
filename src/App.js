import React from 'react';
import Total from './components/total/Total'
import History from './components/history/History'
import Operation from './components/operation/Operation';

class App extends React.Component {

    state = {
        transactions: JSON.parse(localStorage.getItem('calcMoney')) || [],
        description: '',
        amount: '',
        resultIncome: 0,
        resultExpenses: 0,
        totalBalance: 0,
    };

    componentWillMount() {
        this.calculate();
    }

    addAmount = e => {
        this.setState({amount: e.target.value});
    };

    addDescription = e => {
        this.setState({description: e.target.value});
    };

    addTransaction = add => {
        const transactions = [...this.state.transactions];
        transactions.push({
            id: `cmr${(+new Date()).toString(16)}`,
            description: this.state.description,
            amount: +this.state.amount,
            add,
        });

        this.setState({
            transactions,
            description: '',
            amount: '',
        }, this.calculate);

    };

    delTransaction = key => {
        const transactions = [...this.state.transactions];
        const newTransactions = transactions.filter(item => key !== item.id);
        this.setState({transactions: newTransactions}, this.calculate);
    };

    calculate() {
        const resultIncome = this.state.transactions
            .filter((item) => item.add)
            .reduce((result, item) => result + item.amount, 0);

        const resultExpenses = this.state.transactions
            .filter((item) => !item.add)
            .reduce((result, item) => result + item.amount, 0);

        const totalBalance = resultIncome - resultExpenses;

        this.setState({resultIncome, resultExpenses, totalBalance}, this.addStorage);

    };

    addStorage() {
        localStorage.setItem('calcMoney', JSON.stringify(this.state.transactions));
    }


    render () {
        return (
            <>
                <header>
                    <h1>Кошелек</h1>
                    <h2>Калькулятор расходов</h2>
                </header>
                <main>
                    <div className="container">
                        <Total resultIncome={this.state.resultIncome}
                            resultExpenses={this.state.resultExpenses}
                            totalBalance={this.state.totalBalance}/>
                        <History transactions={this.state.transactions}
                            delTransaction={this.delTransaction}/>
                        <Operation
                            addTransaction={this.addTransaction}
                            addAmount={this.addAmount}
                            addDescription={this.addDescription}
                            description={this.state.description}
                            amount={this.state.amount}
                        />
                    </div>
                </main>
            </>
        );
    }
}

export default App;
