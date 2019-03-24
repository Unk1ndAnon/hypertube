import React from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import validator from '../../utils/validator'

class Register extends React.Component {

  state = {
    register: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      repassword: ''
    },
    formErrors: {
      username: [], firstname: [], lastname: [], email: [], password: [], repassword: []
    }
  }

  validate = (name) => {
    const value = this.state.register[name]
    let errors = []
    validator.value = value

    if (name == 'username')
      errors = validator.notNull().minLen(3).maxLen(20).errors
    else if (name == 'firstname')
      errors = validator.notNull().maxLen(40).errors
    else if (name == 'lastname')
      errors = validator.notNull().maxLen(40).errors
    else if (name == 'password')
      errors = validator.notNull().minLen(5).errors
    else if (name == 'repassword')
      errors = validator.sameAs(this.state.register.password).errors
    return errors
  }

  checkForm = (callback) => {
    let errors = {}
    for (let k in this.state.register) {
      errors[k] = this.validate(k)
    }
    this.setState({
      ...this.state,
      formErrors: errors
    })
  }

  onChange = (e) => {
    let name = e.target.name
    this.setState({
      ...this.state,
      register: {
        ...this.state.register,
        [name]: e.target.value
      }
    }, () => {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          [name]: this.validate(name)
        }
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.checkForm();
    const { dispatch } = this.props
  }

  render () {
    const { classes } = this.props
    const { locale } = this.props.locales
    const { formErrors } = this.state

    return (
      <div>
        <Typography color="primary" variant="h5">{locale.register.title}</Typography>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                error={formErrors.username.length ? true : false}
                helperText={locale.validator[formErrors.username[0]]}
                name="username"
                label={locale.global.username}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={formErrors.firstname.length ? true : false}
                helperText={locale.validator[formErrors.firstname[0]]}
                name="firstname"
                label={locale.global.firstname}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={formErrors.lastname.length ? true : false}
                helperText={locale.validator[formErrors.lastname[0]]}
                name="lastname"
                label={locale.global.lastname}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <input accept="image/*" id="contained-button-file" type="file" style={{display: 'none'}}/>
              <label htmlFor="contained-button-file">
                <Button color="primary" component="span" fullWidth>
                  {locale.register.upload}
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                name="email"
                label={locale.global.email}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={formErrors.password.length ? true : false}
                helperText={locale.validator[formErrors.password[0]]}
                type="password"
                name="password"
                label={locale.global.password}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={formErrors.repassword.length ? true : false}
                helperText={locale.validator[formErrors.repassword[0]]}
                type="password"
                name="repassword"
                label={locale.global.repassword}
                onChange={this.onChange}
                margin="normal"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            className={classes.button}
            fullWidth
          >
            {locale.register.btn}
          </Button>
        </form>
      </div>
    )
  }
}

const styles = {
  button: {
    marginTop: '10px'
  }
}

function mapStateToProps(state) {
  return state
}

let RegisterExport = Register
RegisterExport = withStyles(styles)(RegisterExport)
RegisterExport = connect(mapStateToProps)(RegisterExport)
export default RegisterExport