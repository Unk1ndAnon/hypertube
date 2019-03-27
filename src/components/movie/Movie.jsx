import React from 'react'
import { Typography, Grid, Paper } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon';
import req from '../../utils/req'

class Movie extends React.Component {

  state = {
    movie: {
      genres: []
    }
  }

  parseYtLink(link) {
    let res = link.split('?v=')
    if (res[1])
      res = res[1]
    return 'https://www.youtube.com/embed/' + res
  }

  pad = nbr => {
    return nbr > 0 && nbr < 10 ? '0' + nbr : nbr;
  }

  fetchMovie = (id) => {
    if (id[0] == 't') {
      req('https://tv-v2.api-fetch.website/movie/' + id)
      .then(res => {
        this.setState({movie: {
          image: res.images.poster,
          title: res.title,
          synopsis: res.synopsis,
          genres: res.genres,
          year: res.year,
          time: parseInt(res.runtime / 60) + 'h' + this.pad(res.runtime % 60),
          trailer: this.parseYtLink(res.trailer)
        }})
      })
    } else {
      req('https://yts.am/api/v2/movie_details.json?movie_id=' + id)
      .then(res => {
        res = res.data.movie
        this.setState({movie: {
          image: res.large_cover_image,
          title: res.title,
          synopsis: res.description_intro,
          genres: res.genres,
          year: res.year,
          time: parseInt(res.runtime / 60) + 'h' + this.pad(res.runtime % 60),
          trailer: this.parseYtLink(res.yt_trailer_code)
        }})
      })
    }
  }

  componentWillMount() {
    const id = this.props.match.params.id
    this.fetchMovie(id)
    var ifr = document.getElementById('ytplayer')
    if (ifr) {
      ifr.contentWindow.location.replace('http://google.com')
    }
  }

  render() {
    const { movie } = this.state
    const { classes } = this.props
    const { locale } = this.props.locales
    return (
      <div>
        <Typography variant="h5" color="primary" style={{marginBottom:'15px'}}>{movie.title}</Typography>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={5} md={5}>
            <img className={classes.img} src={movie.image} width="100%"/>
          </Grid>
          <Grid item xs={12} sm={7} md={7}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>format_align_left</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.synopsis}</Typography>
                  <Typography color="textPrimary">{movie.synopsis}</Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>movie_creation</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.production}</Typography>
                  <Typography color="textPrimary">{movie.year}</Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>timer</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.time}</Typography>
                  <Typography color="textPrimary">{movie.time}</Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>local_movies</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.genres}</Typography>
                  {movie.genres.map(genre => {
                    return <Typography color="textPrimary" key={genre}>
                      {locale.genres[genre.toLowerCase()]}
                    </Typography>
                  })}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.paper}>
                  <Icon color="primary" style={{float:'right'}}>play_arrow</Icon>
                  <Typography variant="button" color="primary" style={{marginBottom:'10px'}}>{locale.movie.trailer}</Typography>
                  <iframe id="ytplayer" type="text/html" src={movie.trailer} frameBorder="0" className={classes.frame} allowFullScreen="1"/>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const styles = theme => ({
  img: {
    borderRadius:'5px',
    overflow:'hidden'
  },
  paper: {
    background: theme.palette.secondary.dark,
    height:'100%',
    borderRadius: '5px',
    padding:'15px 20px',
    overflow:'hidden'
  },
  frame: {
    margin: '0 -20px -19px -20px',
    width: 'calc(100% + 40px)',
    height: '20vw',
    minHeight: '250px'
  }
})
const mapStateToProps = state => { return state }
let MovieExport = Movie
MovieExport = withStyles(styles)(MovieExport)
MovieExport = connect(mapStateToProps)(MovieExport)
export default MovieExport
