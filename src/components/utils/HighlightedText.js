import React from 'react';
import _ from 'lodash';

export default class HighlightedText extends React.Component {
  constructor (props) {
    super(props);

    this.text = props.text;
    this.searchTerm = props.searchTerm;
    this.matchIndices = this.getMatches();
  }

  getMatches () {
    if (!this.text || !this.searchTerm) {
      return [];
    }

    let regExp = new RegExp( _.escapeRegExp(this.searchTerm), 'gi');

    return [...this.text.matchAll(regExp)].map(a => a.index);
  }

  getHighlightedText () {
    let text = this.text,
      resultArr = [],
      lastProcessedIndex = 0;

    this.matchIndices.forEach((startIndex) => {
      let normalText = text.substr(lastProcessedIndex, startIndex - lastProcessedIndex),
        highlightedText = text.substr(startIndex, this.searchTerm.length);

      lastProcessedIndex = startIndex + this.searchTerm.length;

      resultArr.push(<span>{normalText}</span>);
      resultArr.push(<mark>{highlightedText}</mark>);
    });

    resultArr.push(<span>{text.substr(lastProcessedIndex)}</span>);

    return resultArr;
  }

  render() {
    return this.getHighlightedText();
  }
}