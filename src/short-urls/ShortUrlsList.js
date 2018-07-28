import caretDownIcon from '@fortawesome/fontawesome-free-solid/faCaretDown';
import caretUpIcon from '@fortawesome/fontawesome-free-solid/faCaretUp';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { isEmpty } from 'ramda';
import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Tag from '../utils/Tag';
import { RowMenu } from './helpers/ShortUrlsRowMenu';
import { listShortUrls } from './reducers/shortUrlsList';
import './ShortUrlsList.scss';

export class ShortUrlsList extends React.Component {
  refreshList = extraParams => {
    const { listShortUrls, shortUrlsListParams, match: { params } } = this.props;
    listShortUrls(params.serverId, {
      ...shortUrlsListParams,
      ...extraParams
    });
  };

  constructor(props) {
    super(props);

    const orderBy = props.shortUrlsListParams.orderBy;
    this.state = {
      orderField: orderBy ? Object.keys(orderBy)[0] : 'dateCreated',
      orderDir: orderBy ? Object.values(orderBy)[0] : 'ASC',
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.refreshList({ page: params.page });
  }

  render() {
    const orderBy = field => {
      const newOrderDir = this.state.orderField !== field ? 'ASC' : (this.state.orderDir === 'DESC' ? 'ASC' : 'DESC');
      this.setState({ orderField: field, orderDir: newOrderDir });
      this.refreshList({ orderBy: { [field]: newOrderDir } })
    };
    const renderOrderIcon = field => {
      if (this.state.orderField !== field) {
          return null;
      }

      return (
        <FontAwesomeIcon
          icon={this.state.orderDir === 'ASC' ? caretUpIcon : caretDownIcon}
          className="short-urls-list__header-icon"
        />
      );
    };

    return (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th
              className="short-urls-list__header short-urls-list__header--with-action"
              onClick={() => orderBy('dateCreated')}
            >
              {renderOrderIcon('dateCreated')}
              Created at
            </th>
            <th
              className="short-urls-list__header short-urls-list__header--with-action"
              onClick={() => orderBy('shortCode')}
            >
              {renderOrderIcon('shortCode')}
              Short URL
            </th>
            <th
              className="short-urls-list__header short-urls-list__header--with-action"
              onClick={() => orderBy('originalUrl')}
            >
              {renderOrderIcon('originalUrl')}
              Original URL
            </th>
            <th className="short-urls-list__header">Tags</th>
            <th
              className="short-urls-list__header short-urls-list__header--with-action"
              onClick={() => orderBy('visits')}
            >
              <span className="nowrap">{renderOrderIcon('visits')} Visits</span>
            </th>
            <th className="short-urls-list__header">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {this.renderShortUrls()}
        </tbody>
      </table>
    );
  }

  renderShortUrls() {
    const { shortUrlsList, selectedServer, loading, error } = this.props;
    if (error) {
      return <tr><td colSpan="6" className="text-center table-danger">Something went wrong while loading short URLs :(</td></tr>;
    }

    if (loading) {
      return <tr><td colSpan="6" className="text-center">Loading...</td></tr>;
    }

    if (! loading && isEmpty(shortUrlsList)) {
      return <tr><td colSpan="6" className="text-center">No results found</td></tr>;
    }

    return shortUrlsList.map(shortUrl => (
      <Row shortUrl={shortUrl} selectedServer={selectedServer} key={shortUrl.shortCode} />
    ));
  }

  static renderTags(tags) {
    if (isEmpty(tags)) {
      return <i className="nowrap"><small>No tags</small></i>;
    }

    return tags.map(tag => <Tag text={tag} />);
  }
}

class Row extends React.Component {
  state = { displayMenu: false, copiedToClipboard: false };

  render() {
    const { shortUrl, selectedServer } = this.props;
    const completeShortUrl = !selectedServer ? shortUrl.shortCode : `${selectedServer.url}/${shortUrl.shortCode}`;

    return (
      <tr
        onMouseEnter={() => this.setState({ displayMenu: true })}
        onMouseLeave={() => this.setState({ displayMenu: false })}
      >
        <td className="nowrap short-urls-list__cell">
          <Moment format="YYYY-MM-DD HH:mm" interval={0}>{shortUrl.dateCreated}</Moment>
        </td>
        <td className="short-urls-list__cell">
          <a href={completeShortUrl} target="_blank">{completeShortUrl}</a>
        </td>
        <td className="short-urls-list__cell short-urls-list__cell--relative">
          <a href={shortUrl.originalUrl} target="_blank">{shortUrl.originalUrl}</a>
          <small
            className="badge badge-warning short-urls-list__copy-hint"
            hidden={!this.state.copiedToClipboard}
          >
            Copied short URL!
          </small>
        </td>
        <td className="short-urls-list__cell">{ShortUrlsList.renderTags(shortUrl.tags)}</td>
        <td className="short-urls-list__cell text-right">{shortUrl.visitsCount}</td>
        <td className="short-urls-list__cell">
          <RowMenu
            display={this.state.displayMenu}
            shortUrl={completeShortUrl}
            onCopyToClipboard={() => {
              this.setState({ copiedToClipboard: true });
              setTimeout(() => this.setState({ copiedToClipboard: false }), 2000);
            }}
          />
        </td>
      </tr>
    )
  }
}

export default connect(state => ({
  selectedServer: state.selectedServer,
  shortUrlsListParams: state.shortUrlsListParams,
}), { listShortUrls })(ShortUrlsList);
