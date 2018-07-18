import React from 'react';
import { Button, Input, Container, Header } from 'semantic-ui-react';
import { withFormik } from "formik";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'ramda';

class Register extends React.Component {
  render() {
    const { values, handleChange, handleBlur, handleSubmit, isSubmitting } = this.props;

    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Input
          name="username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Username"
          fluid
        />
        <Input
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
          fluid
        />
        <Input
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          type="password"
          placeholder="Password"
          fluid
        />
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>Submit</Button>
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation RegisterMutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;

export default compose(
  graphql(registerMutation),
  withFormik({
    mapPropsToValues: props => ({ email: '', password: '', username: '' }),
    handleSubmit: async (values, { props, setErrors, setSubmitting }) => {
      const response = await props.mutate({ 
        variables: values
      });
      setSubmitting(false);
      console.log(response);
    }
  })
)(Register);

