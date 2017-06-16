import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native'

import { GiftedChat } from 'react-native-gifted-chat';

export default class ChatScreen extends Component {

  static navigationOptions = {
    // Nav options can be defined as a function of the navigation prop:
    title: ({ state }) => `${state.params.name}`,
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    })
  }

  componentDidMount() {
    console.log("DID MOUNT");
  }

  componentDidUpdate() {
    console.log("DID UPDATE", this.props.statue);
  }

  componentWillReceiveProps(props) {
    console.log('NEW PROPS', props, this.props);
    statue = props.statue;
    if (statue != undefined && statue.slug != this.props.statue.slug) {

      this.setState({
        statue: statue,
        messages: this.initialMessages(statue.name)
      });
    }
    else if (this.state.statue == undefined && statue != undefined) {
      this.setState({
        statue: statue,
        messages: this.initialMessages(statue.name)
      })
    }
    else if (statue == undefined) {
      this.setState({
        statue: statue,
        messages: this.initialMessages("not even a statue")
      })
    }
  }

  initialMessages(name) {
    return [
    {
      _id: 1,
      text: "Hello there ! I'm " + name + ", it's nice to meet you :). You may ask me anything you'd like about me or my artist !",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://facebook.github.io/react/img/logo_og.png',
      },
    },
    ]
  }

  onSend(messages = []) {
    for (let i = 0; i < messages.length; i++) {
      fetch('http://api.talkingstatues.xyz/api/chatterbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: this.state.statue.slug.concat(' ').concat(messages[i].text),
        })
      })
      .then((response) => response.json())
      .then((data) => {
        let response = [{
          _id: this.state.messages.length + 1,
          text: data.text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }];

        this.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, response),
          };
        });
      })
      .catch((error) => console.log(error));
    }

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  render() {
   console.log("RENDERING NOW")
   return (
     <GiftedChat
     messages={this.state.messages}
     onSend={this.onSend}
     user={{
      _id: 1,
    }}
    />
    );
 }
}