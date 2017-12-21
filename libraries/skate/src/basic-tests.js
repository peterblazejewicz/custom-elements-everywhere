/**
 * @license
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { h, render } from "preact";
import expect from "expect";
import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithUnregistered,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent
} from "./components";

// Setup the test harness. This will get cleaned out with every test.
let app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);
let scratch; // This will hold the actual element under test.

beforeEach(function() {
  scratch = document.createElement("div");
  scratch.id = "scratch";
  app.appendChild(scratch);
});

afterEach(function() {
  app.innerHTML = "";
  scratch = null;
});

describe("basic support", function() {

  describe("no children", function() {
    it("can display a Custom Element with no children", async function() {
      this.weight = 3;
      let root = document.createElement('component-without-children');
      scratch.appendChild(root);
      await Promise.resolve();
      let wc = root.shadowRoot.querySelector("#wc");
      expect(wc).toExist();
    });
  });

  describe("with children", function() {
    function expectHasChildren(wc) {
      expect(wc).toExist();
      let shadowRoot = wc.shadowRoot;
      let heading = shadowRoot.querySelector("h1");
      expect(heading).toExist();
      expect(heading.textContent).toEqual("Test h1");
      let paragraph = shadowRoot.querySelector("p");
      expect(paragraph).toExist();
      expect(paragraph.textContent).toEqual("Test p");
    }

    it("can display a Custom Element with children in a Shadow Root", async function() {
      this.weight = 3;
      let root = document.createElement('component-with-children');
      scratch.appendChild(root);
      await Promise.resolve();
      let wc = root.shadowRoot.querySelector("#wc");
      expectHasChildren(wc);
    });

    it("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", async function() {
      this.weight = 3;
      let root = document.createElement('component-with-children-rerender');
      scratch.appendChild(root);
      await Promise.resolve();
      let wc = root.shadowRoot.querySelector("#wc");
      expectHasChildren(wc);
      await Promise.resolve();
      expect(wc.textContent.includes("2")).toEqual(true);
    });

    it("can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element", async function() {
      this.weight = 3;
      let root = document.createElement('component-with-different-views');
      scratch.appendChild(root);
      await Promise.resolve();
      let wc = root.shadowRoot.querySelector("#wc");
      expectHasChildren(wc);
      root.toggle();
      await Promise.resolve();
      let dummy = root.shadowRoot.querySelector("#dummy");
      expect(dummy).toExist();
      expect(dummy.textContent).toEqual("Dummy view");
      root.toggle();
      await Promise.resolve();
      wc = root.shadowRoot.querySelector("#wc");
      expectHasChildren(wc);
    });
  });

  describe("attributes and properties", function() {

    let root;
    let wc;

    beforeEach(async function() {
      root = document.createElement('component-with-properties');
      scratch.appendChild(root);
      await Promise.resolve();
      wc = root.shadowRoot.querySelector("#wc");
    });

    it("will pass boolean data as either an attribute or a property", async function() {
      this.weight = 3;
      let data = wc.bool || wc.hasAttribute("bool");
      expect(data).toBe(true);
    });

    it("will pass numeric data as either an attribute or a property", async function() {
      this.weight = 3;
      let data = wc.num || wc.getAttribute("num");
      expect(data).toEqual(42);
    });

    it("will pass string data as either an attribute or a property", async function() {
      this.weight = 3;
      let data = wc.str || wc.getAttribute("str");
      expect(data).toEqual("Skate");
    });
  });

  describe("events", function() {
    it("can imperatively listen to a DOM event dispatched by a Custom Element", async function() {
      this.weight = 3;
      let root = document.createElement('component-with-imperative-event');
      scratch.appendChild(root);
      await Promise.resolve();
      let wc = root.shadowRoot.querySelector("#wc");
      expect(wc).toExist();
      let handled = root.shadowRoot.querySelector("#handled");
      expect(handled.textContent).toEqual("false");
      wc.click();
      await Promise.resolve();
      expect(handled.textContent).toEqual("true");
    });
  });

});
