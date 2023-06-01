import React, { Component, useEffect } from 'react';
import axios from 'axios'

import loadIcon from './img/loading-svgrepo-com.svg'
import logo from './img/Vector.svg'


import './css/modal.css'
import writeCookie from '../Session/WriteCookie';
class ModalAuthorization extends Component {
    constructor(props) {
        super(props);
        this.state = {
        //   showModalAuthorization: false,
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          isLoaded: false,
          error: '',
          incor_email: false,
          incor_pass: false

        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }


      handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
      };
    
      handleSubmit = (event) => {
        event.preventDefault();
      };

      userAuthorization = () => {
        if (this.state.name === ''){
          this.deleteError()
          this.setState({
            incor_email: true
          })
        }else if (this.state.password === ''){
          this.deleteError()
          this.setState({
            incor_pass: true
          })
        }else{
          this.setState({isLoaded: true});
          axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/auth/token/login',
            data: {
              username: this.state.name,
              password: this.state.password
            }
          }).then((res) => {
            this.setState({
              isLoaded: false
            })
            this.props.onAuthorization(this.state.name, res.data.auth_token, res.data.id)
          })
          .catch(err => {
            this.deleteError()
            this.setState({
              isLoaded: false,
              error: 'Неправльный логин или пороль'
            })
          })
        }
        
      }

      deleteError = () => {
        this.setState({
          error: '',
          incor_pass: false,
          incor_email: false
        })
      }


      render() {
        const { onClose } = this.props;
        return (
            <div className={this.props.showModal ? "modal active" : "modal"} onClick={()=> 
              this.setState({
                error: '',
                incor_pass: false,
                incor_email: false
              }, this.props.onCloseModal())}>
            <div className={this.props.showModal ? "modal__content active" : "modal__content"} onClick={e=>e.stopPropagation()}>
              
              <img src={logo} className='size__logo'/>
              <h3 style={{paddingLeft:'40px'}}>Авторизуйтесь</h3>
              <form onSubmit={this.handleSubmit} className='input__form'>

                  
                  <input
                    type="name"
                    name="name"
                    placeholder='Username'
                    className='label'
                    value={this.state.name}
                    onChange={this.handleInputChange}
                    autoComplete="off"
                  />
                
                <p className='text-4' 
                  style={{display: 'flex',width: '340px', height: '15px', margin: '0px', marginBottom: '5px', justifyContent: 'center', alignItems: 'center', color: 'red'}}>
                  {this.state.incor_email && 'Заполните поле'}
                </p>
                  
                  <input
                    type="password"
                    name="password"
                    placeholder='Пароль'
                    className='label'
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    autoComplete="off"
                  />
                {/* <button onClick={ ()=> this.props.onOpenModal()}>sfvd</button> */}
                <p className='text-4' 
                  style={{display: 'flex',width: '340px', height: '15px', margin: '0px', marginBottom: '5px', justifyContent: 'center', alignItems: 'center', color: 'red'}}>
                  {this.state.incor_pass && 'Заполните поле'}
                  {this.state.error}
                </p>
                <button type="button" className='button-auth-reg text-2' style={{fontSize: '20px', width: '80%'}}  onClick={() => this.userAuthorization()}>Войти</button>
                <br/>
                <br/>
                <div style={{display: 'flex',width: '340px',margin: '0px', justifyContent: 'space-between', alignItems: 'center'}}><p>Нет аккаунта?</p><p style={{cursor: 'pointer', color: 'orange'}} onClick={ ()=> this.props.onOpenModal()}>Зарегистрируйтесь</p></div>
              </form>
            </div>
            {this.state.isLoaded &&
              <div className={this.state.isLoaded ? "modal_loaded active" : "modal_loaded"}>
                <div className='loader'>
                  <img src={loadIcon} alt='Loader'/>
                </div>
              </div>
            }
          </div>
        );
      }
}


export default ModalAuthorization;