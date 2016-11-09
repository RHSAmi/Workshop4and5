import {unixTimeToString} from '../util.js';
import React from 'react';
import {Link} from 'react-router';
import {likeComment} from '../server.js';
import {unlikeComment} from '../server.js';

export default class Comment extends React.Component {

  constructor(contents) {
   super(contents);
   this.feedID = contents.feedID;
   this.commentId = contents.commentID;
   this.state = contents.data;
}

  handleLikeClick(clickEvent) {
    // Stop the event from propagating up the DOM
    // tree, since we handle it here. Also prevents
    // the link click from causing the page to scroll to the top.
    clickEvent.preventDefault();
    // 0 represents the 'main mouse button' --
    // typically a left click
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
    if (clickEvent.button === 0) {
      // Callback function for both the like and unlike cases.
      var callbackFunction = (newLikeCounter) => {
        // setState will overwrite the 'likeCounter'
        // field on the current state, and will keep
        // the other fields in-tact. This is called a
        // shallow merge:
        // https://facebook.github.io/react/docs/component-api.html#setstate
        this.setState({likeCounter: newLikeCounter});
      };
      if (this.didUserLike()) {
        // User clicked 'unlike' button.
        unlikeComment(this.commentId, 4, callbackFunction, this.feedID, this);
      } else {
        // User clicked 'like' button.
        likeComment(this.commentId, 4, (newLikeCounter) => {this.setState({likeCounter: newLikeCounter});}, this.feedID, this);
      }
    }
  }

  /**
   * Returns 'true' if the user liked the item.
   * Returns 'false' if the user has not liked the item.
   */
  didUserLike() {
    var likeCounter = this.state.likeCounter;
    var liked = false;
    // Look for a likeCounter entry with userId 4 -- which is the
    // current user.
    for (var i = 0; i < likeCounter.length; i++) {
      if (likeCounter[i] === 4) {
        liked = true;
        break;
      }
    }
    return liked;
}

  render() {
    var likeButtonText = "Like";
    if (this.didUserLike()) {
      likeButtonText = "Unlike";
    }
    return (
      <div>
        <div className="media-left media-top">
          PIC
        </div>
        <div className="media-body">
          <Link to={"/profile/" + this.props.author._id}>
            {this.props.author.fullName}
          </Link> {this.props.children}
          <br /><a href="#" onClick={(e) => this.handleLikeClick(e)}>
          <span className="glyphicon glyphicon-thumbs-up"></span>
          {likeButtonText}
          </a> · <a href="#">Reply</a>·{unixTimeToString(this.props.postDate)}
        </div>
      </div>
    );
  }
}
