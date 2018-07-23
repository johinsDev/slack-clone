import React from 'react';
import { Message } from 'semantic-ui-react';

const MessageError = ({ errors }) => (
  <Message error>
    <Message.Header>There was some errors with your submission</Message.Header>
    <Message.List>
      {Object.keys(errors).map(err => (<Message.Item key={err}>{errors[err]}</Message.Item>))}
    </Message.List>
  </Message>
);

export default MessageError;

