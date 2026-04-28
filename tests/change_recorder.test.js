import { jest } from "@jest/globals";

// Three.js-hez kapcsolódó modul mockolása a tesztekhez
jest.unstable_mockModule("../viewmodel/three_scene.js", () => ({
  fingerActions: [],
  setRecorder: jest.fn(),
  setSpace: jest.fn(),
  rendererNull: jest.fn(),
  rendererFull: jest.fn()
}));

describe("change_recorder functions", () => {
  let mod;

  beforeEach(async () => {
    // Tesztkörnyezethez szükséges DOM elemek létrehozása
    document.body.innerHTML = `
      <select id="chooserec"></select>
      <div id="noteContainer"></div>
      <div id="noteSlider"></div>
      <div id="formContainer"></div>
    `;

    // AudioContext mockolása, hogy a hangkezelés ne fusson valódi böngészős API-val
    Object.defineProperty(window, "AudioContext", {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation(() => ({}))
    });

    Object.defineProperty(window, "webkitAudioContext", {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation(() => ({}))
    });

    localStorage.clear();

    mod = await import("../viewmodel/change_recorder.js");
  });

  test("cover changes state from 0 to 1", () => {
    const button = document.createElement("button");
    button.dataset.state = "0";
    button.classList.add("btn0");

    mod.cover(button);

    expect(button.dataset.state).toBe("1");
    expect(button.classList.contains("btn1")).toBe(true);
    expect(button.classList.contains("btn0")).toBe(false);
  });

  test("cover changes state from 1 to 2", () => {
    const button = document.createElement("button");
    button.dataset.state = "1";
    button.classList.add("btn1");

    mod.cover(button);

    expect(button.dataset.state).toBe("2");
    expect(button.classList.contains("btn2")).toBe(true);
    expect(button.classList.contains("btn1")).toBe(false);
  });

  test("cover changes state from 2 to 0", () => {
    const button = document.createElement("button");
    button.dataset.state = "2";
    button.classList.add("btn2");

    mod.cover(button);

    expect(button.dataset.state).toBe("0");
    expect(button.classList.contains("btn0")).toBe(true);
    expect(button.classList.contains("btn2")).toBe(false);
  });

  test("fillRecorderDropdown stores recorders and adds unique options", () => {
    const data = [
      { RecorderID: "Alt" },
      { RecorderID: "Szoprán" },
      { RecorderID: "Alt" }
    ];

    mod.fillRecorderDropdown(data);

    const stored = JSON.parse(localStorage.getItem("recorders"));
    const options = document.querySelectorAll("#chooserec option");

    expect(stored).toEqual(data);
    expect(options.length).toBe(2);
    expect(options[0].value).toBe("Alt");
    expect(options[1].value).toBe("Szoprán");
  });

  test("fillRecorderDropdown handles empty data", () => {
    mod.fillRecorderDropdown([]);

    const stored = JSON.parse(localStorage.getItem("recorders"));
    const options = document.querySelectorAll("#chooserec option");

    expect(stored).toEqual([]);
    expect(options.length).toBe(0);
  });
});