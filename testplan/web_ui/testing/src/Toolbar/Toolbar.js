import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';
import {
  Button,
  Collapse,
  Navbar,
  Nav,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table
} from 'reactstrap';
import FilterBox from "../Toolbar/FilterBox";
import { STATUS, STATUS_CATEGORY } from "../Common/defaults";
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faInfo,
  faBook,
  faPrint,
  faFilter,
  faTags,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

import styles from "./navStyles";
import {
  InfoButton,
  FilterButton,
  TagsButton,
  HelpButton,
  DocumentationButton,
  PrintButton,
} from "./ToolbarButtons";


library.add(
  faInfo,
  faBook,
  faPrint,
  faFilter,
  faTags,
  faQuestionCircle,
);

/**
 * Toolbar component, contains the toolbar buttons & Filter box.
 */
class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      helpModal: false,
      filterOpen: false,
      infoModal: false,
      filter: 'all',
      displayEmpty: true,
      displayTags: false,
    };

    this.filterOnClick = this.filterOnClick.bind(this);
    this.toggleInfoOnClick = this.toggleInfoOnClick.bind(this);
    this.toggleEmptyDisplay = this.toggleEmptyDisplay.bind(this);
    this.toggleHelpOnClick = this.toggleHelpOnClick.bind(this);
    this.toggleTagsDisplay = this.toggleTagsDisplay.bind(this);
    this.toggleFilterOnClick = this.toggleFilterOnClick.bind(this);
  }

  toggleHelpOnClick() {
    this.setState(prevState => ({
      helpModal: !prevState.helpModal
    }));
  }

  toggleInfoOnClick() {
    this.setState(prevState => ({
      infoModal: !prevState.infoModal
    }));
  }

  toggleFilterOnClick() {
    this.setState(prevState => ({
      filterOpen: !prevState.filterOpen
    }));
  }

  filterOnClick(e) {
    let checkedValue = e.currentTarget.value;
    this.setState({ filter: checkedValue });
    this.props.updateFilterFunc(checkedValue);
  }

  toggleEmptyDisplay() {
    this.props.updateEmptyDisplayFunc(!this.state.displayEmpty);
    this.setState(prevState => ({
      displayEmpty: !prevState.displayEmpty
    }));
  }

  toggleTagsDisplay() {
    this.props.updateTagsDisplayFunc(!this.state.displayTags);
    this.setState(prevState => ({
      displayTags: !prevState.displayTags
    }));
  }

  /**
   * Return the navbar including all buttons.
   */
  navbar() {
    const toolbarStyle = getToolbarStyle(this.props.status);

    return (
      <Navbar light expand="md" className={css(styles.toolbar)}>
        <div className={css(styles.filterBox)}>
          <FilterBox handleNavFilter={this.props.handleNavFilter} />
        </div>
        <Collapse isOpen={this.state.isOpen} navbar className={toolbarStyle}>
          <Nav navbar className='ml-auto'>
            {this.props.extraButtons}
            <InfoButton toggleInfoOnClick={this.props.toggleInfoOnClick} />
            <FilterButton
              filter={this.state.filter}
              filterOnClick={this.filterOnClick}
              toolbarStyle={toolbarStyle}
            />
            <PrintButton />
            <TagsButton toggleTagsDisplay={this.toggleTagsDisplay} />
            <HelpButton toggleHelpOnClick={this.toggleHelpOnClick} />
            <DocumentationButton />
          </Nav>
        </Collapse>
      </Navbar>
    );
  }

  /**
   * Return the help modal.
   */
  helpModal() {
    return (
      <Modal
        isOpen={this.state.helpModal}
        toggle={this.toggleHelpOnClick}
        className='HelpModal'
      >
        <ModalHeader toggle={this.toggleHelpOnClick}>Help</ModalHeader>
        <ModalBody>
          This is filter box help!
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={this.toggleHelpOnClick}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  /**
   * Return the information modal.
   */
  infoModal() {
    return (
      <Modal
        isOpen={this.state.infoModal}
        toggle={this.toggleInfoOnClick}
        size='lg'
        className='infoModal'
      >
        <ModalHeader toggle={this.toggleInfoOnClick}>
          Information
        </ModalHeader>
        <ModalBody>
          {getInfoTable(this.props.report)}
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={this.toggleInfoOnClick}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  /**
   * Render the toolbar component.
   */
  render() {
    return (
      <div>
        {this.navbar()}
        {this.helpModal()}
        {this.infoModal()}
      </div>
    );
  }
}

/**
 * Get the current toolbar style based on the testplan status.
 */
const getToolbarStyle = (status) => {
  switch (STATUS_CATEGORY[status]) {
    case 'passed':
      return css(styles.toolbar, styles.toolbarPassed);
    case 'failed':
    case 'error':
      return css(styles.toolbar, styles.toolbarFailed);
    case 'unstable':
      return css(styles.toolbar, styles.toolbarUnstable);
    default:
      return css(styles.toolbar, styles.toolbarUnknown);
  }
};

/**
 * Get the metadata from the report and render it as a table.
 */
const getInfoTable = (report) => {
  if (!report || !report.information) {
    return "No information to display.";
  }
  const infoList = report.information.map((item, i) => {
    return (
      <tr key={i}>
        <td className={css(styles.infoTableKey)}>{item[0]}</td>
        <td className={css(styles.infoTableValue)}>{item[1]}</td>
      </tr>
    );
  });
  if (report.timer && report.timer.run) {
    if (report.timer.run.start) {
      infoList.push(
        <tr key='start'>
          <td>start</td>
          <td>{report.timer.run.start}</td>
        </tr>
      );
    }
    if (report.timer.run.end) {
      infoList.push(
        <tr key='end'>
          <td>end</td>
          <td>{report.timer.run.end}</td>
        </tr>
      );
    }
  }
  return (
    <Table bordered responsive className={css(styles.infoTable)}>
      <tbody>
        {infoList}
      </tbody>
    </Table>
  );
};

Toolbar.propTypes = {
  /** Testplan report's status */
  status: PropTypes.oneOf(STATUS),
  /** Report object to display information */
  report: PropTypes.object,
  /** Function to handle filter changing in the Filter box */
  updateFilterFunc: PropTypes.func,
  /** Function to handle toggle of displaying empty entries in the navbar */
  updateEmptyDisplayFunc: PropTypes.func,
  /** Function to handle toggle of displaying tags in the navbar */
  updateTagsDisplayFunc: PropTypes.func,
  /** Function to handle expressions entered into the Filter box */
  handleNavFilter: PropTypes.func,
};

export default Toolbar;
