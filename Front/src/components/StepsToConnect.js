import React, { Component } from 'react';
import logo from './img/Vector.svg'
import './css/header.css'
import userIcon from './img/user-icon.svg'
import menuIcon from './img/Menu.svg'
import './css/steps-to-connect.css'
import axios from 'axios'


import writeCookie from '../Session/WriteCookie';
import readCookie from '../Session/readCookie';

class StepsToConnect extends Component {
  constructor(props){
    super(props);
    this.state = {
        user: props.user,
        bot_name: props.bot_name,
        bot_unique_name: '',
        bot_token: '',
        error: '',
        empty_name: false,
        empty_token: false,
        isLoaded: false
    }
  }

  deleteError = () => {
    this.setState({
        error: ''
    })
  }

  onCreateBot = () => {
    if (this.state.bot_token === ''){
        this.setState({error: 'Введите токен'})
    }else if (this.state.bot_unique_name === '') {
        this.setState({error: 'Введите токен'})
    }else{
        this.setState({isLoaded: true});
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/bot/create',
            data: {
                unique_name: this.state.bot_unique_name,
                token: this.state.bot_token,
                name: this.state.bot_name,
                url: 0,
                launch_status: 0
            },
            headers: {
              "Authorization": readCookie('Authorization')
            }
        }).then((res) => {
            this.setState({
                isLoaded: false
            })
            this.props.onCreate()
        }).catch(err => {
            this.deleteError()
            this.setState({
                isLoaded: false,
                error: 'Неверный токен'
            })
        })
    }
  }

  render() {
    return (
        <div className='block-list'>
            <h2 style={{paddingLeft: '30px'}} className='text-2'>4 шага для подключения бота:</h2><br/>
            <div className='block-settings text-3'>
                <p>1. Откройте аккаунт @botfather</p>
            </div>
            
            <div className='block-settings text-3'>
                <p>2. Отправьте команду /newbot и следуйте указаниям</p>
            </div>

            <div style={{display: 'block'}} className='block-settings text-3'>
                <p>3. Введите уникальное имя бота</p>
                <input placeholder="Напримаер @newBOT" className='input' onChange={(e) => this.setState({bot_unique_name: e.target.value})}/>
            </div>
            
            <div className='block-token text-3'>
                <p>4. Бот пришлет токен. Скопируйте и вставьте его:</p>
                <div>
                    <input placeholder="Например 54656526165165" className='input' onChange={(e) => this.setState({bot_token: e.target.value})}/>
                    <button onClick={this.onCreateBot}>Подключить бота</button>
                </div>
            </div>
        </div>
    );
  }
}


export default StepsToConnect;