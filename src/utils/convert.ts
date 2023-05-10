import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

async function convertOggToAcc(oggBlob: Blob): Promise<Blob> {
    const ffmpeg = createFFmpeg({ log: true, corePath: "./node_modules/@ffmpeg/core/dist/ffmpeg-core.js" });
    await ffmpeg.load();

    ffmpeg.FS('writeFile', 'input.ogg', await fetchFile(oggBlob));
    await ffmpeg.run('-i', 'input.ogg', 'output.acc');

    const data = ffmpeg.FS('readFile', 'output.acc');
    const accBlob = new Blob([data.buffer], { type: 'audio/acc' });

    return accBlob;
}


export { convertOggToAcc };

