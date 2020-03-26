/**
 * Unit tests for the InteractiveButtons module
 */
import React from "react";
import { shallow } from "enzyme";
import { StyleSheetTestUtils } from "aphrodite";

import {
  InfoButton,
  FilterButton,
  TagsButton,
  HelpButton,
  DocumentationButton,
  PrintButton,
  ResetButton,
} from "../ToolbarButtons";

beforeEach(() => {
  // Stop Aphrodite from injecting styles, this crashes the tests.
  StyleSheetTestUtils.suppressStyleInjection();
});

afterEach(() => {
  // Resume style injection once test is finished.
  StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
});

describe("InfoButton", () => {
  it("Renders a clickable info button", () => {
    const toggleInfo = jest.fn();
    const button = shallow(
      <InfoButton toggleInfoOnClick={toggleInfo} />
    );
    expect(button).toMatchSnapshot();
    button.find({ title: "Info" }).simulate("click");
    expect(toggleInfo.mock.calls).toHaveLength(1);
  });
});

describe("FilterButton", () => {
  it("Renders a filter dropdown", () => {
    const filterCbk = jest.fn();
    const button = shallow(
      <FilterButton
        filter="all"
        filterOnClick={filterCbk}
        toolbarStyle="passed"
      />
    );
    expect(button).toMatchSnapshot();
  });
});

describe("TagsButton", () => {
  it("Renders a clickable tags button", () => {
    const toggleTags = jest.fn();
    const button = shallow(
      <TagsButton toggleTagsDisplay={toggleTags} />
    );
    expect(button).toMatchSnapshot();
    button.find({ title: "Toggle tags" }).simulate("click");
    expect(toggleTags.mock.calls).toHaveLength(1);
  });
});

describe("HelpButton", () => {
  it("Renders a clickable help button", () => {
    const toggleHelp = jest.fn();
    const button = shallow(
      <HelpButton toggleHelpOnClick={toggleHelp} />
    );
    expect(button).toMatchSnapshot();
    button.find({ title: "Help" }).simulate("click");
    expect(toggleHelp.mock.calls).toHaveLength(1);
  });
});

describe("DocumentationButton", () => {
  it("Renders a clickable documentation button", () => {
    const button = shallow(<DocumentationButton />);
    expect(button).toMatchSnapshot();
  });
});

describe("PrintButton", () => {
  it("Renders a clickable documentation button", () => {
    const button = shallow(<PrintButton />);
    expect(button).toMatchSnapshot();
  });
});

describe("ResetButton", () => {
  it("Renders a clickable button", () => {
    const resetCbk = jest.fn();
    const button = shallow(
      <ResetButton resetStateCbk={resetCbk} resetting={false} />
    );
    expect(button).toMatchSnapshot();
    button.find({ title: "Reset state" }).simulate("click");
    expect(resetCbk.mock.calls.length).toBe(1);
  });

  it("Renders a spinning icon when reset is in-progress", () => {
    const resetCbk = jest.fn();
    const button = shallow(
      <ResetButton resetStateCbk={resetCbk} resetting={true} />
    );
    expect(button).toMatchSnapshot();
  });
});
