import React from 'react';
import './css/constructor.css'
import Message from './Constructor/Message'
import Mail from './Constructor/Mail'
import plusIcon from './img/plus-svg.svg'
import saveIcon from './img/save.svg'
import backArrowActiveIcon from './img/back-arrow-active.svg'
import nextArrowActiveIcon from './img/next-arrow-active.svg'
import backArrowIcon from './img/back-arrow.svg'
import nextArrowIcon from './img/next-arrow.svg'

import { Guid } from 'js-guid';

class Constructor extends React.Component{
constructor(props){
    super(props);
    this.links_commands = this.FindFollowLinksCommands(props.bot);
    this.state = {
        bot: props.bot,
        start_commands: this.FindStartCommands(props.bot),
        change_container: [JSON.parse(JSON.stringify(props.bot))],
        index: 0,
        bot_name: props.bot.name
    }
}

FixationChange = (bot) => {
    let container = JSON.parse(JSON.stringify(this.state.change_container));
    if(this.state.index !== container.length - 1){
        container.splice(this.state.index + 1, container.length - this.state.index - 1)
        container.push(bot)
        this.setState({change_container: container, index: this.state.index + 1})
    }else if(container.length === 10){
        container.splice(0, 1);
        container.push(bot);
        this.setState({change_container: container, index: this.state.index})
    }else{
        container.push(bot);
        this.setState({change_container: container, index: this.state.index + 1})
    }
}

Change = (bot) => {
    this.links_commands = this.FindFollowLinksCommands(bot);
    this.FixationChange(bot);
    this.setState({
        bot: bot,
        start_commands: this.FindStartCommands(bot)
    });
}

RollBackBot = () => {
    this.links_commands = this.FindFollowLinksCommands(this.state.change_container[this.state.index - 1]);
    this.setState({index: this.state.index - 1, bot: JSON.parse(JSON.stringify(this.state.change_container[this.state.index - 1])), start_commands: this.FindStartCommands(this.state.change_container[this.state.index - 1])})
}


RollForwardBot = () => {
    this.links_commands = this.FindFollowLinksCommands(this.state.change_container[this.state.index + 1]);
    this.setState({index: this.state.index + 1, bot: JSON.parse(JSON.stringify(this.state.change_container[this.state.index + 1])), start_commands: this.FindStartCommands(this.state.change_container[this.state.index + 1])})
}

addNewBlock = () => {
    let bot = this.state.bot;
    if (this.props.active_button === "mail"){
        let guid = bot.id + Guid.newGuid()
        bot.commands.push({
            id: guid,
            type: "mail",
            call: [],
            link: []
        });
        bot.mail_commands.push({
            id: guid,
            name: "Без имени",
            date: '',
            message: "",
            media: []
        })
        this.FixationChange(bot);
        this.setState({
            bot: bot,
            start_commands: this.FindStartCommands(bot)
        })
    }else if (this.props.active_button === "message"){
        let guid = bot.id + Guid.newGuid()
        bot.commands.push({
            id: guid,
            type: "message",
            call: [],
            link: []
        });
        bot.message_commands.push({
            id: guid,
            name: "Без имени",
            message: "",
            media: []
        })
        this.FixationChange(bot);
        this.setState({
            bot: bot,
            start_commands: this.FindStartCommands(bot)
        })
    }
}

addStartBlock = () => {
    let bot = this.state.bot;
    if (this.props.active_button === "message"){
        let guid = bot.id + Guid.newGuid()
        bot.commands.push({
            id: guid,
            type: "message",
            call: [{id: Guid.newGuid(), command_call: "/start"}],
            link: []
        });
        bot.message_commands.push({
            id: guid,
            name: "Без имени",
            message: "",
            media: []
        })
        this.FixationChange(bot);
        this.setState({
            bot: bot,
            start_commands: this.FindStartCommands(bot)
        })
    }
}

SaveBot = () => {
    let bot = this.state.bot;
    bot.name = this.state.bot_name;
    this.props.onChangeBot(bot)
}

FindFollowLinksCommands(bot){
    let commands = [];
    bot.commands.map((command) => {
        let cmd_index = bot.commands.findIndex(x => x.id === command.id)
        
        if (command !== null && command.link.length !== 0)
        command.link.map((link) => {
                !commands.includes(link) && commands.push(link)
            });
    });
        
    return commands;
}

FindStartCommands(bot){
    return bot.commands.filter(cmd => cmd !== null && !this.links_commands.includes(cmd.id))
}

FindStartCommand(bot){
    let index = null;
    bot.commands.map((cmd) => {
        let cmd_index = bot.commands.findIndex(x => x.id === cmd.id)
        cmd.call.map((call) => {
            if (call.command_call === "/start"){
                index =  cmd_index
            }
        })
    })
    return index
}



