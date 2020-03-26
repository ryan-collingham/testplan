/**
 * Toolbar buttons. 
 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';
import { css } from 'aphrodite';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Label,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';

import styles from './navStyles';

/**
 * Return the info button which toggles the info modal.
 */
const InfoButton = (props) => {
  return (
    <NavItem>
      <div className={css(styles.buttonsBar)}>
        <FontAwesomeIcon
          key='toolbar-info'
          className={css(styles.toolbarButton)}
          icon='info'
          title='Info'
          onClick={props.toggleInfoOnClick}
        />
      </div>
    </NavItem>
  );
};

/**
 * Return the filter button which opens a drop-down menu.
 */
const FilterButton = (props) => {
  return (
    <UncontrolledDropdown nav inNavbar>
      <div className={css(styles.buttonsBar)}>
        <DropdownToggle nav className={props.toolbarStyle}>
          <FontAwesomeIcon
            key='toolbar-filter'
            icon='filter'
            title='Choose filter'
            className={css(styles.toolbarButton)}
          />
        </DropdownToggle>
      </div>
      <DropdownMenu className={css(styles.filterDropdown)}>
        <DropdownItem toggle={false}
          className={css(styles.dropdownItem)}>
          <Label check className={css(styles.filterLabel)}>
            <Input type="radio" name="filter" value='all'
              checked={props.filter === 'all'}
              onChange={props.filterOnClick}
            />
            {' '}
            All
          </Label>
        </DropdownItem>
        <DropdownItem toggle={false}
          className={css(styles.dropdownItem)}>
          <Label check className={css(styles.filterLabel)}>
            <Input type="radio" name="filter" value='fail'
              checked={props.filter === 'fail'}
              onChange={props.filterOnClick} />{' '}
            Failed only
          </Label>
        </DropdownItem>
        <DropdownItem toggle={false}
          className={css(styles.dropdownItem)}>
          <Label check className={css(styles.filterLabel)}>
            <Input type="radio" name="filter" value='pass'
              checked={props.filter === 'pass'}
              onChange={props.filterOnClick} />{' '}
            Passed only
          </Label>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem toggle={false}
          className={css(styles.dropdownItem)}>
          <Label check className={css(styles.filterLabel)}>
            <Input type="checkbox" name="displayEmptyTest"
              checked={!props.displayEmpty}
              onChange={props.toggleEmptyDisplay} />{' '}
            Hide empty testcase
          </Label>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

/**
 * Return the button which prints the current testplan.
 */
const PrintButton = () => {
  return (
    <NavItem>
      <div className={css(styles.buttonsBar)}>
        <FontAwesomeIcon
          key='toolbar-print'
          className={css(styles.toolbarButton)}
          icon='print'
          title='Print page'
          onClick={window.print}
        />
      </div>
    </NavItem>
  );
};

/**
 * Return the button which toggles the display of tags.
 */
const TagsButton = (props) => {
  return (
    <NavItem>
      <div className={css(styles.buttonsBar)}>
        <FontAwesomeIcon
          key='toolbar-tags'
          className={css(styles.toolbarButton)}
          icon='tags'
          title='Toggle tags'
          onClick={props.toggleTagsDisplay}
        />
      </div>
    </NavItem>
  );
};

/**
 * Return the button which toggles the help modal.
 */
const HelpButton = (props) => {
  return (
    <NavItem>
      <div className={css(styles.buttonsBar)}>
        <FontAwesomeIcon
          key='toolbar-question'
          className={css(styles.toolbarButton)}
          icon='question-circle'
          title='Help'
          onClick={props.toggleHelpOnClick}
        />
      </div>
    </NavItem>
  );
};

/**
 * Return the button which links to the documentation.
 */
const DocumentationButton = () => {
  return (
    <NavItem>
      <a href='http://testplan.readthedocs.io'
        rel='noopener noreferrer' target='_blank'
        className={css(styles.buttonsBar)}>
        <FontAwesomeIcon
          key='toolbar-document'
          className={css(styles.toolbarButton)}
          icon='book'
          title='Documentation'
        />
      </a>
    </NavItem>
  );
};

/**
 * Render a button to trigger the report state to be reset.
 *
 * If the reset action is currently in progress, display a spinning icon
 * instead.
 */
const ResetButton = (props) => {
  if (props.resetting) {
    return (
      <NavItem key="reset-button" >
        <div className={css(styles.buttonsBar)}>
          <FontAwesomeIcon
            key='toolbar-reset'
            className={css(styles.toolbarButton, styles.toolbarInactive)}
            icon={faBackspace}
            title='Resetting...'
          />
        </div>
      </NavItem>
    );
  } else {
    return (
      <NavItem key="reset-button" >
        <div className={css(styles.buttonsBar)}>
          <FontAwesomeIcon
            key='toolbar-reset'
            className={css(styles.toolbarButton)}
            icon={faBackspace}
            title='Reset state'
            onClick={props.resetStateCbk}
          />
        </div>
      </NavItem>
    );
  }
};

export {
  InfoButton,
  FilterButton,
  TagsButton,
  HelpButton,
  DocumentationButton,
  PrintButton,
  ResetButton,
};
