import * as THREE from "three";

// Textúra betöltő inicializálása
const loader = new THREE.TextureLoader();

// Egy sprite létrehozása adott paraméterek alapján
function getSprite({ hasFog, color, opacity, path, pos, size }) {
  const spriteMat = new THREE.SpriteMaterial({
    color,
    fog: hasFog,
    map: loader.load(path),
    transparent: true,
    opacity,
  });

  // Kis véletlen színeltolás a természetesebb hatásért
  spriteMat.color.offsetHSL(0, 0, Math.random() * 0.2 - 0.1);

  const sprite = new THREE.Sprite(spriteMat);

  // Pozíció beállítása (Y tengely tükrözve)
  sprite.position.set(pos.x, -pos.y, pos.z);

  // Méret kis randomizálása
  size += Math.random() - 0.5;
  sprite.scale.set(size, size, size);

  // Kezdeti rotáció
  sprite.material.rotation = 0;

  return sprite;
}

// Egy réteg (layer) létrehozása több sprite-ból
function getLayer({
  hasFog = true,
  hue = 0.0,
  numSprites = 10,
  opacity = 1,
  path = "./rad-grad.png",
  radius = 1,
  sat = 0.5,
  size = 1,
  zOffset = 0,
}) {
  const layerGroup = new THREE.Group();

  for (let i = 0; i < numSprites; i += 1) {
    // Szögek alapján körkörös elhelyezés
    let angle = (i / numSprites) * Math.PI * 2;

    const position = new THREE.Vector3(
      Math.cos(angle) * Math.random() * radius,
      Math.sin(angle) * Math.random() * radius,
      zOffset + Math.random()
    );

    // Távolság a középponttól (nem használt, de későbbi színezéshez alkalmas lehet)
    const length = new THREE.Vector3(position.x, position.y, 0).length();

    // Szín generálása HSL alapján
    let color = new THREE.Color().setHSL(hue, 1, sat);

    const sprite = getSprite({
      hasFog,
      color,
      opacity,
      path,
      pos: position,
      size
    });

    layerGroup.add(sprite);
  }

  return layerGroup;
}

export default getLayer;