import React, { Component, useState } from 'react';

import logo from './img/Vector.svg'
import './css/startPage.css'

import telegramIcon from './img/telega.svg'
import ModalRegistration from './ModalRegistration';
import ModalAuthorization from './ModalAuthorization';
import Header from './Header';
class StartPage extends Component {
  constructor(props) {
    super(props);
    // const [modalActive, setModalActive] = useState(true)
    this.state = {
      showModalRegistration: false,
      clickSettings: false,
      showModalAuthorization: false
      
    };
    this.handleOpenModalRegistration = this.handleOpenModalRegistration.bind(this)
    this.handleCloseModalRegistration = this.handleCloseModalRegistration.bind(this)

    this.handleOpenModalAuthorization = this.handleOpenModalAuthorization.bind(this)
    this.handleCloseModalAuthorization = this.handleCloseModalAuthorization.bind(this)

  }
  handleOpenModalRegistration = () => {
    this.setState({ showModalAuthorization: false,
                    showModalRegistration: true });
  };

  handleCloseModalRegistration = () => {
    this.setState({ showModalRegistration: false });
  };

  handleOpenModalAuthorization = () => {
    this.setState({ showModalRegistration: false,
                    showModalAuthorization: true });
  };

  handleCloseModalAuthorization = () => {
    this.setState({ showModalAuthorization: false });
  };

  onAuthorization = (name, email, token) => {
    this.props.userAuthorization(name, email, token)
  }
    
  render() {
    return (
        <div className='start-page'>
            <Header 
              page="start-page" 
              onAuthorization={this.handleOpenModalAuthorization} 
              onRegistration={this.handleOpenModalRegistration}/>
            <div className='middle-menu'>
                <div className='middle-text'>
                    <h1 className='text-1'>Чат-бот в Telegram</h1>
                    <p className='text-2'>Создайте бота своими руками в одном из самых популярных мессенджеров за несколько минут</p>
                    
                    <button className='button-reg text-2' onClick={this.handleOpenModalRegistration}><p>Создать бота</p></button>
                </div>
                
                <img className='icon' src={telegramIcon}/>
            </div>
            
            <footer className='footer-menu'>
                <p className='text'>Контакты</p>
                <p className='text'>8 (800) 555-35-35</p>
                <p className='text'>mail@mail.ru</p>
                <p className='text'>Иркутск, ул.Лермонтова 83</p>
            </footer>
            {/* <Modal active={modalActive} setActive={setModalActive}/> */}
                <ModalRegistration 
                  onCloseModal={this.handleCloseModalRegistration} 
                  showModal = {this.state.showModalRegistration} 
                  onOpenModal = {this.handleOpenModalAuthorization} 
                  onRegistration={this.onAuthorization}/>
            
                <ModalAuthorization 
                  onCloseModal={this.handleCloseModalAuthorization}  
                  showModal = {this.state.showModalAuthorization} 
                  onOpenModal ={this.handleOpenModalRegistration} 
                  onAuthorization={this.onAuthorization}/>
            
        </div>
    );
  }
}


export default StartPage;