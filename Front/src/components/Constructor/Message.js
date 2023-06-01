import React, {useState} from 'react';
import plusIcon from '../img/plus-svg.svg'
import plusBlackIcon from '../img/plus-svg-black.svg'
import exitIcon from '../img/exit.svg'
import '../css/message.css'
import Modal from '../Modal/Modal';
import CallList from './list-components/ReactLList';
import '../css/errors.css'
import arrowIcon from '../img/arrow-bottom.svg'

import FileList from './list-components/FileList'

import { Guid } from 'js-guid';

export function Message(props){
    var bot = props.bot;
    const start_block = props.start_block;
    const command_id = props.id;
    const message_index = bot.message_commands.findIndex(x => x.id === command_id);
    const command_index = bot.commands.findIndex(x => x.id === command_id);
    const active_button = props.active_button;
    

    const [modalActive, setModalActive] = useState(false);

    const FindCallCommand = (cmd_index) => {
        let calls = [];
        bot.commands[cmd_index].call.map((call) => {
            calls.push(call.command_call);
        })
        return calls;
    }

    const FindCallsOfBot = () => {
        let calls = [];
        bot.commands.map((cmd) => {
            let cmd_index = bot.commands.findIndex(x => x.id === cmd.id)
            bot.commands[cmd_index].call.map((call) => {
                calls.push(call.command_call)
            })
        })
        return calls;
    }

    const all_calls_bot = FindCallsOfBot();

    const FindMediaCommand = (msg_index) => {
        let medias = [];
        bot.message_commands[msg_index].media.map((media) =>{
            medias.push({
                name: media.name,
                type: media.type,
                file: media.file
            });
        })
        return medias;
    }
    const [name, setName] = useState(bot.message_commands[message_index].name);
    const [message, setMessage] = useState(bot.message_commands[message_index].message);
    const [call_commands, setCalls] = useState(FindCallCommand(command_index));
    const [new_call, setNewCalls] = useState('');
    const [media, setMedia] = useState(FindMediaCommand(message_index));


    const [new_call_error, setNewCallError] = useState('');
    const [new_media_error, setNewMediaError] = useState('');

    const onChange = (bot) => {
        if(start_block)
            props.onChangeBot(bot);
        else
            props.onChange(bot)
    }

    const addBlock = () => {
        if (active_button === "message"){
            let guid = bot.id + Guid.newGuid()
            bot.commands[command_index].link.push(guid);
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
            onChange(JSON.parse(JSON.stringify(bot)));
        }
        
    }

    const deleteBlock = (cmd_id) => {
        if (bot.commands[bot.commands.findIndex(x => x.id === cmd_id)].link[0] !== null){
            //удаление блоков по ссылкам
            bot.commands[bot.commands.findIndex(x => x.id === cmd_id)].link.map((id) => {
                bot = deleteBlock(id);
            });
        }
        if (bot.commands[bot.commands.findIndex(x => x.id === cmd_id)].type === "message")
            bot.message_commands = bot.message_commands.filter(x => x.id !== cmd_id);
        else if (bot.commands[bot.commands.findIndex(x => x.id === cmd_id)].type === "mail")
            bot.mail_commands = bot.mail_commands.filter(x => x.id !== cmd_id);
        bot.commands = bot.commands.filter(x => x.id !== cmd_id);
        return bot;
    }

    const onDeleteBlock = () => {
        if (props.prev_id !== null)
            //удаление ссылки на блок
            bot.commands[bot.commands.findIndex(x => x.id === props.prev_id)].link = bot.commands[bot.commands.findIndex(x => x.id === props.prev_id)].link.filter(x => x !== command_id);
        bot = deleteBlock(command_id);
        onChange(JSON.parse(JSON.stringify(bot)));
    }

    const onChangeCall = (orig_call, call) => {
        let calls = call_commands;
        calls[calls.findIndex(x => x === orig_call)] = call;
        setCalls(calls);
    }

    const onDeleteCall = (orig_call) => {
        let calls = call_commands;
        calls.splice(calls.findIndex(x => x === orig_call), 1)
        setCalls([...calls]);
    }

    const onAddCall = () => {
        let calls = call_commands;
        if (all_calls_bot.findIndex(x => x === new_call) >= 0 || call_commands.findIndex(x => x === new_call) >= 0){
            setNewCallError("Такая команда вызова уже используется");
        }else if (new_call !== ''){
            calls.push(new_call)
            setCalls([...calls])
            setNewCalls('')
            setNewCallError('')
        }
    }

    const changeData = () => {
        let save = true;
        call_commands.map((call) => {
            if (all_calls_bot.filter(x => x === call).length === 1 && 
                FindCallCommand(command_index).filter(x => x === call).length === 0 && 
                call_commands.filter(x => x === call).length >= 1){
                    setNewCallError("Команда \"" + call + "\" уже используется в этом боте")
                    save = false;
                }
            else if (call_commands.filter(x => x === call).length > 1){
                    setNewCallError("Команда \"" + call + "\" использутся больше одного раза");
                    save = false;
            }
        })
        if (save === true){
            bot.message_commands[message_index].name = name;
            bot.message_commands[message_index].message = message;
            bot.commands[command_index].call = CreateCallToChange();
            bot.message_commands[message_index].media = CreateMediaToChange();
            onChange(bot);
            setNewCallError('')
            setNewMediaError('')
            setCalls(FindCallCommand(command_index))
        }
        
    }

    const CreateCallToChange = () => {
        let calls = [];
        call_commands.map((call) =>{
            let guid = command_id + Guid.newGuid();
            calls.push({
                id: guid,
                command_call: call
            });
        })
        return calls
    }

    const CreateMediaToChange = () => {
        let files = [];
        media.map((file) => {
            let guid = command_id + Guid.newGuid();
            files.push({
                id: guid,
                name: file.name,
                type: file.type,
                file: file.file
            });
        })
        return files
    }


    const uploadImage = async (e) => {
        const file = e.target.files[0];
        if(file.size > 1048576 * 50){
            setNewMediaError("Файл не должен превышать размера 50 Мб");
         }else{
            setNewMediaError('');
            const base64 = await convertBase64(file);
            let files = media;
            files[0] = {
                name: e.target.files[0].name,
                type: e.target.files[0].type,
                file: base64
            }
            setMedia([...files])
        }
      };
    
      const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
    
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
    
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      };

      const onDeleteMedia = (file) => {
        let medias = media;
        medias.splice(medias.findIndex(x => x.file === file), 1)
        setMedia([...medias])
      }

    return(
        //Блок сообщения
        <div className='block'> 
            <div className="message-block" onClick={() => { setModalActive(true);

                                                            setName(bot.message_commands[message_index].name);
                                                            setMessage(bot.message_commands[message_index].message);
                                                            setCalls(FindCallCommand(command_index));
                                                            setMedia(FindMediaCommand(message_index));
                                                            setNewCallError('');
                                                            setNewCalls('');
                                                            setNewMediaError('');
                                                            }}>
                <div className="message-field">
                    <div>
                        {/*Имя блока + Удаление блока*/}
                        <p className='text-4'>{bot.message_commands[message_index].name}</p>
                        <div style={{cursor: 'pointer'}} onClick={e => e.stopPropagation()}><a className='delete-block-button' onClick={() => onDeleteBlock()}><img src={exitIcon} alt="close"/></a></div>
                    </div>
                    
                    <div className='message-text'><p className='text-5-gray'>{bot.message_commands[message_index].message !== "" ? bot.message_commands[message_index].message : "Пустой блок"}</p></div>
                </div>
                <a href="#" title="Добавить" onClick={e => e.stopPropagation()} className="add-message-button"><img src={plusIcon} alt="Добавить" onClick={() => addBlock()}/></a>
            </div>
            <div className='inline-bot-block'>
                {bot.commands[command_index].link.map((id) => (
                        bot.commands[bot.commands.findIndex(x => x.id === id)].type === "message" &&
                            <div key={id} className="bot-block">
                            {bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.findIndex(x => x === id) === 0 ? 

                                <div className='vertical-line'></div>

                                :
                                null
                            }
                                {bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.length - 1 === bot.commands[command_index].link.findIndex(x => x === id) ? 

                                <div className='vertical-line-opacity'></div>

                                :
                                null
                            }
                                {bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.length - 1 !== bot.commands[command_index].link.findIndex(x => x === id) && bot.commands[command_index].link.findIndex(x => x === id) !== 0 ? 

                                <div className='vertical-line-opacity'></div>

                                :
                                null
                            }
                                {bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.findIndex(x => x === id) === 0 ? 
                                <div className='lineToArrow-start'></div>
                                :
                                bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.length - 1 === bot.commands[command_index].link.findIndex(x => x === id) ?
                                <div className='lineToArrow-end'></div>
                                :
                                bot.commands[command_index].link.length !== 1 && bot.commands[command_index].link.length !== 0 && bot.commands[command_index].link.length - 1 !== bot.commands[command_index].link.findIndex(x => x === id) && bot.commands[command_index].link.findIndex(x => x === id) !== 0 && 
                                <div className='lineToArrow'></div>
                                }
                                <img className="imageArrow" src={arrowIcon} alt=''/>
                                <Message 
                                    onChange={onChange} 
                                    bot={bot} 
                                    id={id} 
                                    start_block={false} 
                                    active_button={props.active_button}
                                    prev_id={command_id}/>
                            </div>
                    ))}
            </div>

        {/*Окно настройки блока*/}
            <Modal
                active={modalActive} 
                setActive={setModalActive}>
                <div className='modal-head'>
                    <p className='text-2'>Сообщение</p> 
                    <a href='#' style={{paddingRight: '20px'}} onClick={() => {
                        setName(bot.message_commands[message_index].name);
                        setMessage(bot.message_commands[message_index].message);
                        setCalls(FindCallCommand(command_index));
                        setMedia(FindMediaCommand(message_index));
                        setNewCalls('');
                        setNewCallError('');
                        setNewMediaError('');
                        setModalActive(false);
                    }}><img src={exitIcon} alt='Закрыть'/></a>
                </div>
                <hr style={{width: 'calc(100% - 20px)'}}/>
                <form className='modal-form text-3'>
                    <label htmlFor='name'>Название команды</label>
                    <input 
                        className='text-4' 
                        type='text' 
                        id='name' 
                        placeholder='Введите название команды' 
                        onChange={e => {setName(e.target.value)}}
                        value={name}
                        autoComplete="off"
                        />
                    <label htmlFor='message'>Сообщение</label>
                    <textarea 
                        className='message-area text-4' 
                        type='text' 
                        id='message' 
                        placeholder='Введите сообщение' 
                        onChange={e => setMessage(e.target.value)}
                        value={message}
                        autoComplete="off"
                        />
                    
                    <label htmlFor='call'><p style={{marginTop: '0px', marginBottom: '3px'}}>Команды вызова</p></label>
                        {modalActive && call_commands.map((call) => (
                            <div className='call-commands' key={call}>
                                <CallList call_command={call} onChangeCall={onChangeCall} onDeleteCall={onDeleteCall}/>
                            </div>
                        ))}
                    <div className='add-call-commands text-4'>
                        <input 
                            type='text' 
                            id='call' 
                            placeholder='Введите команду вызова'
                            value={new_call}
                            onChange={e => setNewCalls(e.target.value)}
                            autoComplete="off"
                            />
                        <div className='add-call' style={{cursor: 'pointer'}}>
                            <img src={plusBlackIcon} onClick={() => onAddCall()} alt='Добавить'/>
                        </div>
                    </div>
                    <div className='error-message text-5'><p style={{color: "red"}}>{new_call_error}</p></div>

                    <label htmlFor='file'><p style={{marginTop: '0px', marginBottom: '3px'}}>Файлы</p></label>
                    
                    
                    {modalActive && media.map((obj) => (
                        <div key={obj.name}>
                            <FileList onDelete={onDeleteMedia} file={obj.file} name={obj.name} type={obj.type}/>
                        </div>
                    ))}
                    <div className='error-message text-5'><p style={{color: "red"}}>{new_media_error}</p></div>
                    <div className='file-div'>
                        <label className='file-input'>
                            <input 
                                type='file' 
                                accept='image/*, video/*, application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                onChange={e => uploadImage(e)}>
                            </input>
                            <span className='file-span text-3'>Выберите файл</span>
                        </label>
                    </div>
                    <button onClick={() => changeData()}>Сохранить</button>
                </form>
            </Modal>
        </div>
    );
}

export default Message