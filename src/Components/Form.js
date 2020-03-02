import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Smartphones from './Smartphones';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import './Smartphones.css';

export default class Form extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          phones: [],
          info: {"screens": [], "rams": [], "mems": [], "batteries": []},
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
  
    componentDidMount() {
      axios.get("https://smartphone-recommender-api.herokuapp.com/info")
        .then(res => {
          console.log(res.data)

          let min = res.data.batteries[0] - res.data.batteries[0] % 500
          let max = res.data.batteries[res.data.batteries.length -1]
          let batteries = []

          while(min <= max) {
            batteries.push(min)
            min += 500
          }

          res.data.batteries = batteries

          this.setState({
            info: res.data,
          });
        })
        .catch(err => {
          this.setState({erro: err})
        })
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
          <form>
            <div>
              <TextField
                label="Tamanho da tela (polegadas)"
                select
                className="input"
                id="screen"
                onChange={this.handleChange}
                value={this.state.screen}
                variant="outlined"
                helperText="Por favor seleciona o tamanho da tela"
              >
                {this.state.info.screens.map(value => (
                  <MenuItem key={value} id="screen" value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="RAM (GB)"
                select
                className="input"
                id="ram"
                onChange={this.handleChange}
                value={this.state.ram}
                variant="outlined"
                helperText="Por favor seleciona a RAM"
              >
                {this.state.info.rams.map(value => (
                  <MenuItem key={value} id="ram" value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Armazenamento (GB)"
                select
                className="input"
                id="storage"
                onChange={this.handleChange}
                value={this.state.storage}
                variant="outlined"
                helperText="Por favor seleciona o armazenamento"
              >
                {this.state.info.mems.map(value => (
                  <MenuItem key={value} id="storage" value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Bateria (mAh)"
                select
                className="input"
                id="battery"
                onChange={this.handleChange}
                value={this.state.battery}
                variant="outlined"
                helperText="Por favor selecione a bateria"
              >
                {this.state.info.batteries.map(value => (
                  <MenuItem key={value} id="battery" value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              
              <Button variant="contained" color="primary" className="button" onClick={this.handleSubmit} disableElevation>
                Go
              </Button>
            </div>
            
          </form>
          <p>{this.state.erro}</p>

          {this.state.brand}
          {acc}
          {aux}
        </div>
      );
    }
  
    async handleChange(e) {
      let key = await e.nativeEvent.target.id
      this.setState({ [key]: e.target.value });
    }
  
    handleSubmit(e) {
      this.state.isLoading = true
      e.preventDefault();
      if (
        !this.state.screen.length ||
        !this.state.ram.length ||
        !this.state.storage ||
        !this.state.battery
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