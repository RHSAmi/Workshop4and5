import React from 'react';
import {getFeedData} from '../server';
import FeedItem from './feeditem';
import {postStatusUpdate} from '../server';
import StatusUpdateEntry from './statusupdateentry';
export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: []
    };
  }

  refresh() {
    getFeedData(this.props.user, (feedData) => {
      this.setState(feedData);
    });
  }

  onPost(postContents) {
    // Send to server.
    // We could use geolocation to get a location,
    // but let's fix it to Amherst for now.
    postStatusUpdate(4, "Amherst, MA", postContents, () => {
      // Database is now updated. Refresh the feed.
      this.refresh();
    });
  }

  componentDidMount() {
    this.refresh();
  }

  render() {
    return (
      <div>
        <StatusUpdateEntry onPost={(postContents) => this.onPost(postContents)} />
        {this.state.contents.map((feedItem) => {
          return (
            <FeedItem key={feedItem._id} data={feedItem} />
          )
        })}
        </div>
    )
  }
}
