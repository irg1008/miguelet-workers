
import { expect, test } from 'vitest';
import { convertOggToAcc } from './convert';
test('downloads and converts OGG to ACC', async () => {
    console.log("OKKOOL")
    const oggUrl = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
    const response = await fetch(oggUrl);
    const oggBlob = await response.blob();
    const accBlob = await convertOggToAcc(oggBlob);

    expect(accBlob).toBeInstanceOf(Blob);
    expect(accBlob.type).toBe('audio/acc');
    expect(accBlob.size).toBeGreaterThan(0);
});