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
      isLoading: false,
      token: ''
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    fetch('https://apitest.star.com.au/api/rest/loyalty/v2/incentives', {
      headers: {
        'Accept': 'application/json;version=1.0.0',
        'loc': 'SYD',
        Authorization: 'Bearer ' + this.state.token,
      }
    },)
      .then(response => response.json())
      .then(data => this.setState({ data: data.incentivesList, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  handleChange = (event) => {
    this.setState({token: event.target.value});
  }

  createVoucher(item) {
    const content = (
          <div className="voucher" ref={this.contentRef} id={item.id}>
            <link rel="stylesheet" href="index.css"/>
            <img src="/starclub.png" alt="Logo" />
            <p className="price">{item.balanceDisplay}</p>
            <p className="name">{item.name}</p>
            <p className="price">{item.id}</p>
            <p className="centered">{item.expiryDisplay}</p>
            <p className="description">{item.description}</p>
            <p className="description">{item.disclaimer}</p>
          </div>
    );
    return content;
  };

  handlePrint = (voucherId) => {
    if (voucherId) {
      const iframe = document.getElementById("myiframe");
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.body.innerHTML = document.getElementById(voucherId).innerHTML;
      iframeDoc.head.innerHTML= '<style type="text/css">* {font-size: 10px; font-family: "Campton-Light", helvetica, arial, sans-serif;} .centered {text-align: center; align-content: center;} .price {text-align: center; text-transform: uppercase; font-size: 18px; font-weight: bold;} .name {text-align: center; text-transform: uppercase; font-size: 16px;}</style>';

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
      <div className="hidden-print">
        <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Input Text:
            <input type="text" value={this.state.token} onChange={this.handleChange}/>
          </label>
          <button type="submit">Submit</button>
        </form>
        </div>
        <div>
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
        <iframe id="myiframe" className="invisible"></iframe>
      </div>
    );
  }
}

export default App;
