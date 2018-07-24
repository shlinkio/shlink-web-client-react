import deleteIcon from '@fortawesome/fontawesome-free-solid/faMinusCircle';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import DeleteServerModal from './DeleteServerModal';

export default class DeleteServerButton extends React.Component {
  state = { isModalOpen: false };

  render() {
    const { history, server } = this.props;

    return [
      (
        <span
          className={this.props.className}
          onClick={() => this.setState({ isModalOpen: true })}
        >
          <FontAwesomeIcon icon={deleteIcon} />
          <span className="aside-menu__item-text">Delete this server</span>
        </span>
      ),
      (
        <DeleteServerModal
          isOpen={this.state.isModalOpen}
          toggle={() => this.setState({ isModalOpen: !this.state.isModalOpen })}
          history={history}
          server={server}
        />
      )
    ];
  }
}