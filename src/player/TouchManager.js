import { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import NoSleep from 'nosleep.js/dist/NoSleep';
import { handleInitialTouch, setHasTouchStart } from '../store/actions';

class TouchManager extends Component {
  componentDidMount() {
    const { setTouchState, hasTouch } = this.props;
    if (hasTouch) {
      this.noSleep = new NoSleep();
      const enableNoSleep = () => this.noSleep.enable();
      window.addEventListener('touchstart', function touchStartCallback() {
        setTouchState();
        enableNoSleep();
        window.removeEventListener('touchstart', touchStartCallback);
      });
    }
  }

  render() {
    return '';
  }
}

TouchManager.propTypes = {
  setTouchState: propTypes.func.isRequired,
  hasTouch: propTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setTouchState: () => dispatch(handleInitialTouch()),
  setHasTouch: hasTouchStart => dispatch(setHasTouchStart(hasTouchStart)),
});

const mapStateToProps = state => ({
  hasTouch: state.player.hasTouchStart,
});

export default connect(mapStateToProps, mapDispatchToProps)(TouchManager);
