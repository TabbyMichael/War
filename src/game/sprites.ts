export const loadGameAssets = async (): Promise<{ background: HTMLImageElement; bullet: HTMLImageElement }> => {
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  try {
    const [background, bullet] = await Promise.all([
      loadImage('/sprites/background-tile.png'),
      loadImage('/sprites/bullet.png')
    ]);

    return { background, bullet };
  } catch (error) {
    console.error('Error loading game assets:', error);
    throw error;
  }
};