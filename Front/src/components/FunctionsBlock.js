import React from 'react';
import './css/constructor.css'

class FunctionsBlock extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            activeButton: "none"
        }
        this.onClickButton = this.onClickButton.bind(this);
    }

    onClickButton(button){
        this.state.activeButton === button ? this.setState({ activeButton: "none" }) : this.setState({ activeButton: button});
        this.props.onChangeButton(this.state.activeButton === button ? "none" : button);
        
    }

    render(){
        return(
            <div className="function-block">
                <div>
                    <button onClick={() => this.onClickButton("message")} className={`func-button ${this.state.activeButton === "message" ? "active" : "inactive"}`}><p className="text-3">Cообщение</p></button>
                    <button onClick={() => this.onClickButton("mail")} className={`func-button ${this.state.activeButton === "mail" ? "active" : "inactive"}`}><p className="text-3">Рассылки</p></button>
                </div>
            </div>
        )
    }
}

export default FunctionsBlock