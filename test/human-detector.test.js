import { html, fixture, expect, fixtureCleanup } from "@open-wc/testing";
import sinon from "sinon";
import "../human-detector.js";

suite("<human-detector>", () => {
  let el;
  teardown(() => fixtureCleanup());

  test("Only humans can see the main block", async () => {
    // Create fixture of the element
    el = await fixture(html`<human-detector></human-detector>`);
    await el.updateComplete;

    // Keep a reference to the element shadow root
    const elShadowRoot = el.shadowRoot;

    // Keep the state before the checkbox is checked
    const visibleForNotHuman = elShadowRoot.querySelector("#mainBlock");

    const checkbox = elShadowRoot.querySelector("bbva-form-checkbox");
    //const checkbox = elShadowRoot.querySelector("#checkBoxBBVA");

    // Check the checkbox
    checkbox.click();
    await el.updateComplete;

    // Keep the state after the checkbox is checked
    const visibleForHuman = elShadowRoot.querySelector("#mainBlock");

    // Expect the main block was not in DOM before the checkbox was checked

    //expect(visibleForNotHuman).null;
    //expect(visibleForNotHuman).exist;
    expect(visibleForNotHuman).not.exist;

    // Expect the main block is in DOM after the checkbox was checked
    expect(visibleForHuman).exist;
    el.result = "asdf";
    expect(el.buttonVerifyDisabled);
  });

  test("continue button has correct text label", async () => {
    // Create fixture of the element
    el = await fixture(
      html`<human-detector continue-title="Get Document"></human-detector>`
    );
    await el.updateComplete;

    // Keep a reference to the element shadow root
    const elShadowRoot = el.shadowRoot;

    const checkbox = elShadowRoot.querySelector("bbva-form-checkbox");
    // Check the checkbox
    checkbox.click();
    await el.updateComplete;

    const button = elShadowRoot.querySelector("#continueButton");
    expect(button.innerText).equals("Get Document");
  });

  test("When the user clicks the continue button, it triggers the event continue-action", async () => {
    // Create fixture of the element
    el = await fixture(html`<human-detector></human-detector>`);
    await el.updateComplete;

    const elShadowRoot = el.shadowRoot;

    const checkbox = elShadowRoot.querySelector("bbva-form-checkbox");
    checkbox.click();
    await el.updateComplete;

    const verifyButton = elShadowRoot.querySelector("#verifyButton");
    const continueButton = elShadowRoot.querySelector("#continueButton");

    el.result = el.operand2 - el.operand1;

    verifyButton.click();
    await el.updateComplete;

    // Create an spy
    const spy = sinon.spy();

    // Call the spy as callback for the continue-action event
    el.addEventListener("continue-action", spy);

    continueButton.click();

    // Check the spy has been called after clicking the button which should fire the event
    expect(spy.called).to.be.true;
  });
});
