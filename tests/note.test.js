import { drawNote, playNote } from "../viewmodel/note_utils.js";
import { jest } from "@jest/globals";

// drawNote függvény tesztelése (hang pozíció és módosítójelek)
describe("drawNote function", () => {

    test("returns correct values for C", () => {
        const data = { note: "C" };
        const result = drawNote(data);
        expect(result).toEqual({ octav: 80, accidentals: null });
    });

    test("returns correct values for C#", () => {
        const data = { note: "C#" };
        const result = drawNote(data);
        expect(result).toEqual({ octav: 80, accidentals: true });
    });

    test("returns correct values for C#'", () => {
        const data = { note: "C#'" };
        const result = drawNote(data);
        expect(result).toEqual({ octav: 45, accidentals: true });
    });

});

// playNote függvény tesztelése (frekvencia számítás és lejátszás)
describe("playNote function", () => {
    const fakePlay = jest.fn(); // Mock lejátszó függvény

    test("plays a note without accidentals", () => {
        const data = "C";
        const result = playNote(data, fakePlay);
        expect(result.freq).toBeCloseTo(523.25, 1);
        expect(result.accidental).toBe("");
        expect(result.pitch).toBe(1);
    });

    test("plays a note with sharp accidental", () => {
        const data = "C#";
        const result = playNote(data, fakePlay);
        expect(result.freq).toBeCloseTo(554.37, 1);
        expect(result.accidental).toBe("sharp");
        expect(result.pitch).toBe(1);
    });

    test("plays a note with flat accidental", () => {
        const data = "Db";
        const result = playNote(data, fakePlay);
        expect(result.freq).toBeCloseTo(554.37, 1);
        expect(result.accidental).toBe("flat");
        expect(result.pitch).toBe(1);
    });

    test("plays a note with octave change", () => {
        const data = "C'";
        const result = playNote(data, fakePlay);
        expect(result.freq).toBeCloseTo(1046.50, 1);
        expect(result.accidental).toBe("");
        expect(result.pitch).toBe(2);
    });

    test("plays a note with multiple octave changes", () => {
        const data = "C''";
        const result = playNote(data, fakePlay);
        expect(result.freq).toBeCloseTo(2093.00, 1);
        expect(result.accidental).toBe("");
        expect(result.pitch).toBe(4);
    });

    test("plays a note with octave change and accidental", () => {
        const data = "C#'";
        const result = playNote(data, fakePlay);
        expect(result.freq).toBeCloseTo(1108.73, 1);
        expect(result.accidental).toBe("sharp");
        expect(result.pitch).toBe(2);
    });
});