import React, { Component } from 'react';

import './css/settings.css'

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clickSettings: false,
      user: {
        name: props.user.name,
        email: props.user.email
      }
    };
    console.log(this.state.user)

  }

    
  render() {
    return (
        <div className='settings'>
            
            
            
            
            {/* <div className='block'>
                <input formMethod='Post' className='input' placeholder='Email'/>
            </div>
            <h1>Имя</h1>
            <div className='block'>
                <input formMethod='Post' className='input' placeholder='Имя'/>
            </div> */}
            <div className='inputForm'>
              <p className='text-3'>Почта</p>
              {    console.log(this.state.user)}
              <input className='inputData-block text-3' type="text" name="email-input-settings" placeholder='Email' value={this.state.user.email} readOnly={true}/>
              <p className='text-3'>Логин</p>
              <input className='inputData-block text-3' type="text" name="name-input-settings" placeholder='Логин' value={this.state.user.name} readOnly={true}/>
              <p className='text-3'>Пароль</p>
              <input className='inputData text-3' type="password" autoComplete="off" placeholder='Пароль' defaultValue=""/><br/>
              
            </div>
            <button className='button-settings text-2'>Сохранить</button>
            
        </div>
    );
  }
}


export default Settings;