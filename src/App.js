import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.contentRef = React.createRef();
    this.createVoucher = this.createVoucher.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    
    this.state = {
      data: [],
      error: null,
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    fetch('https://apitest.star.com.au/api/rest/loyalty/v2/incentives', {
      headers: {
        'Accept': 'application/json;version=1.0.0',
        'loc': 'SYD',
        Authorization: 'Bearer ' + 'XMtZ4hYsH5De6UphcKHu5ZHKEB4TYS76nEZeubWNH1iy9tLndyqbfS',
      }
    },)
      .then(response => response.json())
      .then(data => this.setState({ data: data.incentivesList, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  createVoucher(item) {
    const content = (
        <div className="voucher" ref={this.contentRef} id={item.id}>
            <img src="/starclub.png" alt="Logo"/>
            <p className="price">{item.balanceDisplay}</p>
            <p className="centered">{item.name}</p>
            <p className="centered">{item.id}</p>
            <p className="centered">{item.expiryDisplay}</p>
            <p className="description">{item.description}</p>
            <p className="description">{item.disclaimer}</p>
        </div>
      );
      return content;
  };

  handlePrint= (voucherId) => {
    if (voucherId) {
      const iframe = document.getElementById("myiframe");
			const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.body.innerHTML = document.getElementById(voucherId).innerHTML;

			iframe.contentWindow.print();
    }
  }

  render() {
    const { data, error, isLoading } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className='App'>
        <div className="hidden-print">
          <h1>Vouchers</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Expire</th>
                <th>Print</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.expiryDisplay}</td>
                  <td>
                    <button className="hidden-print" onClick={() => this.handlePrint(item.id)}>Print</button>
                    {this.createVoucher(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <iframe id="myiframe" class="invisible"></iframe>
      </div>
    );
  }
}

export default App;
