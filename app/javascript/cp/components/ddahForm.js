import React from 'react';
import { Table, Button } from 'react-bootstrap';

class DdahForm extends React.Component {
    render() {
        let ddah = this.props.appState.getDdah();

        return (
            <div id="ddah-container">
                <h3>Description of Duties and Allocation of Hours Form</h3>
                <Header ddah={ddah} {...this.props} />
                <Worksheet ddah={ddah} {...this.props} />
                <Training ddah={ddah} {...this.props} />
                <Summary {...this.props} />
            </div>
        );
    }
}

const Header = props => {
    // check whether ddah for course was selected, and if so, get the course details
    let course = props.selectedDdah.startsWith('C')
        ? props.appState.getCoursesList().get(props.selectedDdah.slice(1))
        : null;

    return (
        <div id="ddah-header">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <b>Department:</b>
                        </td>
                        <td>
                            <input type="text" readOnly value="Computer Science" />
                        </td>
                        <td>
                            <b>Supervising Professor:</b>
                        </td>
                        <td>
                            <select
                                onChange={event =>
                                    props.appState.updateDdah('supervisor', event.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Course Code:</b>
                        </td>
                        <td>
                            <input type="text" readOnly value={course ? course.get('code') : ''} />
                        </td>
                        <td>
                            <b>Est. Enrolment / TA:</b>
                        </td>
                        <td>
                            <input
                                type="number"
                                readOnly
                                value={
                                    course && course.get('estimatedEnrol') != null
                                        ? course.get('estimatedEnrol') /
                                          props.appState.getOffersForCourse(
                                              props.selectedDdah.slice(1)
                                          ).size
                                        : ''
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Course Title:</b>
                        </td>
                        <td>
                            <input type="text" readOnly value={course ? course.get('name') : ''} />
                        </td>
                        <td>
                            <b>Expected Enrolment:</b>
                        </td>
                        <td>
                            <input
                                type="number"
                                readOnly
                                value={
                                    course && course.get('estimatedEnrol') != null
                                        ? course.get('estimatedEnrol')
                                        : ''
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Tutorial Category:</b>
                        </td>
                        <td>
                            <input
                                type="text"
                                value={
                                    props.ddah.get('tutCategory') != null
                                        ? props.ddah.get('tutCategory')
                                        : ''
                                }
                                onChange={event =>
                                    props.appState.updateDdah('tutCategory', event.target.value)}
                            />
                        </td>
                        <td rowSpan="2">
                            <small>
                                Requires Training for Scaling Learning<br />Activities to Size of
                                Tutorial
                            </small>
                        </td>
                        <td rowSpan="2">
                            <input
                                type="checkbox"
                                checked={props.ddah.get('requiresTraining') == true}
                                onChange={event =>
                                    props.appState.updateDdah(
                                        'requiresTraining',
                                        event.target.checked
                                    )}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td />
                        <td>
                            <input
                                type="radio"
                                name="optional"
                                checked={props.ddah.get('optional') == true}
                                onChange={event =>
                                    props.appState.updateDdah('optional', event.target.checked)}
                            />&nbsp;Optional&emsp;
                            <input
                                type="radio"
                                name="optional"
                                checked={props.ddah.get('optional') == false}
                                onChange={event =>
                                    props.appState.updateDdah('optional', !event.target.checked)}
                            />&nbsp;Mandatory
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const Worksheet = props =>
    <Table condensed hover id="worksheet-table">
        <thead>
            <tr className="title">
                <th colSpan="5">Allocation of Hours Worksheet</th>
            </tr>
            <tr>
                <th># of Units</th>
                <th>Type of Duties</th>
                <th>
                    Type of Unit<br />
                    <small>(e.g. assignments, tutorials, meetings, etc.)</small>
                </th>
                <th>
                    Time/Task<br />
                    <small>(minutes)</small>
                </th>
                <th>
                    Total Time<br />
                    <small>(hours)</small>
                </th>
            </tr>
        </thead>
        <tbody>
            {props.ddah.get('worksheet').map((row, i) =>
                <tr key={'allocation-' + i}>
                    <td>
                        <input
                            type="number"
                            min="0"
                            value={row.get('units') != null ? row.get('units') : ''}
                            onChange={event =>
                                props.appState.updateDdahAllocation(i, 'units', event.target.value)}
                        />
                    </td>
                    <td>
                        <select
                            value={row.get('duty') != null ? row.get('duty') : ''}
                            onChange={event =>
                                props.appState.updateDdahAllocation(i, 'duty', event.target.value)}>
                            <option />
                            {props.appState.getDutiesList().map((duty, id) =>
                                <option value={id}>
                                    {duty}
                                </option>
                            )}
                        </select>
                    </td>
                    <td>
                        <input
                            type="text"
                            autoComplete="on"
                            value={row.get('type') != null ? row.get('type') : ''}
                            onChange={event =>
                                props.appState.updateDdahAllocation(i, 'type', event.target.value)}
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            min="0"
                            value={row.get('time') != null ? row.get('time') : ''}
                            onChange={event =>
                                props.appState.updateDdahAllocation(i, 'time', event.target.value)}
                        />
                    </td>
                    <td>
                        {(row.get('units') * row.get('time') / 60).toFixed(1)}
                        <i
                            className="fa fa-minus-circle delete-button"
                            title="Delete row"
                            onClick={() => props.appState.removeAllocation(i)}
                        />
                    </td>
                </tr>
            )}

            <tr>
                <td colSpan="5" style={{ backgroundColor: 'white', textAlign: 'left' }}>
                    <Button
                        bsSize="small"
                        bsStyle="info"
                        onClick={() => props.appState.addAllocation()}>
                        <b>+ Add row</b>
                    </Button>
                </td>
            </tr>

            <tr>
                <td>
                    <b>Total</b>
                </td>
                <td />
                <td />
                <td />
                <td>
                    {props.appState.getDdahTotal().toFixed(1)}
                </td>
            </tr>
        </tbody>
    </Table>;

const Training = props => {
    let trainings = props.appState.getTrainingsList(),
        categories = props.appState.getCategoriesList();

    return (
        <div id="training">
            <table>
                <thead>
                    <tr className="title">
                        <th colSpan="2">Training</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <table className="sub-table">
                                <tbody>
                                    {trainings.map((training, i) =>
                                        <tr>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={props.ddah
                                                        .get('trainings')
                                                        .includes(parseInt(i))}
                                                    onChange={event =>
                                                        props.appState.updateDdah('trainings', i)}
                                                />&nbsp;{training}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table className="sub-table">
                                <tbody>
                                    <tr>
                                        <td>Indicate Tutorial Category (1 primary activity)</td>
                                    </tr>
                                    {categories.map((category, i) =>
                                        <tr>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={props.ddah
                                                        .get('categories')
                                                        .includes(parseInt(i))}
                                                    onChange={event =>
                                                        props.appState.updateDdah('categories', i)}
                                                />&nbsp;{category}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const Summary = props => {
    let duties = props.appState.getDutiesList();

    return (
        <Table condensed id="summary-table">
            <thead>
                <tr className="title">
                    <th colSpan="2">Allocation of Hours Summary</th>
                </tr>
                <tr>
                    <th>Duties</th>
                    <th>
                        Time<br />
                        <small>(hours)</small>
                    </th>
                </tr>
            </thead>
            <tbody>
                {props.appState.computeDutiesSummary().map((duty, i) =>
                    <tr key={'duty-' + i}>
                        <td>
                            {duties.get(i)}
                        </td>
                        <td>
                            {duty.toFixed(1)}
                        </td>
                    </tr>
                )}
                <tr>
                    <td>
                        <b>Total</b>
                    </td>
                    <td>
                        {props.appState.getDdahTotal().toFixed(1)}
                    </td>
                </tr>
            </tbody>
        </Table>
    );
};

export { DdahForm };