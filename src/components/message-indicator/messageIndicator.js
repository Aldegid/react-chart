import React from 'react';
import { Link } from 'react-router-dom';
import './message-indicator.css';

const mesageIndicator = props => {
  return (
    <div className='main-text'>
      <h1>{props.children}</h1>
      {props.handleClickHome ? (
        <Link to='/' onClick={props.handleClickHome} className='home-link'>
          Go Home
        </Link>
      ) : null}
    </div>
  );
};

export default mesageIndicator;
