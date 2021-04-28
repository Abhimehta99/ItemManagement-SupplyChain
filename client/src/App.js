import React, { Component } from "react";
import ItemManager from "./contracts/ItemManager.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {loaded: false };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();

      this.itemManager= new this.web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[networkId] && ItemManager.networks[networkId].address,
      );
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({loaded: true});

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleSubmit = async () => {
    const { Id, CustName } = this.state;
    let check = await this.itemManager.methods.trackOrder(Id).call();
    if(check[3]==='1'){
      alert("Item with ID: "+Id+" already created");
    }
    else{
      let result = await this.itemManager.methods.createItem(CustName, Id).send({ from: this.accounts[0] });
      alert("Item Created  \r\nID: " +Id+ "\r\nCustomer Name: "+CustName);
    }
    };

  handlePaid = async () => {
    const {Id} = this.state;
    let check = await this.itemManager.methods.trackOrder(Id).call();
    if(check[0]==='0'){
      let result = await this.itemManager.methods.triggerPayment(Id).send({ from: this.accounts[0] });
      alert("Item with ID: " +Id+ " Paid");
      }
      else{
        alert("Item already paid")
      }
    };

  handleDelivery = async () => {
    const {Id} = this.state;
    let check = await this.itemManager.methods.trackOrder(Id).call();
    if(check[0]==='1'){
    let result = await this.itemManager.methods.triggerDelivery(Id).send({ from: this.accounts[0] });
    alert("Item with ID: " +Id+ " Delivered");
    }
    else if(check[0]==='0'){
      alert("Item not paid")
    }
    else if(check[0]==='2'){
      alert("Item already delivered")
    }
    };

  handleTrack = async () => {
    const {Id} = this.state;
    let result = await this.itemManager.methods.trackOrder(Id).call();
    let state="not set";
    if(result[0]==='0'){
      state="Created"
    }
    else if(result[0]==='1'){
      state="Paid"
    }
    else if(result[0]==='2'){
      state="Delivered"
    }
    alert("ID: "+Id+"\r\nCustomer Name: "+result[1]+"\r\nItem Status: "+state);
    };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
    [name]: value
    });
    }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="container">
        <h2>Pharmaceuticals</h2>
        <h2>Add Medicine</h2>
        Enter Product Id: <input type="number" name="Id" value={this.state._itemIndex} onChange={this.handleInputChange} /><br/><br/>
        Customer Name: <input type="text" name="CustName" value={this.state.CustName} onChange={this.handleInputChange} /><br/><br/>
        <button type="button" onClick={this.handleSubmit}>Create new Item</button>

        <h2>Update Medicine Status</h2>
        Enter Product Id: <input type="number" name="Id"/><br/><br/>
        <button type="button" onClick={this.handlePaid}>Paid</button>  
        <button type="button" onClick={this.handleDelivery}>Delivered</button>

        <h2>Track Medicine</h2>
        Enter Product Id: <input type="number" name="Id"/><br/><br/>
       <button type="button" onClick={this.handleTrack}>Track</button>
      </div>
        
    );
    }
}

export default App;
