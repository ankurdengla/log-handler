import React from 'react';

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

    return [...this.text.matchAll(new RegExp(this.searchTerm, 'gi'))].map(a => a.index);
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