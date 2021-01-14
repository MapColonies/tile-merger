import Jimp from 'jimp';
const mergeTiles = async (target: string, ...files: string[]): Promise<void> => {
  const tiles: Promise<Jimp>[] = [];
  for (let i = 0; i < files.length; i++) {
    //validate that all images are png
    if (!(files[i].endsWith('png') || files[i].endsWith('PNG'))) {
      throw new Error('all tiles must be png');
    }
    const tile = Jimp.read(files[i]);
    tiles.push(tile);
  }
  const loadedTiles = await Promise.all(tiles);
  validate(loadedTiles);
  //merge all images first is on the bottom
  const composed = loadedTiles[0].clone();
  for (let i = 1; i < tiles.length; i++) {
    composed.composite(loadedTiles[i], 0, 0);
  }
  await composed.writeAsync(target);
};

const validate = (tiles: Jimp[]) => {
  const minTiles = 2;
  if (tiles.length < minTiles) throw new Error('only 1 tile');
  const width = tiles[0].getWidth();
  const height = tiles[0].getHeight();
  for (let i = 1; i < tiles.length; i++) {
    if (tiles[i].getWidth() !== width || tiles[i].getHeight() != height) {
      throw new Error('all tiles must have the same size');
    }
  }
};

export { mergeTiles };
