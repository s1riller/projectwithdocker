import React from 'react';
import plusIcon from '../img/plus-svg.svg'

export function Communication(props){
    const bot = props.bot;
    const command_id = props.id;
    const message_index = bot.communication_commands.findIndex(x => x.id === command_id);
    const command_index = bot.commands.findIndex(x => x.id === command_id);
    
    const onChange = (bot) => {
        props.onChangeBot(bot);
    }
    
    return(
        <div>
            <div className="message-field">
                <p className='text-5'>{bot.communication_commands[message_index].name}</p>
                <input placeholder='Введите сообщение'/>
            </div>
            <button className="add-message-button"><img src={plusIcon} alt="Добавить"/></button>
        </div>
    );
}

export default Communication