import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import queryString from 'query-string'
import Loading from '../../utils/jsx/Loading'
import req from '../../utils/req'
import host from '../../config'

class OAuth extends React.Component {

  state = {
    component: <Loading />
  }

  componentDidMount() {
    const { name } = this.props.match.params
    let token = ""

    console.log(this.props.location);

    switch (name) {
      case "github":
      case "42":
        token = queryString.parse(this.props.location.search).code
        break
      case "facebook":
        token = queryString.parse(this.props.location.hash.replace("#", "")).access_token
        break
      case "twitter":
        // Handle
        break
      case "gmail":
        // Handle
        break
      default:
        break
    }
    if (token !== undefined && token !== null) {
      req(host + "/api/users/oauth", {
      method: "POST",
      body: {
        api: name,
        token: token
      }
      }).then(res => {
        // Handle api response
        console.log(res)
        this.setState({
            component: <Redirect to={{pathname: '/', state: {from: this.props.location}}} />
        });
      }).catch(err => {
        // Handle errors
      })
    } else {
      window.location = host
    }
  }

  render() {
    const { auth } = this.props
    return (
      auth.logged ? <Redirect to={{pathname: '/', state: {from: this.props.location}}} /> : this.state.component
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(OAuth)