    render(){
        console.log("1")
        return(
            <div className="constructor-block">
                <div className='start-block'>
                    <input autoComplete="off" className='name-bot-input text-2-gray' value={this.state.bot_name} onChange={e => this.setState({bot_name: e.target.value})}></input>
                    <p className='text-3'>Старт</p>
                </div>
                {this.FindStartCommand(this.state.bot) !== null &&
                    <div key={this.state.bot.commands[this.FindStartCommand(this.state.bot)].id} className="bot-block">
                        <Message 
                            onChangeBot={this.Change} 
                            bot={JSON.parse(JSON.stringify(this.state.bot))} 
                            id={this.state.bot.commands[this.FindStartCommand(this.state.bot)].id} 
                            start_block={true} 
                            active_button={this.props.active_button}
                            prev_id={null}/>
                    </div>
                }
                {this.FindStartCommand(this.state.bot) === null && 
                    <div className='add-block-field'>
                        <a href='#' title='Добавить'><img src={plusIcon} alt="Добавить" onClick={() => this.addStartBlock()}/></a>
                    </div>
                }
                {this.state.start_commands.map((cmd) => (
                    (this.FindStartCommand(this.state.bot) !== null &&
                        cmd.id !== this.state.bot.commands[this.FindStartCommand(this.state.bot)].id &&
                        this.state.bot.commands[this.state.bot.commands.findIndex(x => x.id === cmd.id)].type === "message") &&
                        <div key={cmd.id} className="bot-block">
                            <hr></hr>
                            <h2 className='text-2'>Начало нового блока</h2>
                            <Message 
                                onChangeBot={this.Change} 
                                bot={this.state.bot}
                                id={cmd.id} 
                                start_block={true} 
                                active_button={this.props.active_button}
                                prev_id={null}/>
                        </div>
                    )
                )}
                {this.state.start_commands.map((cmd) => (
                    (this.FindStartCommand(this.state.bot) === null &&
                        this.state.bot.commands[this.state.bot.commands.findIndex(x => x.id === cmd.id)].type === "message") &&
                        <div key={cmd.id} className="bot-block">
                            <hr></hr>
                            <h2 className='text-2'>Начало нового блока</h2>
                            <Message 
                                onChangeBot={this.Change} 
                                bot={this.state.bot} 
                                id={cmd.id} 
                                start_block={true} 
                                active_button={this.props.active_button}
                                prev_id={null}/>
                        </div>
                    )
                )}
                <hr></hr>
                <h2 className='text-2'>Добавление нового блока</h2>
                <div className='add-block-field'>
                    <a href='#' title='Добавить'><img src={plusIcon} alt="Добавить" onClick={() => this.addNewBlock()}/></a>
                </div>
                {this.state.start_commands.map((cmd) => (
                    this.state.bot.commands[this.state.bot.commands.findIndex(x => x.id === cmd.id)].type === "mail" &&
                        <div key={cmd.id} className="bot-block">
                            <hr></hr>
                            <h2 className='text-2'>Рассылка</h2>
                            <Mail 
                                onChangeBot={this.Change} 
                                bot={this.state.bot} 
                                id={cmd.id} 
                                start_block={true} 
                                active_button={this.props.active_button}
                                prev_id={null}/>
                        </div>
                ))}
                <a href="#" onClick={() => this.SaveBot()} className='save-button text-2' title='Сохранить'>
                    <img src={saveIcon} alt='Сохранить'/>
                </a>
                {this.state.index === 0 ?
                    <a href="#" className='back-arrow text-2' title='Назад'>
                        <img src={backArrowIcon} alt='Назад'/>
                    </a>
                    :
                    <a href="#" onClick={() => this.RollBackBot()} className='back-arrow text-2' title='Назад'>
                        <img src={backArrowActiveIcon} alt='Назад'/>
                    </a>
                }
                {this.state.index === this.state.change_container.length - 1 ?
                    <a href="#" className='next-arrow text-2' title='Вперёд'>
                        <img src={nextArrowIcon} alt='Вперёд'/>
                    </a>
                    :
                    <a href="#" onClick={() => this.RollForwardBot()} className='next-arrow text-2' title='Вперёд'>
                        <img src={nextArrowActiveIcon} alt='Вперёд'/>
                    </a>
                }
            </div>
        );
    }
}

export default Constructor