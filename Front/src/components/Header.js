import React, { Component } from 'react';
import logo from './img/Vector.svg'
import './css/header.css'
import userIcon from './img/user-icon.svg'
import menuIcon from './img/Menu.svg'
import arrowIcon from './img/arrow.svg'

class Header extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          isOpen: false
        };
    
        this.toggleDropdown = this.toggleDropdown.bind(this);
      }
    
      toggleDropdown() {
        this.setState({
          isOpen: !this.state.isOpen
        });
      }

    
  render() {
    if(this.props.page === "start-page"){
      return(
        <header className='header-start'>
        {this.state.isOpen = false}
          <img src={logo}/>
          <div className='button-container'>
              <button className='button-log text-2' onClick={() => this.props.onAuthorization()}>
                  Войти
              </button>
              <button className='button-reg text-2' onClick={() => this.props.onRegistration()}>
                  <p>Зарегистрироваться</p>
              </button>
          </div>
      </header>
      );
    }else if (this.props.page === "constructor"){
      return (
        <header className='header'>
        {this.state.isOpen = false}
          <div style={{display: 'flex', height: '100%', width: 'auto'}}>
            <img src={logo} className='logo'/>
            <img className='prev-page' src={arrowIcon} onClick={() => this.props.onChangePage('bot-list')}/>
            <p className='text-2-gray'>Конструктор</p>
          </div>
        </header>
      );
    }else if (this.props.page === "bot-list"){
      return (
        <header className='header'>
        {console.log(this.state.user)}
        <img src={logo} className='logo'/>
        <div className='button-container'>{/* контейнер с элементами в правой части шапки */}
          <img src={userIcon}  style={{margin: '0px'}} className='userIcon'/>
          <p className='userName text-2'>{this.props.user.name}</p>
          <button className='buttonList' onClick={() => this.toggleDropdown()}>
            <img src={menuIcon} />
          </button>         
          {this.state.isOpen && (
            <div onClick={() => this.setState({isOpen: false})} className='close-list'>
              <div className='dropdown-container text-3' onClick={e => e.stopPropagation()}>
                <ul>
                  <li>
                      <a href="#" onClick={() => this.props.onUserSettings()}>Настройки</a>
                  </li>
                  <li>
                      <a href='#' onClick={() => this.props.onExit()}>Выход</a>
                  </li>
                  
                </ul>
              </div>
            </div>
          )}
        
        </div>
      </header>
    );
    }else if (this.props.page === "user-settings"){
      return(
        <header className='header' style={{}}>
        {this.state.isOpen = false}
        <div style={{display: 'flex', height: '100%', width: 'auto'}}>
          <img src={logo} className='logo'/>
          <img className='prev-page' src={arrowIcon} onClick={() => this.props.onChangePage('bot-list')}/>
          <p className='text-2-gray'>Настройка аккаунта</p>
        </div>
      </header>
      )
    }else if (this.props.page === "create-bot") {
      return(
        <header className='header' style={{}}>
        {this.state.isOpen = false}
        <div style={{display: 'flex', height: '100%', width: 'auto'}}>
          <img src={logo} className='logo'/>
          <img className='prev-page' src={arrowIcon} onClick={() => this.props.onChangePage('bot-list')}/>
          <p className='text-2-gray'>Создание бота</p>
        </div>
      </header>
      )
    }else if (this.props.page === "load") {
      return(
        <header className='header' style={{}}>
        {this.state.isOpen = false}
        <div style={{display: 'flex', height: '100%', width: 'auto'}}>
          <img src={logo} className='logo'/>
        </div>
      </header>
      )
    }
    
  }
}


export default Header;