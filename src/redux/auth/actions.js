import { alert } from '../snackbars/actions'
import req from '../../utils/req'
import Cookies from 'js-cookie'
import host from '../../config'

export function login(data, callback) {

  data.email = data.username
  let auth = {}

  return (dispatch, getState) => {
    const { isFetching } = getState().auth
    if (!isFetching) {
      dispatch(authFetching(true))
      req(host + '/api/login_check', {
        method: 'post', body: data
      })
      .then(res => {
        auth.token = res.token
        Cookies.set('jwt', auth.token)
        dispatch(getCurrentUser())
        dispatch(alert('LOGIN_SUCCESS', 'success'))
        if (callback) callback()
      })
      .catch(() => {
        dispatch(authFetching(false))
      })
    }
  }
}

export function authFetching(state) {
  return {
    type: 'AUTH_FETCHING',
    state: state
  }
}

export function logout() {
  Cookies.remove('jwt')
  return {
    type: 'LOGOUT'
  }
}

export function getCurrentUser() {
  return (dispatch) => {
    if (Cookies.get('jwt')) {
      req(host + '/api/users/me', {useToken: true})
      .then(res => {
        let id = res['@id'].split('id=')
        res.id = id[1]
        dispatch(setCurrentUser(res))
      })
      .catch(err => {
        dispatch(logout())
      })
    } else {
      dispatch(setCurrentUser())
    }
  }

  function setCurrentUser(user) {
    return {
      type: 'SET_CURRENT_USER',
      user: user,
      logged: user ? true : false,
    }
  }
}
