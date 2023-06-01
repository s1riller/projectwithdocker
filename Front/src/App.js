import React from 'react';
import './normalize.css'
import './components/css/style.css'
import FunctionsBlock from './components/FunctionsBlock'
import Constructor from './components/Constructor'
import BotList from './components/BotList'
import axios from 'axios'
import StartPage from './components/StartPage';
import Header from './components/Header'
import Settings from './components/Settings';
import StepsToConnect from './components/StepsToConnect';
import loadIcon from './components/img/loading-svgrepo-com.svg'
import './components/css/modal.css'

import writeCookie from './Session/WriteCookie';
import readCookie from './Session/readCookie';


axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      status: "start-page",
      id: "",
      bots: [
        {
        id: '0',
        name: "Яша",
        unique_name: "@Yashka_Nyashka",
        token: "1234898454521315",
        url: "http://alexey/csharp/constructor/",
        status: false,
        commands: [
          {
            id: '0',
            type: "message",
            call: [
              {
              id: '0',
              command_call: "/start"
              },
              {
                id: '1',
                command_call: "Привет"
              }
            ],
            link: ['1', '8']
          },
          {
            id: '1',
            type: "message",
            call: [
              {
              id: '2',
              command_call: "/whatsup"
              },
              {
                id: '3',
                command_call: "Что нового?"
              }
            ],
            link: ['6', '7']
          },/*
          {
            id: 2,
            type: "communication",
            call: [
              {
              id: 4,
              command_call: "/helpme"
              },
              {
                id: 5,
                command_call: "Не понимаю"
              }
            ],
            link: [null]
          },*/
          {
            id: '3',
            type: "mail",
            call: [],
            link: ['4']
          },
          {
            id: '4',
            type: "message",
            call: [
              {
                id: '6',
                command_call: "/moreinfo"
              },
              {
                id: '7',
                command_call: "Подробнее"
              }
            ],
            link: []
          },
          {
            id: '5',
            type: "message",
            call: [
              {
              id: '8',
              command_call: "/whatsup"
              },
              {
                id: '9',
                command_call: "Что нового?"
              }
            ],
            link: []
          },
          {
            id: '6',
            type: "message",
            call: [
              {
              id: '8',
              command_call: "/whatsup"
              },
              {
                id: '9',
                command_call: "Что нового?"
              }
            ],
            link: []
          },
          {
            id: '7',
            type: "message",
            call: [
              {
              id: '8',
              command_call: "/whatsup"
              },
              {
                id: '9',
                command_call: "Что нового?"
              }
            ],
            link: []
          },
          {
            id: '8',
            type: "message",
            call: [
              {
              id: '8',
              command_call: "/whatsup"
              },
              {
                id: '9',
                command_call: "Что нового?"
              }
            ],
            link: []
          }
          
        ],
        mail_commands: [
          {
            id: '3',
            name: "Защита проектов",
            date: "2015-09-25T12:15",
            message: "Сегодня в Технопарке ИрНИТУ проходит защита проектов Академии IT 2-го потока",
            media: []
          }],
        message_commands: [
          {
            id: '0',
            name: "Приветствие",
            message: "Прошёл целый год, а все вы только похорошели",
            media: []
          },
          {
            id: '1',
            name: "Дела",
            message: "Да вот, защищаем проект. Пол года то... Пол года сё... Вот и готово)",
            media: []
          },
          {
            id: '4',
            name: "Подробности о мероприятии",
            message: "Да вот, защищают проекты будущие специалисты IT сферы компании En+. Вон как их много...",
            media: []
          },
          {
            id: '5',
            name: "Дела",
            message: "Да вот, защищаем проект. Пол года то... Пол года сё... Вот и готово)",
            media: []
          },
          {
            id: '6',
            name: "Дела",
            message: "Да вот, защищаем проект. Пол года то... Пол года сё... Вот и готово)",
            media: []
          },
          {
            id: '7',
            name: "Дела",
            message: "Да вот, защищаем проект. Пол года то... Пол года сё... Вот и готово)",
            media: []
          },
          {
            id: '8',
            name: "Дела",
            message: "Да вот, защищаем проект. Пол года то... Пол года сё... Вот и готово)",
            media: []
          }],/*
        communication_commands: [
          {
            id: 2,
            name: "Связь с нами",
            user: ["@Antmolch", "@hzxto"]
          }],*/
        chats: [
          {
            id: '0',
            chat_id: "@Antmolch",
          },
          {
            id: '1',
            name: "@hzxto",
          }]
        },
      
        {
          id: '1',
          name: "Гоша",
          unique_name: "@Gosha_Yosha",
          token: "12348ghrbr21315",
          url: "http://alexey/csharp/constructor/",
          status: true,
          commands: [],
          mail_commands: [],
          message_commands: [],
          communication_commands: [],
          chats: [
            {
              id: '0',
              name: "@Antmolch",
            },
            {
              id: '1',
              name: "@hzxto",
            }]
        }],
      active_func_button: "none",
      user: this.autoAuthorization(),
      bot_name: '',
      isLoaded: false,
      error: ''
    }
    this.onChangeBot = this.onChangeBot.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onDeleteBot = this.onDeleteBot.bind(this);
  }

  autoAuthorization = () => {
    let user = {}
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/api/getuser',
      headers: {
        "Authorization": readCookie('Authorization')
      }
    }).then((res) => {
      writeCookie('Authorization', readCookie('Authorization'), 1);
      user.name = res.data.username
      user.email = res.data.email
      this.setState({
        status: "bot-list"
      })
      this.getBots();
    }).catch(err => {
      writeCookie('Authorization', readCookie('Authorization'), 0.000000001);
      user = {
        name: '',
        email: ''
      }
      this.setState({
        status: "start-page"
      })
    })
    return user
  }

  

  parseBots = (bots) => {
    if (bots.length > 0){
      let index = 0;
      
      bots.map((bot) => {
        bots[index].message_commands = []
        bots[index].mail_commands = []
        let cmd_index = 0
        
        bots[index].status = bots[index].launch_status;

        bot.commands.map((cmd) => {
          if (cmd.message_commands.length !== 0){
            cmd.message_commands[0].id = cmd.message_commands[0].command_id;
            cmd.message_commands[0].media = cmd.media
            cmd.message_commands[0].name = cmd.name
            cmd.message_commands.message = cmd.message_commands[0].message
            delete cmd.message_commands[0].command_id;
            bots[index].message_commands.push(cmd.message_commands[0])
            delete bots[index].commands[cmd_index].mail_commands
            delete bots[index].commands[cmd_index].message_commands
            delete bots[index].commands[cmd_index].media
          }else if (cmd.mail_commands.length !== 0){
            cmd.mail_commands[0].id = cmd.mail_commands[0].command_id;
            cmd.mail_commands[0].media = cmd.media
            cmd.mail_commands[0].name = cmd.name
            delete cmd.mail_commands[0].command_id;
            bots[index].mail_commands.push(cmd.mail_commands[0])
            delete bots[index].commands[cmd_index].mail_commands
            delete bots[index].commands[cmd_index].message_commands
            delete bots[index].commands[cmd_index].media
          }
          
          bots[index].commands[cmd_index].link = [];
          bots[index].commands[cmd_index].call = [];
          cmd.calls.map((call) => {
            bots[index].commands[cmd_index].call.push({
              id: call.id,
              command_call: call.name
            });
          })
          delete bots[index].commands[cmd_index].calls

          cmd.links.map((link) => {
            link.follow.map((follow) => {
              bots[index].commands[cmd_index].link.push(follow);
            })
          })
          delete bots[index].commands[cmd_index].links

          
          if (cmd.type_id === "fe67b9ae-95ce-44e4-97db-915a02195191"){
            bots[index].commands[cmd_index].type = 'message'
          }else{
            bots[index].commands[cmd_index].type = 'mail'
          }
          delete bots[index].commands[cmd_index].type_id
          cmd_index++;
        })
        index++;
      })
    }
    return bots
  }

  getBots = () => {
    this.setState({
      isLoaded: true
    })
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/api/bot/all',
      headers: {
        "Authorization": readCookie('Authorization')
      }
    }).then((res) => {
      this.setState({
        isLoaded: false,
        bots: JSON.parse(JSON.stringify(this.parseBots(res.data)))
      })
    })
    .catch(err => {
      this.setState({
        isLoaded: false,
        status: "start-page",
        active_func_button: "none",
        user: {
          name: '',
          email: '',
          id: ''
        },
        bot_name: '',
        error: ''

      })
    })
  }

  sendBots = (bot_id, updateCommands, deleteCommands, addCommands) =>{
    this.setState({
      isLoaded: true
    })
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/bots/update',
      data: {
        bot_id: bot_id,
        updateCommands: updateCommands,
        deleteCommands: deleteCommands,
        addCommands: addCommands
      }
    }).then((res) => {
      this.setState({
        isLoaded: false
      })
    })
    .catch(err => {
      this.setState({
        isLoaded: false,
        error: 'Ошибка'
      })
    })
  }

  onChangeBot(id){
    this.setState({ 
      status: "constructor",
      id: id
    });
  }
  onChangeStatus(id){
    let numberBot = this.state.bots.findIndex(x => x.id === id);
    let bots = this.state.bots;
    axios({
      method: 'patch',
      url: 'http://127.0.0.1:8000/api/bot/' + bots[numberBot].id,
      data: {
        id: bots[numberBot].id,
        unique_name: bots[numberBot].unique_name,
        name: bots[numberBot].name,
        token: bots[numberBot].token,
        url: 0,
        launch_status: !bots[numberBot].status
      },
      headers: {
        "Authorization": readCookie('Authorization')
      }
    })
    bots[numberBot].status = !this.state.bots[numberBot].status;
    
    this.setState({bots: bots})
  }

  onDeleteBot(id){
    let numberBot = this.state.bots.findIndex(x => x.id === id);
    let bots = this.state.bots;
    axios({
      method: 'delete',
      url: 'http://127.0.0.1:8000/api/bot/' + bots[numberBot].id,
      headers: {
        "Authorization": readCookie('Authorization')
      }
    }).then(() => {
      this.getBots();
    })
  }

  onChangeButton = (status) => {
    this.setState({
      active_func_button: status
    });
  }

  userExit = () => {
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/auth/token/logout',
      headers: {
        "Authorization": readCookie('Authorization')
      }
    })
    this.setState({
      status: "start-page",
      active_func_button: "none",
      user: {
        name: '',
        email: '',
        id: ''
      },
      bot_name: '',
      error: ''
    })
  }

  userSettings = () => {
    this.setState({
      status: "user-settings"
    })
  }
  
  userAuthorization = (name, token, id) => {
    writeCookie('Authorization', 'Token ' + token, 1);
    this.setState({
      user: this.autoAuthorization()
    })
  }

  parseChangeBot = () => {
    
  }

  ChangeBot = (bot1) => {
    let bot = bot1;
    this.setState({isLoaded: true})
    let promise = new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: 'http://127.0.0.1:8000/api/bot/' + bot.id,
        headers: {
          "Authorization": readCookie('Authorization')
        }
      }).then((res) => {
        axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/api/bot/create',
          data: {
            unique_name: bot.unique_name,
            name: bot.name,
            token: bot.token,
            url: "0",
            launch_status: bot.status
          },
          headers: {
            "Authorization": readCookie('Authorization')
          }
        }).then((resu) => {
          bot.id = resu.data.id
          
          bot.commands.map((cmd) => {
            let cmd_index = bot.commands.findIndex(x => x.id === cmd.id);
            axios({
              method: 'post',
              url: 'http://127.0.0.1:8000/api/command/create',
              data: {
                name: cmd.type === "message" ? 
                      (bot.message_commands[bot.message_commands.findIndex(x => x.id === cmd.id)].name === "" ? "Без название" : bot.message_commands[bot.message_commands.findIndex(x => x.id === cmd.id)].name) 
                      :
                      (bot.mail_commands[bot.mail_commands.findIndex(x => x.id === cmd.id)].name === "" ? "Без название" : bot.mail_commands[bot.mail_commands.findIndex(x => x.id === cmd.id)].name),
                link_status: false,
                bot_id: resu.data.id,
                type_id: cmd.type === 'message' ? 'fe67b9ae-95ce-44e4-97db-915a02195191' : 'e01331d0-8c74-4cc6-a2d3-a6bd0a06a409'
              },
              headers: {
                "Authorization": readCookie('Authorization')
              }
            }).then((resс) => {
              bot.commands.map((cmd_in) => {
                let cmd_in_index = bot.commands.findIndex(x => x.id === cmd_in.id);
                cmd_in.link.map((link) => {
                  let link_index = bot.commands[cmd_in_index].link.findIndex(x => x === link);
                  if(link === cmd.id)
                    bot.commands[cmd_in_index].link[link_index] = resс.data.id;
                })
                if(cmd_index === bot.commands.length - 1 && cmd_in_index === bot.commands.length - 1)
                  setTimeout(() => {
                    resolve("good");
                  }, 1000)
              })
      
              bot.message_commands.map((msg_cmd) => {
                let msg_cmd_index = bot.message_commands.findIndex(x => x.id === msg_cmd.id)
                if (msg_cmd.id === cmd.id){
                  bot.message_commands[msg_cmd_index].id = resс.data.id;
                  axios({
                    method: 'post',
                    url: 'http://127.0.0.1:8000/api/messageCommand/create',
                    data: {
                      message: msg_cmd.message === '' ? "Пусто" : msg_cmd.message,
                      command_id: resс.data.id
                    },
                    headers: {
                      "Authorization": readCookie('Authorization')
                    }
                  })
                  if (msg_cmd.media.length !== 0) 
                    axios({
                      method: 'post',
                      url: 'http://127.0.0.1:8000/api/media/create',
                      data: {
                        command_id: resс.data.id,
                        name: msg_cmd.media[0].name,
                        type: msg_cmd.media[0].type,
                        file: msg_cmd.media[0].file
                      },
                      headers: {
                        "Authorization": readCookie('Authorization')
                      }
                    })
                }
              })
      
              bot.mail_commands.map((ml_cmd) => {
                let ml_cmd_index = bot.mail_commands.findIndex(x => x.id === ml_cmd.id)
                if (ml_cmd.id === cmd.id){
                  bot.mail_commands[ml_cmd_index].id = resс.data.id;
                  axios({
                    method: 'post',
                    url: 'http://127.0.0.1:8000/api/mailCommand/create',
                    data: {
                      message: ml_cmd.message === '' ? 'Без имени' : ml_cmd.message,
                      command_id: resс.data.id,
                      datetime: ml_cmd.data === undefined ? "2020-05-05T00:00:00Z" : ml_cmd.data + ':00Z'
                    },
                    headers: {
                      "Authorization": readCookie('Authorization')
                    }
                  })
                  if (ml_cmd.media.length !== 0) 
                    axios({
                      method: 'post',
                      url: 'http://127.0.0.1:8000/api/media/create',
                      data: {
                        command_id: resс.data.id,
                        name: ml_cmd.media[0].name,
                        type: ml_cmd.media[0].type,
                        file: ml_cmd.media[0].file
                      },
                      headers: {
                        "Authorization": readCookie('Authorization')
                      }
                    })
                }
              })
              
              bot.commands[cmd_index].id = resс.data.id;
            })
            
          })
        })
        promise.then(result => {
          let promise1 = new Promise((resolve, reject) => {
            let cmd_index = 0;
            let call_index = 0;

            bot.commands.map((cmd) => {
              cmd_index = bot.commands.findIndex(x => x.id === cmd.id);
              if (cmd.link.length !== 0)
                axios({
                  method: 'post',
                  url: 'http://127.0.0.1:8000/api/link/create',
                  data: {
                    current: cmd.id,
                    follow: cmd.link
                  },
                  headers: {
                    "Authorization": readCookie('Authorization')
                  }
                })
              cmd.call.map((call) => {
                axios({
                  method: 'post',
                  url: 'http://127.0.0.1:8000/api/command/call/create',
                  data: {
                    command_id: cmd.id,
                    name: call.command_call
                  },
                  headers: {
                    "Authorization": readCookie('Authorization')
                  }
                })
              })
              if (cmd_index === bot.commands.length - 1)
              setTimeout(() => {
                resolve("good");
              }, 1000)
            })
        
            bot.chat.map((chat) => {
              axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/api/botChat/create',
                data: {
                  bot_id: bot.id,
                  chat_id: chat.chat_id
                },
                headers: {
                  "Authorization": readCookie('Authorization')
                }
              })
            })
          })
          promise1.then((result) => {
          this.setState({
            id: JSON.parse(JSON.stringify(bot.id)),
            isLoaded: false
          })
          this.getBots();
        })
        })
      
      })
    })
  }
  

  ChangePage = (page) => {
    this.setState({
      status: page
    })
  }

  onNewBot = (bot_name) => {
    this.setState({
      status: 'create-bot',
      bot_name: bot_name
    })
  }

  onCreateBot = () => {
    this.getBots();
    this.setState({
      status: 'bot-list'
    })
  }

  onSaveBot = (bot) => {
    
  }

  render(){
    console.log(this.state.bots)
    if (this.state.status === "start-page"){
      return(
        <div className='app'>
          <StartPage userAuthorization={this.userAuthorization} />
        </div>
      );
    }else if (this.state.status === "constructor")
      return(
        <div className='app'>
          {!this.state.isLoaded ?
            <Header 
              user={this.state.user} 
              page={this.state.status}
              onChangePage={this.ChangePage}
            />
            :
            <Header 
              page={"load"}
            /> 
            }
            {this.state.isLoaded ? 
              <div className='load-bots'>
                <img src={loadIcon} alt='Loader' />
              </div> : 
              <div className="bot-constructor">
                <FunctionsBlock onChangeButton={this.onChangeButton}/>
                {console.log("1")}
                <Constructor 
                  isLoaded={this.state.isLoaded}
                  onChangeBot={this.ChangeBot} 
                  bot={JSON.parse(JSON.stringify(this.state.bots[this.state.bots.findIndex(x => x.id === this.state.id)]))} 
                  active_button={this.state.active_func_button}/>
              </div>
            }
        </div>
        
      )
    else if (this.state.status === "bot-list")
      return(
        <div className='app'>
        {!this.state.isLoaded ?
          <Header 
            page={this.state.status}
            user={this.state.user}
            onExit={this.userExit}
            onUserSettings={this.userSettings}
            /> 
            :
            <Header 
            page={"load"}
            /> 
            }
          <div className="bot-list-field">
            {this.state.isLoaded ? 
              <div className='load-bots'>
                <img src={loadIcon} alt='Loader' />
              </div> : 
              <BotList 
                  onDeleteBot={this.onDeleteBot} 
                  onChangeStatus={this.onChangeStatus} 
                  onClickBot={this.onChangeBot} 
                  onNewBot={this.onNewBot}
                  bots={this.state.bots}/>
            }
            
          </div> 
        </div>
        
      )
    else if (this.state.status === "user-settings")
        return(
          <div className='app'>
            <Header 
              page={this.state.status}
              user={this.state.user}
              onExit={this.userExit}
              onUserSettings={this.userSettings}
              onChangePage={this.ChangePage}
              />
            <Settings user={this.state.user}/>
          </div>
        )
      else if (this.state.status === "create-bot")
          return(
            <div className='app'>
            <Header 
              page={this.state.status}
              user={this.state.user}
              onChangePage={this.ChangePage}/>
            <StepsToConnect bot_name={this.state.bot_name} user={this.state.user} onCreate={this.onCreateBot}/>
          </div>
          )
  }
}

export default App