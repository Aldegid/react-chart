import React from 'react';
import { withRouter } from 'react-router-dom';
import { lighten, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles({
  root: {
    height: 15,
    backgroundColor: lighten('#EB0055', 0.5),
    marginBottom: 15,
    borderRadius: 5
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#EB0055'
  }
})(LinearProgress);

const LinerDeterminate = ({ toggleProgress, progress, isPaused, history }) => {
  return (
    <div className='progress-container'>
      <BorderLinearProgress
        variant='determinate'
        value={progress}
        color='secondary'
      />
      <Button
        variant='contained'
        color='secondary'
        type='button'
        onClick={() => toggleProgress(history)}
      >
        {isPaused ? 'Play' : 'Pause'}
      </Button>
    </div>
  );
};

export default withRouter(LinerDeterminate);
