import React, { Component } from 'react';
import marked from 'marked';

import './ModuleNotes.css';

export default class ModuleNotes extends Component {
    state = {
        isEditing: false,
        textValue: '',

    };

    handleChange = (event) => {
        this.setState({
            textValue: event.target.value,
        });
    }

    render() {
        return (
            <div className="module-notes">
                <div>
                    <button onClick={() => this.setState({ isEditing: true })}>Edit</button>
                    <button onClick={() => this.setState({ isEditing: false })}>View</button>
                </div>
                {this.state.isEditing
                    ? (<textarea value={this.state.textValue} onChange={this.handleChange}>
                    </textarea>)
                    : (<article dangerouslySetInnerHTML={{ __html: marked(this.state.textValue) }}>
                    </article>)
                }
            </div>
        );
    }
}

