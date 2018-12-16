import React, { Component } from 'react';

class LgbtStatus extends Component {
  render() {
    if (this.props.status === 1) {
      return (<span>
          <i className="em em-rainbow-flag"></i> LGBT not criminalized
        </span>);
    } else if (this.props.status === 0) {
      return (<span>
          <i className="em em em-grey_question"></i> Strict LGBT anti-propaganda laws / LGBT not everywhere legal
        </span>);
    } else if (this.props.status === -1) {
      return (<span>
          <i className="em em em-waving_black_flag"></i> LGBT illegal
        </span>
      );
    } else {
      return (<span>
          LGBT status not known
        </span>
      );
    }
  }
}

class ConflictStatus extends Component {
  render() {
    const style = {
      marginLeft: '1em',
    };
    if (this.props.status === 1) {
      return (<span style={style}>
          <i className="em em-warning"></i> Armed conflict in recent years on part of territory
        </span>);
    } else if (this.props.status === 2) {
      return (<span style={style}>
          <i className="em em-red_circle"></i> Major armed conflict in recent years on part of territory
        </span>);
    } else{
      return null;
    }
  }
}

class Country extends Component {
  render() {
    const specialFlagCountries = [
      'cn',
      'es',
      'de',
      'ru',
      'gb',
      'it',
      'jp',
      'kr',
      'fr',
      'us'
    ];

    let emojiClassName = 'em em-triangular_flag_on_post';
    if (this.props.alpha) {
      const alphaLower = this.props.alpha.toLowerCase();
      if (specialFlagCountries.includes(alphaLower)) {
        emojiClassName = `em em-${alphaLower}`;
      } else {
        emojiClassName = `em em-flag-${alphaLower}`;
      }
    }

    return (
			<div className="box">
				<article className="media">
          <div className="media-left">
            <i className={emojiClassName}></i>
          </div>
					<div className="media-content">
						<div className="content">
							<p>
                <strong>{this.props.countryName}</strong> <small>{this.props.rank}</small>
							</p>
              <p>
                <small>
                  <LgbtStatus status={this.props.lgbtLegal}/>
                  <ConflictStatus status={this.props.conflict}/>
                </small>
              </p>
						</div>
					</div>
				</article>
			</div>
    );
  }
}

export default Country;
