import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Smartphones from './Smartphones';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          phones: [],
          screen: '',
          ram: '',
          storage: '',
          battery: '',
          brand: '',
          accuracy: 0.0,
          erro: '',
          isLoading: false,
        };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  

    render() {
      let aux, acc;

      if(this.state.accuracy != 0){
        acc = <p>Precisão: {this.state.accuracy*100}%</p>
      } else {
        acc = <p/>
      }

      if(this.state.isLoading) {
        aux = <img src='loading.gif'/>;
      } else {
        aux = <Smartphones phones={this.state.phones}/>
      }

      

      return (
        <div>
          <form onSubmit={this.handleSubmit}>

            <TextField
              label="Tamanho da tela (polegadas)"
              variant="standard"
              className="input"
              id="screen"
              onChange={this.handleChange}
              value={this.state.screen}
            />

            <TextField
              label="RAM (GB)"
              variant="standard"
              className="input"
              id="ram"
              onChange={this.handleChange}
              value={this.state.ram}
            />

            <TextField
              label="Armazenamento (GB)"
              variant="standard"
              className="input"
              id="storage"
              onChange={this.handleChange}
              value={this.state.storage}
            />

            <TextField
              label="Bateria (mAh)"
              variant="standard"
              className="input"
              id="battery"
              onChange={this.handleChange}
              value={this.state.battery}
            />

            <Button variant="contained" color="primary" type="submit" disableElevation>
              Go
            </Button>
            <p>{this.state.erro}</p>

            {this.state.brand}
            {acc}
            {aux}
            
          </form>
        </div>
      );
    }
  
    handleChange(e) {
      let key = e.nativeEvent.target.id
      this.setState({ [key]: e.target.value });
    }
  
    handleSubmit(e) {
      this.state.isLoading = true
      e.preventDefault();
      if (
        !this.state.screen.length ||
        !this.state.ram.length ||
        !this.state.storage.length ||
        !this.state.battery.length
      ) {
        this.setState({erro: "Campo vazio"})
        this.state.isLoading = false
        return;
      }

      axios.get(`https://smartphone-recommender-api.herokuapp.com/phones?screen=${this.state.screen}&ram=${this.state.ram}&storage=${this.state.storage}&battery=${this.state.battery}`)
        .then(res => {
          this.state.isLoading = false
          this.setState({
            phones: res.data.phones,
            brand: "Marca recomendada: " + res.data.brand,
            accuracy: res.data.accuracy
          });
          if(!res.data.phones.length) throw "Nenhum smartphone encontrado"
        })
        .catch(err => {
          this.setState({erro: err})
        })

      this.setState(state => ({
        erro: '',
      }));
    }
}