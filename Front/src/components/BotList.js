import React from 'react';
import Bot from './Bot'
import './css/bot-list.css'
import plusIcon from './img/plus-svg.svg'

class BotList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bot_name: '',
            error: ''
        }
        this.onClickBot = this.props.onClickBot.bind(this);
    }
    bots = this.props.bots;
    onClickBot(id){
        this.props.onChangeBot(id);
    };
    onClickStatus = (id) => {
        this.props.onChangeStatus(id);
    };
    onDelete = (id) => {
        this.props.onDeleteBot(id);
    }

    newBot = () => {
        if(this.state.bot_name !== ''){
            this.props.onNewBot(this.state.bot_name)
            this.setState({error: ''})
        }else
            this.setState({error: 'Введите имя бота'})
    }


    
    render(){
        if (this.props.bots.length > 0)
            return(
                <div className="bot-list">
                    <div className='header-bot-list'>
                        <p className='text-2'>Ваши чат-боты</p>
                        <div className='add-bot-field'>
                        <div className='bot-name-field'>
                            <input autoComplete="off" className='text-3' type='text' placeholder='Введите название чат-бота' value={this.state.bot_name} onChange={e => this.setState({bot_name: e.target.value})}/>
                            <p className='error-name-newbot text-4'>{this.state.error}</p>
                        </div>
                            <button className="add-bot-button" onClick={() => this.newBot()}>
                                <img src={plusIcon} alt='Действия'/>
                                <p className="text-3">Создать бота</p>
                            </button>
                        </div>
                    </div>
                    {this.bots.map((el) => (<div className='bot-field' key={el.id}> 
                        <Bot onDelete={this.onDelete} onClickStatus={this.onClickStatus} onClickBot={this.onClickBot} bot={el} number={this.bots.indexOf(el) + 1}/>
                    </div>))}
                </div>
            );
        else    
            return(
                <div className="bot-list">
                    <div className='header-bot-list'>
                        <p className='text-2'>Ваши чат-боты</p>
                        <div className='add-bot-field'>
                        <div className='bot-name-field'>
                            <input autoComplete="off" className='text-3' type='text' placeholder='Введите название чат-бота' value={this.state.bot_name} onChange={e => this.setState({bot_name: e.target.value})}/>
                            <p className='error-name-newbot text-4'>{this.state.error}</p>
                        </div>
                            <button className="add-bot-button" onClick={() => this.newBot()}>
                                <img src={plusIcon} alt='Действия'/>
                                <p className="text-3">Создать бота</p>
                            </button>
                        </div>
                    </div>
                    <p className='text-2' style={{width: "85%", textAlign: "center"}}>Список ботов пуст</p>
                </div>
            );
    }
}

export default BotList