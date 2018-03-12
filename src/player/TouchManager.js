import { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { handleInitialTouch, setHasTouchStart } from '../store/actions';

class TouchManager extends Component {
  componentDidMount() {
    const { onTouch, hasTouch } = this.props;
    if (hasTouch) {
      window.addEventListener('touchstart', function touchStartCallback() {
        onTouch();
        window.removeEventListener('touchstart', touchStartCallback);
      });
    }
  }

  render() {
    return '';
  }
}

TouchManager.propTypes = {
  onTouch: propTypes.func.isRequired,
  hasTouch: propTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onTouch: () => dispatch(handleInitialTouch()),
  setHasTouch: hasTouchStart => dispatch(setHasTouchStart(hasTouchStart)),
});

const mapStateToProps = state => ({
  hasTouch: state.player.hasTouchStart,
});

export default connect(mapStateToProps, mapDispatchToProps)(TouchManager);
